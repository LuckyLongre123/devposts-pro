import prisma from "../../../../../../prisma/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);

    const isPublish = searchParams.get("published") === "true";

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return Response.json(
        { success: false, message: "Post not found" },
        { status: 404 },
      );
    }

    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return Response.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    if (existingPost.authorId !== userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (user?.role !== "admin") {
        return Response.json(
          { success: false, message: "Unauthorized" },
          { status: 403 },
        );
      }
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { published: isPublish },
    });

    return Response.json({ success: true, data: updatedPost }, { status: 200 });
  } catch (error: any) {
    console.error("PUBLISH ERROR:", error);
    return Response.json(
      { success: false, message: error?.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
