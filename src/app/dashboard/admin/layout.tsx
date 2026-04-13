import type { Metadata } from "next";
import { PAGE_METADATA } from "@/lib/seo-config";
import {
  generateMetadata as generateSeoMetadata,
  generateViewport,
} from "@/lib/seo-config";
import AdminSidebar from "./(admin-components)/AdminSidebar";
import { getAuthenticatedUser } from "@/lib/auth";
import { redirect } from "next/navigation";

// Skip static prerendering for protected admin routes
// This is required because authentication check fails during build time
export const dynamic = "force-dynamic";

export const metadata: Metadata = generateSeoMetadata(
  "Admin Dashboard",
  "Manage users, posts, and messages",
  {
    pathname: "/dashboard/admin",
    noindex: true,
  },
);

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAuthenticatedUser();

  if (!user || user.role !== "admin") {
    redirect("/403");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="flex flex-col md:flex-row h-screen overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar user={user} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
