#!/usr/bin/env node
/**
 * SEO Metadata Diagnostic Tool
 * Verifies that metadata is correctly generated for pages
 *
 * Run this script after making metadata changes to verify they work correctly
 */

import http from "http";
import https from "https";

async function checkMetadata(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;

    client
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          // Extract metadata
          const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/i);
          const ogTitleMatch = data.match(
            /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i,
          );
          const ogDescMatch = data.match(
            /<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i,
          );
          const ogImageMatch = data.match(
            /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i,
          );
          const twitterCardMatch = data.match(
            /<meta\s+name=["']twitter:card["']\s+content=["']([^"']+)["']/i,
          );
          const twitterTitleMatch = data.match(
            /<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i,
          );
          const metaDescMatch = data.match(
            /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i,
          );

          resolve({
            url,
            htmlTitle: titleMatch ? titleMatch[1] : "❌ NOT FOUND",
            metaDescription: metaDescMatch ? metaDescMatch[1] : "❌ NOT FOUND",
            ogTitle: ogTitleMatch ? ogTitleMatch[1] : "❌ NOT FOUND",
            ogDescription: ogDescMatch ? ogDescMatch[1] : "❌ NOT FOUND",
            ogImage: ogImageMatch ? ogImageMatch[1] : "❌ NOT FOUND",
            twitterCard: twitterCardMatch
              ? twitterCardMatch[1]
              : "❌ NOT FOUND",
            twitterTitle: twitterTitleMatch
              ? twitterTitleMatch[1]
              : "❌ NOT FOUND",
            isAbsoluteImageUrl: ogImageMatch
              ? ogImageMatch[1].startsWith("http")
              : false,
          });
        });
      })
      .on("error", reject);
  });
}

async function runDiagnostics() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  console.log("\n🔍 SEO Metadata Diagnostic Tool\n");
  console.log(`Base URL: ${baseUrl}`);
  console.log("═".repeat(60));

  const urls = [
    `${baseUrl}/`, // Homepage
    `${baseUrl}/about`, // About page
    `${baseUrl}/posts`, // Posts list
    // Add a specific post if available
  ];

  for (const url of urls) {
    try {
      console.log(`\n📄 Testing: ${url}`);
      const metadata = await checkMetadata(url);

      console.log(`  HTML Title       : ${metadata.htmlTitle}`);
      console.log(`  Meta Description : ${metadata.metaDescription}`);
      console.log(`  OG:Title         : ${metadata.ogTitle}`);
      console.log(`  OG:Description   : ${metadata.ogDescription}`);
      console.log(`  OG:Image         : ${metadata.ogImage}`);
      console.log(
        `  Image Absolute   : ${metadata.isAbsoluteImageUrl ? "✅ YES" : "❌ RELATIVE"}`,
      );
      console.log(`  Twitter Card     : ${metadata.twitterCard}`);
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      console.log(`  Make sure the dev server is running at ${baseUrl}`);
    }
  }

  console.log("\n" + "═".repeat(60));
  console.log("\n✨ Diagnostic complete!\n");
  console.log("📌 Quick Checklist:");
  console.log('  ✓ All titles should have content (not "0" or empty)');
  console.log("  ✓ All descriptions should have content");
  console.log("  ✓ OG:Image should be an absolute URL starting with http://");
  console.log('  ✓ Twitter Card should be "summary_large_image"');
  console.log("\n📚 Next: Test with MetaTags.io:\n");
  console.log(`   1. Go to https://metatags.io/`);
  console.log(`   2. Paste your Ngrok URL: ${baseUrl}`);
  console.log(`   3. Verify metadata appears in preview\n`);
}

runDiagnostics().catch(console.error);
