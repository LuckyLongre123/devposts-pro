import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better error detection
  reactStrictMode: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Agar Cloudinary use kar rahe hain
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Agar Unsplash use kar rahe hain
        pathname: "/**",
      },
    ],
    // Cache images for SEO
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  // Headers for SEO and Security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
      // Cache static assets
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Redirects for SEO - handle old URLs if you migrate or rebrand
  async redirects() {
    return [
      // Example: if you ever change the posts URL structure
      // {
      //   source: '/blog/:id',
      //   destination: '/posts/:id',
      //   permanent: true, // Important: 301 redirect for SEO
      // },
    ];
  },

  // Rewrites for better URL structure
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },

  // Generate ETags for better caching
  generateEtags: true,

  // Enable compression
  compress: true,

  // Production source maps for monitoring (optional)
  productionBrowserSourceMaps: false,

  allowedDevOrigins: ["baggage-plank-litter.ngrok-free.dev"],
};

export default nextConfig;
