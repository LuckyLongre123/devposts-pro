import {
  PAGE_METADATA,
  generateMetadata as generateSeoMetadata,
} from "@/lib/seo-config";
import HomePageContent from "./HomePageContent"; // Hum client UI ko yahan move karenge
import { Metadata } from "next";

// ✅ Yeh Server side par hai, isliye Metadata kaam karega
export const metadata: Metadata = generateSeoMetadata(
  PAGE_METADATA.home.title,
  PAGE_METADATA.home.description,
  { pathname: "/" },
);

export default function Page() {
  return <HomePageContent />;
}
