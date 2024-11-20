import { User } from "@/queries";
import { ServiceAccount, Storage } from "@google-cloud/storage";
import { randomUUID } from "crypto";

export class GCPUpload {
  private readonly client: Storage;
  private readonly bucketName: string;

  constructor() {
    const base64EncodedServiceAccount =
      process.env.GCP_BASE64_ENCODED_CREDENTIALS!;


    const decodedServiceAccount = Buffer.from(
      base64EncodedServiceAccount,
      "base64"
    ).toString("utf-8");
    const credentials = JSON.parse(decodedServiceAccount);

    this.client = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      credentials,
    });

    this.bucketName = process.env.GCP_BUCKET_NAME!;
  }

  async getSignedUrl(user: Partial<User>, filename: string) {
    if (!user.email) throw new Error();

    const folderName = `${user?.email.toLowerCase()}`;
    const fileExtension = filename.split(".").pop();
    const destFileName = `${randomUUID()}.${fileExtension}`;

    const bucket = this.client.bucket(this.bucketName);

    const fileToUpload = bucket.file(`${folderName}/${destFileName}`);

    const [url] = await fileToUpload.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 60 * 60 * 1000 * 24, // 1 day,
    });

    return { url, key: destFileName };
  }

  async downloadFile(user: Partial<User>, key: string) {
    if (!user.email) throw new Error();

    const fileKey = `${user?.email.toLowerCase()}/${key}`;

    const bucket = this.client.bucket(this.bucketName);

    await bucket.file(fileKey).download();
  }

  async deleteFile(user: Partial<User>, key: string) {
    if (!user.email) throw new Error();

    const fileKey = `${user?.email.toLowerCase()}/${key}`;

    const bucket = this.client.bucket(this.bucketName);

    return await bucket.file(fileKey).delete();
  }
}
