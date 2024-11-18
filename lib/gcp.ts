import { User } from "@/queries";
import { Storage } from "@google-cloud/storage";
import { randomUUID } from "crypto";

export class GCPUpload {
  private readonly client: Storage;
  private readonly bucketName: string;

  constructor() {
    if (process.env.NODE_ENV === "production") {
      this.client = new Storage();
    } else {
      this.client = new Storage({
        projectId: process.env.GCP_PROJECT_ID,
        credentials: {
          client_email: process.env.GCP_CLIENT_EMAIL,
          private_key: process.env.GCP_PRIVATE_KEY,
        },
      });
    }
    this.bucketName = process.env.GCP_BUCKET_NAME!;
  }

  async getSignedUrl(user: Partial<User>) {
    if (!user.email) throw new Error();

    const folderName = `${user?.email.toLowerCase()}`;
    const destFileName = randomUUID();

    const bucket = this.client.bucket(this.bucketName);

    const fileToUpload = bucket.file(`${folderName}/${destFileName}`);

    const [url] = await fileToUpload.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 60 * 60 * 1000 * 24, // 1 day,
    });

    return { url, key: destFileName };
  }
}
