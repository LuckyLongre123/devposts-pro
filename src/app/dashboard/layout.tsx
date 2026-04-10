import type { Metadata, Viewport } from "next";
import { PAGE_METADATA } from "@/lib/seo-config";
import {
  generateMetadata as generateSeoMetadata,
  generateViewport,
} from "@/lib/seo-config";

export const metadata: Metadata = generateSeoMetadata(
  PAGE_METADATA.dashboard.title,
  PAGE_METADATA.dashboard.description,
  {
    pathname: "/dashboard",
    noindex: PAGE_METADATA.dashboard.noindex,
  },
);

export const viewport: Viewport = generateViewport();

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
