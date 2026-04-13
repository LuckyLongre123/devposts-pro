import { requireAdmin } from "@/lib/admin-utils";
import prisma from "../../../../../../prisma/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const { title, published } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (published !== undefined) updateData.published = published;

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        published: true,
      },
    });

    return Response.json({ success: true, data: post }, { status: 200 });
  } catch (error) {
    console.error("PUT POST ERROR:", error);
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 },
    );
  }
}
