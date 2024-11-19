import { prisma } from "@/lib/prisma";
import { Prisma, Upload } from "@prisma/client";

export type GetAppsOptions = {
  where?: Prisma.AppWhereInput;
  select?: Prisma.AppSelect;
  orderBy?: Prisma.AppOrderByWithRelationInput;
};

export type GetAppOptions = {
  where: Prisma.AppWhereUniqueInput;
  select?: Prisma.AppSelect;
  _count?: Prisma.AppCountArgs;
};

export type CreateAppOptions = {
  input: {
    name: string;
    userId: string;
  };
  select?: Prisma.AppSelect;
};

export type UpdateAppOptions = {
  where: Prisma.AppWhereUniqueInput;
  input: Prisma.AppUpdateInput;
  select?: Prisma.AppSelect;
};

export type DeleteAppOptions = {
  where: Prisma.AppWhereUniqueInput;
  select?: Prisma.AppSelect;
};

export type App = Prisma.AppGetPayload<{
  select: {
    id: true;
    name: true;
  };
}> & {
  _count?: {
    uploads: number;
  };
  _sum?: {
    uploads: {
      size: number;
    };
  };
};

async function getApp(options: GetAppsOptions): Promise<App | null> {
  try {
    const app = await prisma.app.findFirst(options);
    return app;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function createApp(options: CreateAppOptions): Promise<App> {
  const { input, select } = options;

  const { userId, ...restInput } = input;
  try {
    const app = await prisma.app.create({
      data: {
        ...restInput,
        user: { connect: { id: userId } },
      },
      select,
    });
    return app;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function updateApp(options: UpdateAppOptions): Promise<App> {
  const { where, input, select } = options;

  try {
    const app = await prisma.app.update({ where, data: input, select });
    return app;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function deleteApp(options: DeleteAppOptions): Promise<App> {
  const { where, select } = options;

  try {
    const app = await prisma.app.delete({ where, select });
    return app;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function getApps(options: GetAppsOptions): Promise<App[]> {
  try {
    const apps = (await prisma.app.findMany({
      ...options,
    })) as unknown as (App & { uploads: Upload[] })[];

    return apps.map((app) => ({
      ...app,
      _sum: {
        uploads: {
          size: app.uploads.reduce((sum, upload) => sum + upload.size, 0),
        },
      },
      uploads: undefined, // Remove uploads from final result
    }));
  } catch (error: any) {
    throw new Error(error);
  }
}

export { getApp, createApp, getApps, updateApp, deleteApp };
