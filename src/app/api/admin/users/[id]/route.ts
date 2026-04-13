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

    const { name, email, role, aiTokens } = body;

    // Validate email if being updated
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== id) {
        return Response.json(
          { success: false, message: "Email already in use" },
          { status: 422 },
        );
      }
    }

    // Validate aiTokens if being updated
    if (aiTokens !== undefined) {
      if (!Number.isInteger(aiTokens) || aiTokens < 0) {
        return Response.json(
          {
            success: false,
            message: "AI Tokens must be a non-negative integer",
          },
          { status: 422 },
        );
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (aiTokens !== undefined) updateData.aiTokens = aiTokens;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        aiTokens: true,
      },
    });

    return Response.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    console.error("PUT USER ERROR:", error);
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;

    // Check if this is the last admin
    const adminCount = await prisma.user.count({
      where: { role: "admin" },
    });

    const userToDelete = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (userToDelete?.role === "admin" && adminCount <= 1) {
      return Response.json(
        { success: false, message: "Cannot delete the last admin" },
        { status: 422 },
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return Response.json(
      { success: true, message: "User deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
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
