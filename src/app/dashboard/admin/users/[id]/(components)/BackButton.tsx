"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  href: string;
}

export default function BackButton({ href }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Back</span>
    </Link>
  );
}
