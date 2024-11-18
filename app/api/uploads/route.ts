import { authOptions } from "@/lib/auth";
import { GCPUpload } from "@/lib/gcp";
import { prisma } from "@/lib/prisma";
import { createUpload, getUploads } from "@/queries";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    const uploads = await getUploads({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        ...(userId ? { userId } : {}),
      },
    });

    return NextResponse.json(uploads);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextApiRequest) {
  try {
    const requestBody = await request.body;

    const upload = await createUpload({
      input: {
        ...requestBody,
        lastModified: new Date(requestBody.lastModified),
      },
    });

    return NextResponse.json({ upload });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const gcpUpload = new GCPUpload();

  const session = (await getServerSession(authOptions)) as {
    user: {
      name: string;
      email: string;
      image: string;
    };
  };

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
    select: {
      name: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const signedUrl = await gcpUpload.getSignedUrl(user);

    return NextResponse.json(signedUrl);
  } catch (error) {
    console.error({ error });
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};
