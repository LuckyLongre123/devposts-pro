/**
 * Open Graph Image Generator
 * Simple SVG-based fallback for social media sharing
 *
 * Note: For production, consider upgrading to:
 * - Vercel OG Image Generation
 * - Cloudinary Dynamic Rendering
 * - Custom image generation service
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = decodeURIComponent(searchParams.get("title") || "DevPostS Pro");

  try {
    // Create a simple SVG-based image
    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#grad)"/>
        <text x="600" y="300" font-size="60" font-weight="bold" fill="white" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" word-spacing="0" letter-spacing="0" dominant-baseline="middle">
          ${title.substring(0, 50)}${title.length > 50 ? "..." : ""}
        </text>
        <text x="600" y="400" font-size="32" fill="white" opacity="0.8" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">
          DevPostS Pro
        </text>
      </svg>
    `;

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("OG Image Generation Error:", error);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
