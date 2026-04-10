import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { PAGE_METADATA } from "@/lib/seo-config";
import {
  generateMetadata as generateSeoMetadata,
  generateViewport,
} from "@/lib/seo-config";

export const revalidate = 60;

export const metadata: Metadata = generateSeoMetadata(
  PAGE_METADATA.about.title,
  PAGE_METADATA.about.description,
  {
    pathname: "/about",
  },
);

export const viewport: Viewport = generateViewport();

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      {/* Header Section */}
      <header className="border-b border-foreground/5 pb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Our Mission<span className="text-blue-500">.</span>
        </h1>
        <p className="mt-6 text-xl text-foreground/60 leading-relaxed">
          At DEVNOTES.PRO, we believe that every great conversation starts with
          a single thought. We built this platform to give your ideas a place to
          live, breathe, and be shared with the world, free from the noise of
          traditional social feeds.
        </p>
      </header>

      {/* Content Sections */}
      <div className="mt-16 space-y-16 text-lg text-foreground/80 leading-relaxed">
        {/* Section 1: The Why */}
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Why DevNotes?
            </h2>
            <p className="mt-4">
              The internet is crowded. Between algorithm-driven feeds and
              endless scrolling, finding a space for genuine expression is
              harder than ever. We provide a beautiful, distraction-free
              platform focused entirely on what matters most: your writing.
              Whether it's a fleeting thought or a deeply researched article,
              this is your space to publish.
            </p>
          </div>
          <div className="rounded-2xl bg-foreground/3 p-8 border border-foreground/5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-500">
              The Vision
            </h3>
            <p className="mt-4 text-base">
              To become the ultimate home for independent thinkers and
              creators—built to amplify your voice with simplicity, speed, and
              elegance.
            </p>
          </div>
        </section>

        {/* Section 2: The Tech */}
        <section>
          <h2 className="text-2xl font-bold text-foreground">
            Built for the Future
          </h2>
          <p className="mt-4">
            A seamless writing experience requires a lightning-fast foundation.
            This platform is engineered using a modern web stack:
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            {[
              "Next.js 15",
              "Prisma ORM",
              "Zustand State",
              "Tailwind CSS",
              "TypeScript",
              "Bun Runtime",
            ].map((tech) => (
              <li
                key={tech}
                className="flex items-center gap-2 rounded-lg border border-foreground/5 bg-foreground/2 px-4 py-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                {tech}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 3: Join Us */}
        <section className="rounded-3xl bg-blue-500 p-10 text-center text-white">
          <h2 className="text-3xl font-bold italic">
            Start sharing your story today.
          </h2>
          <p className="mx-auto mt-4 max-w-lg opacity-90">
            Join a growing community of writers and thinkers who are connecting
            through ideas and shaping the conversation.
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className="inline-block rounded-full bg-white px-8 py-3 font-bold text-blue-600 transition-transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              Create Free Account
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
