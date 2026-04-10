/**
 * SEO Monitoring & Analytics Utilities
 * Helpers for tracking and monitoring SEO performance
 */

/**
 * Generate Google Search Console verification code
 */
export function getGoogleSearchConsoleCode(): string {
  return `
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" />
  `.trim();
}

/**
 * Schema.org Testing URL generator
 */
export function getSchemaOrgTestUrl(url: string): string {
  return `https://schema.org/validator?url=${encodeURIComponent(url)}`;
}

/**
 * Open Graph validator URLs
 */
export const SEO_VALIDATORS = {
  openGraph: (url: string) =>
    `https://developers.facebook.com/tools/debug/og/object?q=${encodeURIComponent(url)}`,
  twitterCard: (url: string) =>
    `https://cards-dev.twitter.com/validator?url=${encodeURIComponent(url)}`,
  linkedData: (url: string) =>
    `https://search.google.com/test/rich-results?url=${encodeURIComponent(url)}`,
  mobileFriendly: (url: string) =>
    `https://search.google.com/test/mobile-friendly?url=${encodeURIComponent(url)}`,
  pageSpeed: (url: string) =>
    `https://pagespeed.web.dev/?url=${encodeURIComponent(url)}`,
  lighthouse: (url: string) =>
    `https://pagespeed.web.dev/?url=${encodeURIComponent(url)}`,
};

/**
 * SEO Checklist for new posts
 */
export const POST_SEO_CHECKLIST = {
  title: {
    guideline: "Keep title between 50-60 characters",
    minLength: 30,
    maxLength: 60,
  },
  description: {
    guideline: "Keep description between 150-160 characters",
    minLength: 120,
    maxLength: 160,
  },
  keywords: {
    guideline: "Use 3-5 relevant keywords",
    min: 3,
    max: 5,
  },
  content: {
    guideline: "Use headers (h2, h3) for structure",
    minWords: 300,
    recommend: 1500,
  },
  images: {
    guideline: "Add relevant images with descriptive alt text",
    recommend: "At least 1-2 images",
  },
  links: {
    guideline: "Add internal and external links naturally",
    internal: "Link to 2-3 related posts",
    external: "Link to 1-2 authoritative sources",
  },
};

/**
 * Core Web Vitals thresholds
 */
export const CORE_WEB_VITALS = {
  LCP: {
    // Largest Contentful Paint
    good: 2500, // ms
    needsImprovement: 4000, // ms
  },
  FID: {
    // First Input Delay
    good: 100, // ms
    needsImprovement: 300, // ms
  },
  CLS: {
    // Cumulative Layout Shift
    good: 0.1,
    needsImprovement: 0.25,
  },
};

/**
 * SEO status checker
 */
export function checkSeoStatus(post: {
  title: string;
  body: string;
  author?: { name: string };
}): {
  issues: string[];
  warnings: string[];
  score: number;
} {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // Title checks
  if (post.title.length < 30) {
    issues.push("Title too short (< 30 chars)");
    score -= 15;
  } else if (post.title.length > 60) {
    warnings.push(
      "Title too long (> 60 chars) - may be truncated in search results",
    );
    score -= 5;
  }

  // Content length
  const wordCount = post.body.split(/\s+/).length;
  if (wordCount < 300) {
    issues.push("Content too short (< 300 words)");
    score -= 20;
  }

  // Check for headings
  const headingCount = (post.body.match(/^#+\s/gm) || []).length;
  if (headingCount === 0) {
    warnings.push("No headers found - add H2/H3 for structure");
    score -= 10;
  }

  // Check for links
  const linkCount = (post.body.match(/\[.*?\]\(.*?\)/g) || []).length;
  if (linkCount === 0) {
    warnings.push("No links found - consider adding internal/external links");
    score -= 5;
  }

  return {
    issues,
    warnings,
    score: Math.max(0, score),
  };
}

/**
 * Generate SEO report HTML
 */
export function generateSeoReport(
  url: string,
  metadata: Record<string, any>,
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEO Report - ${metadata.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 20px; color: #333; }
        h1 { color: #2c3e50; }
        .alert { padding: 15px; margin: 10px 0; border-radius: 4px; }
        .alert-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .alert-warning { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
        .alert-danger { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f8f9fa; font-weight: 600; }
    </style>
</head>
<body>
    <h1>SEO Report</h1>
    <p><strong>URL:</strong> ${url}</p>
    <h2>Metadata</h2>
    <table>
        <tr><th>Property</th><th>Value</th></tr>
        <tr><td>Title</td><td>${metadata.title}</td></tr>
        <tr><td>Description</td><td>${metadata.description}</td></tr>
        <tr><td>Canonical</td><td>${metadata.canonical || url}</td></tr>
    </table>
</body>
</html>
  `.trim();
}
