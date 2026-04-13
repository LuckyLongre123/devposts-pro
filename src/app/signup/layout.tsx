import type { Metadata, Viewport } from "next";
import { PAGE_METADATA } from "@/lib/seo-config";
import {
  generateMetadata as generateSeoMetadata,
  generateViewport,
} from "@/lib/seo-config";
import { getAuthenticatedUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = generateSeoMetadata(
  PAGE_METADATA.signup.title,
  PAGE_METADATA.signup.description,
  {
    pathname: "/signup",
    noindex: PAGE_METADATA.signup.noindex,
  },
);

export const viewport: Viewport = generateViewport();

export default async function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redirect already authenticated users to profile
  const user = await getAuthenticatedUser();
  if (user) {
    redirect("/profile");
  }

  return children;
}
