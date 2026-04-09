import { signInSchema } from "@/utils/zod/schemas";
import { validate } from "@/utils/zod/validate";
import prisma from "../../../../../prisma/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = validate(signInSchema, body);

    if (!validatedData.success) {
      return Response.json(
        { success: false, message: validatedData.error },
        { status: 422 },
      );
    }

    const { email, password } = validatedData.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user)
      return Response.json(
        { success: false, message: "invalid email or password!" },
        { status: 401 },
      );

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return Response.json(
        { success: false, message: "invalid email or password!" },
        { status: 401 },
      );

    // sign token
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );

    const response = Response.json(
      {
        success: true,
        data: {
          user: {
            name: user.name,
            email: user.email,
          },
          token,
        },
        message: "Login Successful",
      },
      { status: 200 },
    );

    response.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; ${
        process.env.NODE_ENV === "production" ? "Secure;" : ""
      } SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`,
    );

    return response;
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
