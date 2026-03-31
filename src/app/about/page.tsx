import Link from "next/link";

export const revalidate = 60;
export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      {/* Header Section */}
      <header className="border-b border-foreground/5 pb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Our Mission<span className="text-blue-500">.</span>
        </h1>
        <p className="mt-6 text-xl text-foreground/60 leading-relaxed">
          At DEVNOTES.PRO, we believe that great code starts with great
          organization. We built this platform to help developers bridge the gap
          between chaotic ideas and structured documentation.
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
              The web moves fast. Between new frameworks and constant updates,
              keeping track of what you've learned is a full-time job. We
              provide a lightning-fast, markdown-first interface to store your
              snippets, project logic, and tutorials in one place.
            </p>
          </div>
          <div className="rounded-2xl bg-foreground/3 p-8 border border-foreground/5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-500">
              The Vision
            </h3>
            <p className="mt-4 text-base">
              To become the default second-brain for developers, built with
              performance and privacy as core pillars.
            </p>
          </div>
        </section>

        {/* Section 2: The Tech */}
        <section>
          <h2 className="text-2xl font-bold text-foreground">
            Built for the Future
          </h2>
          <p className="mt-4">
            We don't just build for today. This platform is an experiment in
            modern web engineering, utilizing:
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
            Start your journey today.
          </h2>
          <p className="mx-auto mt-4 max-w-lg opacity-90">
            Join thousands of developers who are organizing their workflow and
            scaling their knowledge with DevNotes Pro.
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className="inline-block rounded-full bg-white px-8 py-3 font-bold text-blue-600 transition-transform hover:scale-105 active:scale-95"
            >
              Create Free Account
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
