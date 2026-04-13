import { getAuthenticatedUser } from "./auth";
import { User } from "@prisma/client";

/**
 * Check if the authenticated user has admin role
 * Returns the user if admin, throws error if not
 */
export async function requireAdmin(): Promise<User & { role: "admin" }> {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }

  if (user.role !== "admin") {
    throw new Error("Forbidden: Admin access required");
  }

  return user as User & { role: "admin" };
}

/**
 * Check if user has admin access
 * Used for conditional rendering in UI
 */
export async function isUserAdmin(): Promise<boolean> {
  const user = await getAuthenticatedUser();
  // @ts-ignore
  return user?.role === "admin" ?? false;
}
