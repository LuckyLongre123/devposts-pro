import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center bg-background px-6 text-center">
      {/* Visual Element */}
      <div className="space-y-2">
        <h1 className="text-9xl font-extrabold tracking-tighter text-foreground/10 select-none">
          404
        </h1>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Page not found
        </h2>
      </div>

      <p className="mt-4 max-w-md text-lg text-foreground/60">
        Sorry, we couldn’t find the page you’re looking for. It might have been
        moved or deleted.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/"
          className="rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background transition-all hover:opacity-90 active:scale-95"
        >
          Back to Home
        </Link>

        <Link
          href="/contact"
          className="text-sm font-semibold text-foreground hover:underline underline-offset-4"
        >
          Contact Support <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </main>
  );
}
