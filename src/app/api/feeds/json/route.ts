import { getPublishedPosts } from "@/lib/data";
import { NextResponse } from "next/server";

/**
 * JSON Feed for DevPostS Pro blog
 * Modern feed format for content discovery
 * @see https://jsonfeed.org
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    // Fetch latest posts
    const data = await getPublishedPosts(
      "",
      1,
      50,
      "latest",
      "",
      "",
      "published",
      false,
    );

    // @ts-ignore
    const posts = data.posts || [];

    const feed = {
      version: "https://jsonfeed.org/version/1.1",
      title: "DevPostS Pro - Blog Feed",
      home_page_url: baseUrl,
      feed_url: `${baseUrl}/api/feeds/json`,
      description:
        "Share your independent thoughts on DevPostS Pro. A distraction-free platform for writers and creators.",
      language: "en",
      author: {
        name: "DevPostS Pro",
        url: baseUrl,
      },
      icon: `${baseUrl}/favicon.ico`,
      favicon: `${baseUrl}/favicon.ico`,
      items: posts.map((post: any) => ({
        id: post.id,
        url: `${baseUrl}/posts/${post.id}`,
        title: post.title,
        content_html: post.body,
        summary: post.body.substring(0, 200),
        date_published: new Date(post.createdAt).toISOString(),
        date_modified: new Date(post.updatedAt).toISOString(),
        author: post.author
          ? {
              name: post.author.name,
              url: `${baseUrl}/profile/${post.author.id}`,
            }
          : undefined,
        tags: ["blog", "post"],
      })),
    };

    return NextResponse.json(feed, {
      headers: {
        "Content-Type": "application/feed+json; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("JSON Feed Generation Error:", error);
    return new NextResponse("Error generating JSON feed", { status: 500 });
  }
}
