// app/api/posts/[id]/like/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "../../../../../../prisma/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const postId = resolvedParams.id;
    
    // Auth logic (Middleware se user ID nikalna)
    const incomingHeaders = await headers();
    const userId = incomingHeaders.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Please sign in to like posts." },
        { status: 401 }
      );
    }

    // Check karo ki is user ne is post ko already like kiya hai ya nahi
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // Agar pehle se like hai, toh UNLIKE (delete) kar do
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      return NextResponse.json({ success: true, liked: false });
    } else {
      // Agar like nahi hai, toh LIKE (create) kar do
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      return NextResponse.json({ success: true, liked: true });
    }
  } catch (error: any) {
    console.error("Like API Error:", error.message);
    return NextResponse.json(
      { success: false, message: "Something went wrong!" },
      { status: 500 }
    );
  }
}