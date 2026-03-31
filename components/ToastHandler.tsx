"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error === "fetch_failed") {
      toast.error("Could not load that post. Returning to list.");

      // Clean the URL so the toast doesn't show again if they refresh
      const params = new URLSearchParams(searchParams.toString());
      params.delete("error");
      router.replace(`/posts?${params.toString()}`, { scroll: false });
    }
  }, [error, searchParams, router]);

  return null; // This component doesn't render anything UI-wise
}
