import { validate } from "@/utils/zod/validate";
import prisma from "../../../../../prisma/lib/prisma";
import { postSchema } from "@/utils/zod/schemas";
import { getAuthenticatedUser } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser();

    if (!user) {
      return Response.json(
        { success: false, message: "Unauthorized: Please sign in" },
        { status: 401 },
      );
    }

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

    // ✅ Authorization check: Only author or admin can edit
    const isAuthor = existingPost.authorId === user.id;
    const isAdmin = user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return Response.json(
        { success: false, message: "Unauthorized: You cannot edit this post" },
        { status: 403 },
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
    const user = await getAuthenticatedUser();

    if (!user) {
      return Response.json(
        { success: false, message: "Unauthorized: Please sign in" },
        { status: 401 },
      );
    }

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

    // ✅ Authorization check: Only author or admin can delete
    const isAuthor = existingPost.authorId === user.id;
    const isAdmin = user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized: You cannot delete this post",
        },
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
