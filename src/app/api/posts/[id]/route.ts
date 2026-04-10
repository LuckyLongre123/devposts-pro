import { validate } from "@/utils/zod/validate";
import prisma from "../../../../../prisma/lib/prisma";
import { postSchema } from "@/utils/zod/schemas";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const reqBody = await req.json();

    const validatedData = validate(postSchema, reqBody);

    if (!validatedData.success) {
      return Response.json(
        { success: false, message: validatedData.error },
        { status: 422 },
      );
    }

    const { body, title } = validatedData.data;
    const { thumbnailUrl } = reqBody; // Extract thumbnailUrl from request

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return Response.json(
        { success: false, message: "Post not found" },
        { status: 404 },
      );
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        body,
        thumbnailUrl:
          thumbnailUrl !== undefined ? thumbnailUrl : existingPost.thumbnailUrl, // Update if provided
      },
    });

    return Response.json(
      {
        success: true,
        data: updatedPost,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("PUT ERROR FULL:", error);
    console.error("MESSAGE:", error?.message);
    console.error("STACK:", error?.stack);

    return Response.json(
      { success: false, message: error?.message || "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        { success: false, message: "invalid id" },
        { status: 422 },
      );
    }

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return Response.json(
        { success: false, message: "Post not found" },
        { status: 404 },
      );
    }

    // 🔐 OPTIONAL (recommended): auth check
    const userId = req.headers.get("x-user-id");
    if (existingPost.authorId !== userId) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );
    }

    await prisma.post.delete({
      where: { id },
    });

    return Response.json(
      {
        success: true,
        message: "Post deleted successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("DELETE ERROR:", error);

    return Response.json(
      { success: false, message: error?.message || "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        { success: false, message: "invalid id" },
        { status: 422 },
      );
    }

    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });

    if (!existingPost) {
      return Response.json(
        { success: false, message: "Post not found" },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        data: existingPost,
        message: "Post retrieved successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("DELETE ERROR:", error);

    return Response.json(
      { success: false, message: error?.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
