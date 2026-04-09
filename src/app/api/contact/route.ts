import { contactSchema } from "@/utils/zod/schemas";
import { validate } from "@/utils/zod/validate";
import prisma from "../../../../prisma/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = validate(contactSchema, body);

    if (!validatedData.success) {
      return Response.json(
        { success: false, message: validatedData.error },
        { status: 422 },
      );
    }

    const { name, email, message } = validatedData.data;

    await prisma.message.create({
      data: { name, email, message },
    });

    return Response.json(
      {
        success: true,
        message: "Message sent successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
