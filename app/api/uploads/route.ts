import { getUploads } from "@/queries";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File;

    const filename = formData.get("filename") as string;

    return NextResponse.json({});
  } catch (error) {
    console.error({ error });
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const uploads = await getUploads({});

    return NextResponse.json(uploads);
  } catch (error) {
    console.error({ error });
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
