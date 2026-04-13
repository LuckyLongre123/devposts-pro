import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./lib/jwt-utils";
import prisma from "../prisma/lib/prisma";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  // Admin routes that require authentication and admin role
  if (pathname.startsWith("/dashboard/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    try {
      const decoded = await verifyJWT(token);
      if (!decoded) {
        return NextResponse.redirect(new URL("/signin", request.url));
      }

      // Fetch user to check role
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { role: true },
      });

      if (!user || user.role !== "admin") {
        return NextResponse.redirect(new URL("/403", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  if (pathname.includes("/api/auth")) return NextResponse.next();

  const isAuthPage =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");
  const isProtectedPage =
    pathname.startsWith("/dashboard") || pathname.startsWith("/profile");
  const isApiRoute = pathname.startsWith("/api");

  if (token) {
    const payload = await verifyJWT(token);

    if (!payload && (isProtectedPage || isApiRoute)) {
      const response = isApiRoute
        ? NextResponse.json(
            { success: false, message: "Invalid Token" },
            { status: 401 },
          )
        : NextResponse.redirect(new URL("/signin", request.url));

      response.cookies.delete("token");
      return response;
    }

    if (payload) {
      if (isAuthPage) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", payload.id);

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    }
  }

  if (!token && (isProtectedPage || isApiRoute)) {
    if (isApiRoute) {
      return NextResponse.json(
        { success: false, message: "Auth required" },
        { status: 401 },
      );
    }
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/dashboard/admin/:path*",
    "/signin",
    "/signup",
    "/profile",
    "/api/:path*",
  ],
};
