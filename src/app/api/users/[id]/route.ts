import { profileSchema } from "@/utils/zod/schemas";
import { validate } from "@/utils/zod/validate";
import prisma from "../../../../../prisma/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id)
      return Response.json(
        { success: false, message: "invalid id,id not found " },
        { status: 400 },
      );

    const isExits = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!isExits)
      return Response.json(
        { success: false, message: "user not found" },
        { status: 404 },
      );

    const body = await req.json();

    const validatedData = validate(profileSchema, body);

    if (!validatedData.success) {
      return Response.json(
        { success: false, message: validatedData.error },
        { status: 422 },
      );
    }
    const { name } = validatedData.data;

    const user = await prisma.user.update({
      where: { id },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user)
      return Response.json(
        { success: false, message: "failed to update user" },
        { status: 400 },
      );

    return Response.json(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        },
        message: "User updated Successful",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message:
          error.meta.driverAdapterError.cause.kind || "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
