/**
 * OpenGraph Image Generator & Social Media Utilities
 * Generates Open Graph metadata for social media sharing
 */

/**
 * Extract clean text from markdown
 */
function cleanMarkdown(text: string): string {
  return text
    .replace(/[#*`_~\[\]()]/g, "") // Remove markdown syntax
    .replace(/\n+/g, " ") // Replace newlines with spaces
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim();
}

/**
 * Generate excerpt from post content
 * Optimized for social media (150-200 characters)
 */
export function generatePostExcerpt(
  content: string,
  length: number = 160,
): string {
  const cleaned = cleanMarkdown(content);

  if (cleaned.length <= length) {
    return cleaned;
  }

  // Truncate at length and find the last complete word
  let excerpt = cleaned.substring(0, length);
  const lastSpaceIndex = excerpt.lastIndexOf(" ");

  if (lastSpaceIndex > length * 0.7) {
    // Only truncate at word boundary if it's close enough
    excerpt = excerpt.substring(0, lastSpaceIndex);
  }

  return excerpt.trim() + "...";
}

export async function generateOpenGraphImage(
  title: string,
  author?: string,
): Promise<string> {
  // Using Open Graph Images API service
  // You can replace this with your own image generation service

  // Example using a free OG image generation service
  const params = new URLSearchParams({
    title,
    author: author || "",
    theme: "dark",
  });

  return `https://og.example.com/api/og?${params.toString()}`;
}

/**
 * Post-specific OG Image URL generator
 */
export function getPostOGImageUrl(postId: string, title: string): string {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Using the built-in /api/og endpoint
  return `${baseUrl}/api/og?title=${encodeURIComponent(title)}&postId=${postId}`;
}

/**
 * Generate rich preview metadata for posts
 * Optimized for social media sharing with thumbnail
 */
export function getPostPreviewMetadata(post: {
  id: string;
  title: string;
  body: string;
  thumbnailUrl?: string;
  author?: {
    name: string;
  };
  createdAt?: string;
}) {
  const excerpt = generatePostExcerpt(post.body, 160);
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Use thumbnail if available, otherwise use default
  const imageUrl = post.thumbnailUrl || `${baseUrl}/default-thumbnail.png`;

  return {
    title: post.title,
    description: excerpt,
    image: imageUrl,
    author: post.author?.name || "DevPostS Pro",
    url: `${baseUrl}/posts/${post.id}`,
    publishedDate: post.createdAt,
  };
}

/**
 * Generate share URLs for different platforms
 */
export function generateShareUrls(post: {
  id: string;
  title: string;
  body: string;
  author?: { name: string };
}) {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const postUrl = `${baseUrl}/posts/${post.id}`;
  const title = encodeURIComponent(post.title);
  const excerpt = encodeURIComponent(generatePostExcerpt(post.body, 140));

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${title}&via=devpostspro`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
    whatsapp: `https://wa.me/?text=${title}%20${encodeURIComponent(postUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${title}`,
    email: `mailto:?subject=${title}&body=${excerpt}%0A%0A${encodeURIComponent(postUrl)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(postUrl)}&title=${title}`,
  };
}

/**
 * Check if Web Share API is available
 */
export function isWebShareAvailable(): boolean {
  return typeof navigator !== "undefined" && !!navigator.share;
}

/**
 * Handle native sharing using Web Share API
 */
export async function sharePost(post: {
  id: string;
  title: string;
  body: string;
  author?: { name: string };
}): Promise<boolean> {
  if (!isWebShareAvailable()) {
    return false;
  }

  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const excerpt = generatePostExcerpt(post.body, 140);

    await navigator.share({
      title: post.title,
      text: excerpt,
      url: `${baseUrl}/posts/${post.id}`,
    });

    return true;
  } catch (error) {
    // User cancelled or error occurred
    console.error("Share failed:", error);
    return false;
  }
}
