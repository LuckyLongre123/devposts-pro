import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import Navbar from "../../components/Navbar";
import { Toaster } from "react-hot-toast";
import AuthInitializer from "../../components/auth/AuthInitializer";
import { getAuthenticatedUser } from "@/lib/auth";
import {
  SEO_CONFIG,
  generateMetadata,
  generateViewport,
} from "@/lib/seo-config";
import {
  getOrganizationSchema,
  getWebsiteSchema,
  getJsonLdScript,
} from "@/lib/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = generateMetadata(
  SEO_CONFIG.appName,
  SEO_CONFIG.description,
  {
    pathname: "/",
  },
);

export const viewport: Viewport = generateViewport();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAuthenticatedUser();
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={getJsonLdScript(organizationSchema)}
          suppressHydrationWarning
        />
        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={getJsonLdScript(websiteSchema)}
          suppressHydrationWarning
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthInitializer user={user} />
        <NextTopLoader
          color="#3b82f6" // Brand Blue-500
          initialPosition={0.08}
          crawlSpeed={200}
          height={3} // Slim, professional line
          crawl={true}
          showSpinner={true} // Enabled by default, filtered via CSS below
          easing="ease"
          speed={200}
          shadow="0 0 10px #3b82f6,0 0 5px #3b82f6"
          template='<div class="bar" role="bar"><div class="peg"></div></div> 
                  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
        />

        <Navbar />
        {children}
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerStyle={{
            top: 40,
          }}
          toastOptions={{
            duration: 4000,
            // Default Style (Neutral/Minimalist)
            style: {
              background: "var(--background)",
              color: "var(--foreground)",
              border: "1px solid rgba(var(--foreground-rgb), 0.1)", // Subtle border
              backdropFilter: "blur(8px)", // Matches your navbar
              borderRadius: "12px",
              padding: "12px 20px",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            },

            // ✅ Success: Uses your brand Blue instead of generic Green
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#3b82f6", // blue-500
                secondary: "#fff",
              },
              style: {
                border: "1px solid rgba(59, 130, 246, 0.2)",
              },
            },

            // ❌ Error: Subtle Red accent
            error: {
              duration: 5000,
              iconTheme: {
                primary: "#ef4444", // red-500
                secondary: "#fff",
              },
              style: {
                border: "1px solid rgba(239, 68, 68, 0.2)",
              },
            },

            // ⏳ Loading: Minimalist Blue
            loading: {
              style: {
                border: "1px solid rgba(59, 130, 246, 0.1)",
              },
              iconTheme: {
                primary: "#3b82f6",
                secondary: "rgba(59, 130, 246, 0.2)",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
