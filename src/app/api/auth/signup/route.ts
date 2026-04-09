// POST

import { signUpSchema } from "@/utils/zod/schemas";
import { validate } from "@/utils/zod/validate";
import prisma from "../../../../../prisma/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = validate(signUpSchema, body);

    if (!validatedData.success) {
      return Response.json(
        { success: false, message: validatedData.error },
        { status: 422 },
      );
    }

    const { name, email, password } = validatedData.data;

    const isExisted = await prisma.user.findUnique({
      where: { email },
    });

    if (isExisted)
      return Response.json(
        { success: false, message: "Email already exists!" },
        { status: 409 },
      );

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (!user)
      return Response.json(
        { success: false, message: "failed to register user!!" },
        { status: 400 },
      );

    return Response.json(
      {
        success: true,
        message: "User register successfully. please login",
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
