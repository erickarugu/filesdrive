import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type GetUserOptions = {
  where: Prisma.UserWhereUniqueInput;
  select?: Prisma.UserSelect;
};

export type GetUsersOptions = {
  where?: Prisma.UserWhereInput;
  select?: Prisma.UserSelect;
  orderBy?: Prisma.UserOrderByWithRelationInput;
  take?: number;
  skip?: number;
};

export type User = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    avatar: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

async function getUser(options: GetUserOptions) {
  const { where, select } = options;

  try {
    const user = await prisma.user.findFirst({ where, select });
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function getUsers(options: GetUsersOptions) {
  try {
    const users = await prisma.user.findMany(options);
    return users;
  } catch (error: any) {
    throw new Error(error);
  }
}

export { getUser, getUsers };
