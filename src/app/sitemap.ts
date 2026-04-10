import { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/data";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/**
 * Dynamic Sitemap for DevPostS Pro
 * Automatically includes all published posts
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base pages with static priority
  const basePages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/posts`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  // Fetch published posts for individual post pages
  let postsEntries: MetadataRoute.Sitemap = [];

  try {
    // Fetch posts - adjust limit if needed to get all posts
    const data = await getPublishedPosts(
      "",
      1,
      1000,
      "latest",
      "",
      "",
      "published",
      false,
    );

    // @ts-ignore
    if (data.posts && Array.isArray(data.posts)) {
      // @ts-ignore
      postsEntries = data.posts.map((post: any) => ({
        url: `${BASE_URL}/posts/${post.id}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error);
  }

  return [...basePages, ...postsEntries];
}
