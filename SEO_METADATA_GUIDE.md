# SEO Metadata Setup & Verification Guide

## Overview

Your Next.js application is now properly configured to serve SEO metadata correctly. This guide explains the setup and how to test it.

## What Was Fixed

### 1. **Page.tsx Refactoring** ✅

- `src/app/page.tsx` is now a **server component** (no "use client" directive)
- Exports metadata using the `generateMetadata()` function from `seo-config.ts`
- Renders `<HomePageContent />` which is a client component containing the UI

### 2. **HomePageContent Component** ✅

- Moved all client-side UI logic into `src/app/HomePageContent.tsx`
- Client component with "use client" directive
- Contains all interactive features and state management

### 3. **Metadata Generation** ✅

- `generateMetadata()` now ensures **all OG image URLs are absolute**
- Checks if image URL starts with "http", if not, prepends BASE_URL
- Prevents relative URL issues that social media crawlers can't handle

### 4. **Image Configuration** ✅

- Fixed OG image reference from missing `/logo.png` to existing `/default-thumbnail.png`
- Image is served from `/public/default-thumbnail.png`

### 5. **Layout & Route Metadata** ✅

- Root layout (`layout.tsx`) provides default metadata
- Page-level metadata (in `page.tsx`, `posts/page.tsx`, `about/page.tsx`, etc.) overrides root metadata
- No conflicts - Next.js handles precedence automatically

---

## Environment Configuration

### For Local Development

```bash
# .env.local (create this file)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### For Ngrok Testing with Social Media Crawlers

Social media crawlers (Facebook, Twitter, LinkedIn, etc.) **cannot access localhost**. Use Ngrok to expose your local server to the internet:

```bash
# Terminal 1: Start your Next.js dev server
npm run dev

# Terminal 2: Start Ngrok tunnel
ngrok http 3000 --host-header=rewrite

# Terminal 3: Copy the forwarding URL and update your .env.local
# Example: https://1234-56-789-012-34.ngrok.io
NEXT_PUBLIC_BASE_URL=https://1234-56-789-012-34.ngrok.io
```

Then update MetaTags.io with the Ngrok URL to verify crawlers can now read your metadata.

### For Production Deployment

```bash
# Vercel (automatic)
# VERCEL_URL is set automatically during build
# No action needed if using Vercel

# Self-hosted production
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

---

## How the Metadata System Works

### 1. **Base URL Selection** (in `seo-config.ts`)

```typescript
const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
```

**Priority:**

1. Vercel (production): Uses `VERCEL_URL` with https://
2. Custom: Uses `NEXT_PUBLIC_BASE_URL` if set
3. Fallback: Uses `http://localhost:3000`

### 2. **Page-Level Metadata** (example: `page.tsx`)

```typescript
import { PAGE_METADATA, generateMetadata as generateSeoMetadata } from "@/lib/seo-config";
import { Metadata } from "next";

export const metadata: Metadata = generateSeoMetadata(
  PAGE_METADATA.home.title,
  PAGE_METADATA.home.description,
  { pathname: "/" }
);

export default function Page() {
  return <HomePageContent />;  // Client component
}
```

### 3. **Image URL Absoluteness** (in `generateMetadata()`)

```typescript
// Ensures OG image is always absolute
const absoluteOgImage = ogImage.startsWith("http")
  ? ogImage
  : `${SEO_CONFIG.baseUrl}${ogImage}`;
```

---

## Testing Your Metadata

### Method 1: MetaTags.io

1. Go to https://metatags.io/
2. Enter your URL:
   - **For local testing:** Use your Ngrok URL (e.g., `https://1234-xx-xxx.ngrok.io`)
   - **For production:** Use your actual domain
3. Verify these appear:
   - ✅ Title
   - ✅ Description
   - ✅ OG Image (should show the thumbnail preview)
   - ✅ Twitter Card

### Method 2: Browser DevTools

1. Visit your page in a browser
2. Open DevTools (F12)
3. Go to **Elements/Inspector** and search for `<meta property="og:title"`
4. Verify these are present:

```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://..." />
<meta name="twitter:card" content="summary_large_image" />
```

### Method 3: Facebook Sharing Debugger

1. Go to https://developers.facebook.com/tools/debug/sharing/
2. Paste your URL
3. Verify metadata appears correctly

---

## File Structure

```
src/
├── app/
│   ├── page.tsx                    # Server component with metadata export
│   ├── HomePageContent.tsx         # Client component with UI logic
│   ├── layout.tsx                  # Root layout with default metadata
│   ├── posts/page.tsx              # Server component for /posts
│   ├── about/page.tsx              # Server component for /about
│   └── ...other routes
├── lib/
│   └── seo-config.ts               # Centralized metadata configuration
│       ├── SEO_CONFIG              # Global SEO settings
│       ├── PAGE_METADATA           # Per-page metadata
│       ├── generateMetadata()      # Main metadata generator
│       ├── generateArticleMetadata()
│       ├── generateProfileMetadata()
│       └── generateViewport()
└── ...rest of project

public/
└── default-thumbnail.png           # OG image used in metadata
```

---

## Common Issues & Fixes

### Issue: "MetaTags.io shows empty title/description for localhost"

**Cause:** Social media crawlers can't access localhost  
**Fix:** Use Ngrok tunnel and update `NEXT_PUBLIC_BASE_URL` to Ngrok URL

### Issue: "OG image not showing in social media preview"

**Cause:** Image URL is relative or file doesn't exist  
**Fix:**

- Ensure image exists in `/public/` directory
- Verify URL is absolute in metadata
- Check `default-thumbnail.png` exists

### Issue: "Metadata works locally but not in production"

**Cause:** `NEXT_PUBLIC_BASE_URL` not set or incorrect  
**Fix:**

- Vercel: Leave unset (uses VERCEL_URL automatically)
- Other hosts: Set `NEXT_PUBLIC_BASE_URL=https://yourdomain.com`

### Issue: "Page title shows 'undefined | DevPostS Pro'"

**Cause:** `PAGE_METADATA` entry missing for the route  
**Fix:** Add entry to `PAGE_METADATA` object in `seo-config.ts`

---

## Metadata for Dynamic Pages (e.g., Individual Posts)

For dynamic routes like `/posts/[id]`, you can use `generateMetadata` function:

```typescript
// src/app/posts/[id]/page.tsx
import { generateArticleMetadata } from "@/lib/seo-config";

export async function generateMetadata({ params }) {
  const post = await getPost(params.id);

  return generateArticleMetadata(
    post.title,
    post.excerpt,
    {
      pathname: `/posts/${params.id}`,
      author: post.author.name,
      publishedTime: post.createdAt,
      image: post.thumbnailUrl || undefined,
      tags: post.tags,
    }
  );
}

export default async function PostPage({ params }) {
  const post = await getPost(params.id);
  return <PostDisplay post={post} />;
}
```

---

## Important Notes

1. **"use client" in page.tsx breaks metadata** - Keep page.tsx as a server component, move all client logic to separate component files

2. **Image URLs must be absolute** - Relative URLs like `/logo.png` can cause crawler issues when accessed through tunnels or different domains

3. **Environment variables must be set** - Social media crawlers use the real URL; they can't infer from localhost

4. **Next.js cache revalidation** - After changing metadata, you may need to:
   - Restart dev server (`npm run dev`)
   - Clear Next.js cache (`.next` folder)
   - Re-run the crawler test

---

## Next Steps

1. Create `.env.local` with your `NEXT_PUBLIC_BASE_URL`
2. Restart dev server: `npm run dev`
3. Visit MetaTags.io with your public URL (localhost or Ngrok)
4. Verify all metadata appears correctly
5. Test social media sharing on Facebook, Twitter, LinkedIn

---

## Resources

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [MetaTags.io Testing Tool](https://metatags.io/)
- [Ngrok Documentation](https://ngrok.com/docs)
