/**
 * SEO Configuration for DevPostS Pro
 * Centralized SEO metadata and constants
 */

const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const APP_NAME = "DevPostS Pro";
const BRAND_NAME = "DEVNOTES.PRO";

export const SEO_CONFIG = {
  baseUrl: BASE_URL,
  appName: APP_NAME,
  brandName: BRAND_NAME,
  title: "DevPostS Pro | Professional Writing Platform",
  description:
    "DevPostS Pro is the ultimate destination for independent thinkers. Write, publish, and share your technical insights and creative stories on a clean, distraction-free platform designed for modern developers.",
  keywords: [
    "blogging platform",
    "independent writing",
    "content creation",
    "creative writing",
    "publishing platform",
    "developer blog",
    "tech writing",
    "thought leadership",
  ],
  author: "DevPostS Pro Team",
  locale: "en_US",
  type: "website",
  // Default OG Image (18:9 aspect ratio recommended)
  // Using existing default-thumbnail.png from public directory
  defaultOgImage: `${BASE_URL}/default-thumbnail.png`,
  // Twitter Handle (update with your actual handle)
  twitterHandle: "@devpostspro",
};

/**
 * Generate metadata object for a page
 */
export function generateMetadata(
  pageTitle: string,
  pageDescription: string,
  options: {
    pathname?: string;
    ogImage?: string;
    ogType?: "website" | "article" | "profile";
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    tags?: string[];
    noindex?: boolean;
  } = {},
) {
  const {
    pathname = "",
    ogImage = SEO_CONFIG.defaultOgImage,
    ogType = "website",
    author,
    publishedTime,
    modifiedTime,
    tags = [],
    noindex = false,
  } = options;

  const url = `${SEO_CONFIG.baseUrl}${pathname}`;
  const fullTitle = `${pageTitle} | ${APP_NAME}`;

  // Ensure ogImage is an absolute URL
  const absoluteOgImage = ogImage.startsWith("http")
    ? ogImage
    : `${SEO_CONFIG.baseUrl}${ogImage}`;

  return {
    title: fullTitle,
    description: pageDescription,
    keywords: [...SEO_CONFIG.keywords, ...tags],
    authors: [{ name: author || SEO_CONFIG.author }],
    creator: SEO_CONFIG.author,
    publisher: APP_NAME,
    robots: noindex ? "noindex, nofollow" : "index, follow",
    canonical: url,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      type: ogType,
      images: [
        {
          url: absoluteOgImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
          type: "image/png",
        },
      ],
      siteName: APP_NAME,
      locale: SEO_CONFIG.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [absoluteOgImage],
      creator: SEO_CONFIG.twitterHandle,
    },
    ...(publishedTime && { article: { publishedTime } }),
    ...(modifiedTime && { article: { modifiedTime } }),
    ...(tags.length > 0 && { article: { tags } }),
  };
}

/**
 * Generate article-specific metadata
 * Perfect for social media sharing with image, title, description
 */
export function generateArticleMetadata(
  title: string,
  description: string,
  options: {
    pathname: string;
    author: string;
    publishedTime: string;
    modifiedTime?: string;
    image?: string;
    tags?: string[];
  },
) {
  return generateMetadata(title, description, {
    ...options,
    ogType: "article",
    ogImage: options.image,
  });
}

/**
 * Generate profile-specific metadata
 */
export function generateProfileMetadata(
  username: string,
  bio: string,
  options: {
    pathname: string;
    image?: string;
  },
) {
  return generateMetadata(`${username}'s Profile`, bio, {
    ...options,
    ogType: "profile",
  });
}

/**
 * Metadata for specific pages
 */
export const PAGE_METADATA = {
  home: {
    title: "Welcome to DevPostS Pro",
    description: `Share your independent thoughts on ${BRAND_NAME}. A distraction-free platform for writers and creators.`,
  },
  about: {
    title: "About DevPostS Pro",
    description:
      "Learn about our mission to empower independent thinkers and creators with a clean, elegant blogging platform.",
  },
  posts: {
    title: "Discover Stories & Articles",
    description:
      "Explore thought-provoking articles, technical posts, and creative stories from our community of independent writers.",
  },
  contact: {
    title: "Get In Touch",
    description:
      "Have questions or feedback? We'd love to hear from you. Contact the DevPostS Pro team.",
  },
  signin: {
    title: "Sign In to Your Account",
    description:
      "Log in to your DevPostS Pro account to access your dashboard.",
    noindex: true,
  },
  signup: {
    title: "Create Your Account",
    description:
      "Join DevPostS Pro and start sharing your independent thoughts.",
    noindex: true,
  },
  profile: {
    title: "My Profile",
    description: "Manage your DevPostS Pro profile and settings.",
    noindex: true,
  },
  dashboard: {
    title: "Dashboard",
    description: "Manage your posts and track your writing statistics.",
    noindex: true,
  },
  newPost: {
    title: "Create New Post",
    description:
      "Write and publish your next great post with AI-powered assistance.",
    noindex: true,
  },
};

/**
 * Generate viewport configuration for Next.js 16+
 */
export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
  };
}
