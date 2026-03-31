"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground antialiased font-sans">
        <div className="text-center space-y-6 px-4">
          <h1 className="text-6xl font-bold tracking-tighter text-blue-500">
            500
          </h1>
          <h2 className="text-2xl font-semibold">
            Something went critically wrong!
          </h2>
          <p className="text-foreground/60 max-w-md mx-auto">
            A global application error occurred. We've been notified and are
            working to fix it.
          </p>
          <button
            onClick={() => reset()}
            className="rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 cursor-pointer"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
