/**
 * Structured Data (JSON-LD) generators for DevPostS Pro
 * Improves search engine understanding of content
 */

import { SEO_CONFIG } from "./seo-config";

/**
 * Organization Schema - goes in root layout
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SEO_CONFIG.appName,
    url: SEO_CONFIG.baseUrl,
    logo: `${SEO_CONFIG.baseUrl}/logo.png`,
    description: SEO_CONFIG.description,
    sameAs: [
      // Add your social media URLs here
      // "https://twitter.com/devpostspro",
      // "https://github.com/devpostspro",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "General Support",
      url: `${SEO_CONFIG.baseUrl}/contact`,
    },
  };
}

/**
 * Website Schema - for homepage and general site structure
 */
export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SEO_CONFIG.appName,
    description: SEO_CONFIG.description,
    url: SEO_CONFIG.baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SEO_CONFIG.baseUrl}/posts?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * BlogPosting Schema - for individual blog posts
 */
export function getBlogPostingSchema(
  post: {
    id: string;
    title: string;
    body: string;
    createdAt: string;
    updatedAt: string;
    author?: {
      name: string;
      id: string;
    };
  },
  postUrl: string,
) {
  // Extract plain text summary from markdown body (first 160 chars)
  const summary = post.body.replace(/[#*`_]/g, "").substring(0, 160) + "...";

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: summary,
    body: post.body,
    url: postUrl,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author?.name || "Anonymous",
      url: post.author
        ? `${SEO_CONFIG.baseUrl}/profile/${post.author.id}`
        : undefined,
    },
    publisher: {
      "@type": "Organization",
      name: SEO_CONFIG.appName,
      url: SEO_CONFIG.baseUrl,
    },
    image: `${SEO_CONFIG.baseUrl}/og-image-default.png`,
    isPartOf: {
      "@type": "Blog",
      name: SEO_CONFIG.appName,
      url: SEO_CONFIG.baseUrl,
    },
  };
}

/**
 * Person/Profile Schema - for user profiles
 */
export function getPersonSchema(user: {
  id: string;
  name: string;
  email?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: user.name,
    url: `${SEO_CONFIG.baseUrl}/profile/${user.id}`,
    email: user.email,
  };
}

/**
 * BreadcrumbList Schema - for navigation breadcrumbs
 */
export function getBreadcrumbSchema(
  breadcrumbs: Array<{
    name: string;
    url: string;
  }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * FAQPage Schema - for FAQ content
 */
export function getFAQSchema(
  faqs: Array<{
    question: string;
    answer: string;
  }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * JSON-LD Script Component helper
 */
export function getJsonLdScript(schema: Record<string, any>) {
  return {
    __html: JSON.stringify(schema),
  };
}
