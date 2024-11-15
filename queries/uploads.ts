import { getClientAuthToken } from "@/lib/client";

const apiURL = process.env.apiUrl;

async function getUploads() {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getClientAuthToken()}`,
      },
    };
    const response = await fetch(`${apiURL}/upload`, {
      method: "GET",
      ...config,
    });

    return response.json();
  } catch (error: any) {
    console.error({ error });
    throw new Error(error);
  }
}

export async function getUploadSignedUrl(filename: string): Promise<string> {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getClientAuthToken()}`,
      },
    };
    const response = await fetch(`${apiURL}/upload/get-signed-url`, {
      method: "POST",
      body: JSON.stringify({ fileName: filename }),
      ...config,
    });

    const { url } = await response.json();

    return url;
  } catch (error: any) {
    console.error({ error });
    throw new Error(error);
  }
}

export { getUploads };
