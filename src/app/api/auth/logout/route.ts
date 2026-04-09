import { cookies } from "next/headers";

export async function POST() {
  (await cookies()).delete("token");
  
  const response = Response.json(
    {
      success: true,
      message: "Logout successfully.",
    },
    { status: 200 },
  );

  response.headers.set("Set-Cookie", "token=; Path=/; Max-Age=0; HttpOnly");

  return response;
}
