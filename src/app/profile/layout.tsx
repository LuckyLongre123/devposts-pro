import type { Metadata, Viewport } from "next";
import { PAGE_METADATA } from "@/lib/seo-config";
import {
  generateMetadata as generateSeoMetadata,
  generateViewport,
} from "@/lib/seo-config";

export const metadata: Metadata = generateSeoMetadata(
  PAGE_METADATA.profile.title,
  PAGE_METADATA.profile.description,
  {
    pathname: "/profile",
    noindex: PAGE_METADATA.profile.noindex,
  },
);

export const viewport: Viewport = generateViewport();

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
