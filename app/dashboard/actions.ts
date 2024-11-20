"use server";

import { authOptions } from "@/lib/auth";
import { GCPUpload } from "@/lib/gcp";
import { getUser, User } from "@/queries";
import {
  createApp,
  CreateAppOptions,
  deleteApp,
  DeleteAppOptions,
  getApp,
  GetAppOptions,
  GetAppsOptions,
  updateApp,
  UpdateAppOptions,
} from "@/queries/app";
import { getApps } from "@/queries/app";
import {
  createUpload,
  CreateUploadOptions,
  deleteUpload,
  DeleteUploadOptions,
  getUpload,
  GetUploadOptions,
  getUploads,
  GetUploadsOptions,
  UpdateUploadOptions,
  Upload,
} from "@/queries/uploads";
import { getServerSession } from "next-auth";

async function createNewUpload(options: CreateUploadOptions): Promise<Upload> {
  return await createUpload(options);
}

async function updateUpload(options: UpdateUploadOptions): Promise<Upload> {
  return await updateUpload(options);
}

async function downloadFile(options: GetUploadOptions) {
  const gcpUpload = new GCPUpload();
  const [upload, user] = await Promise.all([
    getUpload(options),
    getCurrentUser(),
  ]);

  if (!user || !upload) return null;

  return await gcpUpload.downloadFile(user, upload.key);
}

async function deleteServerUpload(
  options: DeleteUploadOptions
): Promise<Upload | null> {
  try {
    const gcpUpload = new GCPUpload();
    const [upload, user] = await Promise.all([
      getUpload(options),
      getCurrentUser(),
    ]);

    if (!user || !upload) return null;

    const [deletedUpload] = await Promise.all([
      deleteUpload(options),
      gcpUpload.deleteFile(user, upload.key),
    ]);

    return deletedUpload;
  } catch (error) {
    return null;
  }
}

async function getGCPSignedUrl(filename: string) {
  try {
    const gcpUpload = new GCPUpload();
    const user = await getCurrentUser();
    if (!user) return null;

    return await gcpUpload.getSignedUrl(user, filename);
  } catch (error) {
    console.error({ error });
    return null;
  }
}

async function getSession() {
  return await getServerSession(authOptions);
}

async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();

  if (!session?.user?.email) return null;

  const user = await getUser({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
    },
  });

  return user;
}

async function getUserUploads(options: GetUploadsOptions) {
  return await getUploads(options);
}

async function getUserApp(options: GetAppOptions) {
  return await getApp(options);
}

async function getUserApps(options: GetAppsOptions) {
  return await getApps(options);
}

async function createUserApp(options: CreateAppOptions) {
  return await createApp(options);
}

async function updateUserApp(options: UpdateAppOptions) {
  return await updateApp(options);
}

async function deleteUserApp(options: DeleteAppOptions) {
  const app = await getApp(options);
  if (!app) return null;

  // Check if the app has any uploads
  const uploads = await getUploads({ where: { appId: app.id } });
  if (uploads.length > 0) {
    throw new Error("App has uploads, cannot delete");
  }

  return await deleteApp(options);
}

export {
  createNewUpload,
  updateUpload,
  downloadFile,
  deleteServerUpload,
  getGCPSignedUrl,
  getSession,
  getCurrentUser,
  getUserUploads,
  getUserApps,
  createUserApp,
  updateUserApp,
  deleteUserApp,
  getUserApp,
};
