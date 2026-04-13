import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const user = await getAuthenticatedUser();

    // Check if user is admin
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the post and include its likes with user details
    // Using distinct: ["userId"] to ensure no duplicate users show up
    const likes = await prisma.like.findMany({
      where: { postId },
      distinct: ["userId"],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Flatten the result to return a list of users
    const users = likes.map((like) => like.user);

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Failed to fetch likes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
