import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type GetUploadsOptions = {
  select?: Prisma.UploadSelect;
  where?: Prisma.UploadWhereInput;
  orderBy?: Prisma.UploadOrderByWithRelationInput;
  take?: number;
  skip?: number;
};

export type GetUploadOptions = {
  where: Prisma.UploadWhereUniqueInput;
  select?: Prisma.UploadSelect;
};

export type CreateUploadOptions = {
  input: {
    userId: string;
    key: string;
    name: string;
    size: number;
    type: string;
    lastModified: Date;
  };
  select?: Prisma.UploadSelect;
};

export type UpdateUploadOptions = {
  where: Prisma.UploadWhereUniqueInput;
  input: Prisma.UploadUpdateInput;
  select?: Prisma.UploadSelect;
};

export type DeleteUploadOptions = {
  where: Prisma.UploadWhereUniqueInput;
};

export type Upload = Prisma.UploadGetPayload<{
  select: {
    id: true;
    key: true;
    name: true;
    size: true;
    type: true;
    lastModified: true;
    createdAt: true;
  };
}>;

async function getUpload(options: GetUploadOptions) {
  const { where, select } = options;

  try {
    const upload = await prisma.upload.findFirst({ where, select });
    return upload;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function getUploads(options: GetUploadsOptions): Promise<Upload[]> {
  try {
    const uploads = await prisma.upload.findMany(options);
    return uploads;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function createUpload(options: CreateUploadOptions) {
  const { input, select } = options;

  const { userId, ...restInput } = input;

  try {
    const upload = await prisma.upload.create({
      data: {
        ...restInput,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      select: select,
    });

    return upload;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function updateUpload(options: UpdateUploadOptions) {
  const { where, input, select } = options;

  try {
    const upload = await prisma.upload.update({
      where,
      data: input,
      select: select,
    });

    return upload;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function deleteUpload(options: DeleteUploadOptions) {
  const { where } = options;

  try {
    const upload = await prisma.upload.delete({ where });
    return upload;
  } catch (error: any) {
    throw new Error(error);
  }
}

export { getUpload, getUploads, createUpload, updateUpload, deleteUpload };
