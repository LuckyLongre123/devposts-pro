import { cache } from "react";
import { cookies } from "next/headers";
import prisma from "../../prisma/lib/prisma";
import { verifyJWT } from "./jwt-utils";

export const getAuthenticatedUser = cache(async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const decoded = await verifyJWT(token);
    if (!decoded) return null;

    return await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, aiTokens: true },
    });
  } catch (error) {
    return null;
  }
});
