import { User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import { redirect } from "next/dist/server/api-utils";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: User }) {
      try {
        if (!user.email) return false;

        const existingUser = await prisma.user.findFirst({
          where: { email: user.email },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: { email: user.email, name: user.name, avatar: user.image },
            select: { id: true },
          });
        }

        return true;
      } catch (err) {
        return false;
      }
    },
    async signOut() {
      return true;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      console.log({ url, baseUrl });
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};
