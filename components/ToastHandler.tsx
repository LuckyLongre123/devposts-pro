"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");
  const created = searchParams.get("created");

  useEffect(() => {
    if (error === "fetch_failed") {
      toast.error("Could not load that post. Returning to list.");

      // Clean the URL so the toast doesn't show again if they refresh
      const params = new URLSearchParams(searchParams.toString());
      params.delete("error");
      router.replace(`/posts?${params.toString()}`, { scroll: false });
    }
    if (created === "true") {
      toast.success("Post created successfully.");

      // Clean the URL so the toast doesn't show again if they refresh
      const params = new URLSearchParams(searchParams.toString());
      params.delete("created");
      router.replace(`/posts?${params.toString()}`, { scroll: false });
    }
  }, [created, error, searchParams, router]);

  return null; // This component doesn't render anything UI-wise
}
