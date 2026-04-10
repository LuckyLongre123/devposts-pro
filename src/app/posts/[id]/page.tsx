import type { Metadata } from "next";
import { getSinglePost } from "@/lib/data";
import PostDisplay from "./PostDisplay";
import { PostType } from "@/types";
import { redirect } from "next/navigation";
import { generateArticleMetadata } from "@/lib/seo-config";
import { generatePostExcerpt } from "@/lib/og-generator";
import { DEFAULT_THUMBNAIL } from "@/constants/thumbnails";
import { getAuthenticatedUser } from "@/lib/auth";
import SignInModal from "../../../../components/SignInModal";

export const dynamic = "force-dynamic";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const param = await params;

  // ✅ FIX: Optional chaining (?.id) use kiya taaki undefined par crash na ho
  const id = param?.id;

  if (!id) {
    return {
      title: "Post Not Found | DevPostS Pro",
      description: "The post you're looking for doesn't exist.",
    };
  }

  try {
    const data = await getSinglePost(id);
    // @ts-ignore
    const post: PostType = data.data;

    if (!post) {
      return {
        title: "Post Not Found | DevPostS Pro",
        description: "The post you're looking for doesn't exist.",
      };
    }

    const description = generatePostExcerpt(post.body, 160);

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    let imageUrl: string;
    if (post.thumbnailUrl) {
      // Ensure cloudinary URLs or other absolute URLs are preserved
      imageUrl = post.thumbnailUrl.startsWith("http")
        ? post.thumbnailUrl
        : `${baseUrl}${post.thumbnailUrl}`;
    } else {
      imageUrl = `${baseUrl}${DEFAULT_THUMBNAIL}`;
    }

    return generateArticleMetadata(post.title, description, {
      pathname: `/posts/${post.id}`,
      author: post.author?.name || "Anonymous",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      image: imageUrl,
      tags: ["blog", "post", "article"],
    });
  } catch (error: any) {
    console.error("generateMetadata Error:", error.message);
    return {
      title: "Post Not Found | DevPostS Pro",
      description: "The post you're looking for doesn't exist.",
    };
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PostDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const user = await getAuthenticatedUser();

  // ✅ FIX: Yahan bhi optional chaining (?.id) add kar di
  const id = param?.id;

  if (!id) {
    redirect("/posts?error=failed_fetch");
  }

  let postData: PostType | null = null;
  let hasError = false;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const data = await getSinglePost(id, user?.id);

    // @ts-ignore or cast
    postData = data.data;
  } catch (error: any) {
    console.log("PostDetail Error:", error.message);
    hasError = true;
  }

  if (hasError || !postData) {
    redirect("/posts?error=failed_fetch");
  }

  if (!user) return <SignInModal postId={postData.id} />;

  return <PostDisplay initialPost={postData} />;
}
