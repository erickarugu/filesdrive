"use server";

import { authOptions } from "@/lib/auth";
import { GCPUpload } from "@/lib/gcp";
import { getUser, User } from "@/queries";
import {
  createUpload,
  CreateUploadOptions,
  getUploads,
  GetUploadsOptions,
  Upload,
} from "@/queries/uploads";
import { getServerSession } from "next-auth";

async function createNewUpload(options: CreateUploadOptions): Promise<Upload> {
  return await createUpload(options);
}

async function getGCPSignedUrl() {
  const gcpUpload = new GCPUpload();

  const user = await getCurrentUser();

  if (!user) return null;

  try {
    return await gcpUpload.getSignedUrl(user);
  } catch (error) {
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

export {
  createNewUpload,
  getGCPSignedUrl,
  getSession,
  getCurrentUser,
  getUserUploads,
};
