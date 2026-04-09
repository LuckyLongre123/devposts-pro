import { getSinglePost } from "@/lib/data";
import PostDisplay from "./PostDisplay";
import { PostType } from "@/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PostDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const id = param.id;

  if (!id) {
    redirect("/posts?error=failed_fetch");
  }

  let postData: PostType | null = null;
  let hasError = false;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const data = await getSinglePost(id);
    
    // @ts-ignore or cast
    postData = data.data;
  } catch (error: any) {
    console.log("PostDetail Error:", error.message);
    hasError = true;
  }

  if (hasError || !postData) {
    redirect("/posts?error=failed_fetch");
  }

  return <PostDisplay initialPost={postData} />;
}
