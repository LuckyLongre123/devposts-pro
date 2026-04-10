import type { Metadata, Viewport } from "next";
import { PAGE_METADATA } from "@/lib/seo-config";
import {
  generateMetadata as generateSeoMetadata,
  generateViewport,
} from "@/lib/seo-config";

export const metadata: Metadata = generateSeoMetadata(
  PAGE_METADATA.signin.title,
  PAGE_METADATA.signin.description,
  {
    pathname: "/signin",
    noindex: PAGE_METADATA.signin.noindex,
  },
);

export const viewport: Viewport = generateViewport();

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
