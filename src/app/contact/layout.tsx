import type { Metadata, Viewport } from "next";
import { PAGE_METADATA } from "@/lib/seo-config";
import {
  generateMetadata as generateSeoMetadata,
  generateViewport,
} from "@/lib/seo-config";

export const metadata: Metadata = generateSeoMetadata(
  PAGE_METADATA.contact.title,
  PAGE_METADATA.contact.description,
  {
    pathname: "/contact",
  },
);

export const viewport: Viewport = generateViewport();

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
