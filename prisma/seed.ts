import prisma from "./lib/prisma";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const basePostTemplates: { title: string; body: string }[] = [
  // ── React / Next.js ──────────────────────────────────────────────────────
  {
    title: "Understanding React Server Components in Next.js 14",
    body: `### React Server Components (RSC)

React Server Components represent a **paradigm shift** in how we build React applications. Unlike traditional client components, RSCs run exclusively on the server — they never ship JavaScript to the browser, never re-render on the client, and can directly access backend resources.

#### Key Benefits

| Feature | Server Component | Client Component |
|---|---|---|
| Bundle size impact | None | Adds to JS bundle |
| Backend access | Direct (DB, FS) | Via API only |
| Interactivity | None | Full |
| SEO | Great | Depends on setup |

#### Directly Accessing a Database

\`\`\`tsx
// app/users/page.tsx — no API route needed
import { db } from '@/lib/db';

export default async function UsersPage() {
  const users = await db.query('SELECT * FROM users LIMIT 20');

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
\`\`\`

In Next.js 14, RSCs are the **default** — every component is a server component unless explicitly marked with \`"use client"\`.

#### When to Use \`"use client"\`

\`\`\`tsx
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Clicked {count} times
    </button>
  );
}
\`\`\`

> **The Mental Model:** Static, data-heavy UI belongs in server components. Anything requiring \`useState\`, \`useEffect\`, event listeners, or browser APIs belongs in client components. Push the \`"use client"\` boundary as far down the tree as possible.`,
  },
  {
    title: "Next.js App Router: Layouts, Loading UI, and Error Boundaries",
    body: `The App Router introduced in Next.js 13 fundamentally changed how developers structure pages and handle navigation. It leverages React's concurrent features to enable nested layouts, granular streaming, and co-located error recovery.

### File-System Conventions

\`\`\`
app/
├── layout.tsx          ← Root layout (always rendered)
├── loading.tsx         ← Suspense fallback for this segment
├── error.tsx           ← Error boundary for this segment
├── not-found.tsx       ← Custom 404
├── page.tsx            ← Route UI ( / )
└── dashboard/
    ├── layout.tsx      ← Nested layout (wraps all /dashboard/* routes)
    ├── loading.tsx
    ├── page.tsx        ← /dashboard
    └── settings/
        └── page.tsx    ← /dashboard/settings
\`\`\`

### Persistent Nested Layouts

\`\`\`tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
\`\`\`

The sidebar persists across all \`/dashboard/*\` navigations — no remount, no layout shift.

### Automatic Suspense with \`loading.tsx\`

\`\`\`tsx
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
\`\`\`

Next.js automatically wraps the page in a \`<Suspense>\` boundary using this file as the fallback.

### Scoped Error Recovery

\`\`\`tsx
'use client';
// app/dashboard/error.tsx
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-lg border border-red-200 p-6">
      <h2 className="text-lg font-semibold text-red-700">Something went wrong</h2>
      <p className="mt-1 text-sm text-red-500">{error.message}</p>
      <button onClick={reset} className="mt-4 btn-primary">
        Try again
      </button>
    </div>
  );
}
\`\`\`

> **Note:** \`error.tsx\` must be a client component because it uses React's error boundary API, which relies on lifecycle methods unavailable in server components.`,
  },
  {
    title: "Mastering React useOptimistic for Instant UI Updates",
    body: `\`useOptimistic\` is a React 19 hook that enables **optimistic UI updates** — immediately reflecting a user's action in the UI before the server confirms the change, then reconciling or reverting once the async operation settles.

### The Problem It Solves

Without optimistic updates, a like button feels sluggish: the user clicks, waits for the network round-trip, and only then sees the UI change. With \`useOptimistic\`, the update is instant.

### API Shape

\`\`\`tsx
const [optimisticState, addOptimistic] = useOptimistic(
  serverState,
  (currentState, optimisticValue) => {
    // Return the new optimistic state
    return { ...currentState, ...optimisticValue };
  }
);
\`\`\`

### Real-World Example: Like Button

\`\`\`tsx
'use client';

import { useOptimistic, useTransition } from 'react';
import { toggleLike } from '@/app/actions';

type Props = {
  postId: string;
  initialLikes: number;
  initialLiked: boolean;
};

export function LikeButton({ postId, initialLikes, initialLiked }: Props) {
  const [isPending, startTransition] = useTransition();

  const [optimisticState, setOptimistic] = useOptimistic(
    { likes: initialLikes, liked: initialLiked },
    (state, newLiked: boolean) => ({
      likes: newLiked ? state.likes + 1 : state.likes - 1,
      liked: newLiked,
    })
  );

  function handleClick() {
    startTransition(async () => {
      setOptimistic(!optimisticState.liked);
      await toggleLike(postId); // Server Action
    });
  }

  return (
    <button onClick={handleClick} disabled={isPending}>
      {optimisticState.liked ? '❤️' : '🤍'} {optimisticState.likes}
    </button>
  );
}
\`\`\`

### How React Reconciles

1. User clicks → \`setOptimistic\` fires → UI updates **instantly**
2. \`toggleLike\` server action runs in the background
3. **Success:** React commits the real server state (usually identical to the optimistic one)
4. **Failure:** React automatically reverts to the previous state

> **Best For:** Likes, bookmarks, cart additions, checkbox toggles — any mutation where the success path is highly probable and the UX cost of a brief mismatch is low.`,
  },
  {
    title: "React Query vs SWR: Choosing the Right Data-Fetching Library",
    body: `**TanStack Query (React Query)** and **SWR** are the two dominant client-side data-fetching libraries in the React ecosystem. Both solve the same core problems: caching, background refetching, deduplication, and loading/error state management.

### Feature Comparison

| Feature | TanStack Query | SWR |
|---|---|---|
| Bundle size | ~13KB | ~4KB |
| Mutations + cache invalidation | ✅ Built-in | ⚠️ Manual |
| Dependent queries | ✅ | ✅ |
| Infinite scroll | ✅ Built-in | ✅ |
| Optimistic updates | ✅ | ✅ |
| DevTools | ✅ Excellent | ⚠️ Basic |
| Suspense support | ✅ | ✅ |

### SWR — Simple and Elegant

\`\`\`tsx
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

function UserProfile({ id }: { id: string }) {
  const { data, error, isLoading } = useSWR(\`/api/users/\${id}\`, fetcher);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage />;
  return <div>{data.name}</div>;
}
\`\`\`

### TanStack Query — Powerful Mutations

\`\`\`tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function DeletePostButton({ postId }: { postId: string }) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) =>
      fetch(\`/api/posts/\${id}\`, { method: 'DELETE' }).then(r => r.json()),
    onSuccess: () => {
      // Automatically invalidate and refetch the posts list
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return (
    <button onClick={() => mutate(postId)} disabled={isPending}>
      {isPending ? 'Deleting…' : 'Delete'}
    </button>
  );
}
\`\`\`

### Verdict

- **SWR** — Perfect for projects with read-heavy, simple data-fetching needs. Smaller teams love the minimal API surface.
- **TanStack Query** — The clear winner for large applications with complex server state, frequent mutations, and teams that benefit from robust DevTools.`,
  },
  {
    title: "Building Accessible React Components with ARIA",
    body: `Accessibility is not an afterthought — it's a core quality attribute of production software. In the US alone, ~26% of adults have some form of disability. Building accessible components is both the right thing to do and often a legal requirement.

### The ARIA Triad

Every interactive component needs three things:
1. **Role** — What is this element? (\`role="dialog"\`, \`role="menu"\`)
2. **State** — What is its current condition? (\`aria-expanded\`, \`aria-checked\`)
3. **Properties** — Additional metadata (\`aria-label\`, \`aria-controls\`, \`aria-describedby\`)

### Accessible Modal Dialog

\`\`\`tsx
'use client';
import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      dialogRef.current?.focus();
    } else {
      triggerRef.current?.focus(); // Return focus on close
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div role="presentation" className="fixed inset-0 bg-black/50">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="mx-auto mt-20 max-w-md rounded-lg bg-white p-6"
      >
        <h2 id="modal-title" className="text-xl font-semibold">
          {title}
        </h2>
        <div>{children}</div>
        <button onClick={onClose} aria-label="Close dialog">
          ✕
        </button>
      </div>
    </div>
  );
}
\`\`\`

### Keyboard Navigation for Custom Dropdowns

\`\`\`tsx
function handleKeyDown(e: React.KeyboardEvent) {
  switch (e.key) {
    case 'ArrowDown': focusNext(); break;
    case 'ArrowUp':   focusPrev(); break;
    case 'Enter':
    case ' ':         selectCurrent(); break;
    case 'Escape':    close(); break;
    case 'Tab':       close(); break;
  }
}
\`\`\`

> **Tip:** Libraries like **Radix UI** and **Headless UI** implement these patterns correctly out of the box. Prefer them over building from scratch unless you have very specific design requirements.`,
  },

  // ── TypeScript ───────────────────────────────────────────────────────────
  {
    title: "A Practical Guide to TypeScript Generics",
    body: `TypeScript generics are one of the language's most powerful features, enabling developers to write flexible, reusable, and fully type-safe abstractions without sacrificing the benefits of the type system.

### The Core Idea

A generic is a **type placeholder** resolved at the call site. Without generics, you'd choose between losing type safety (using \`any\`) or duplicating code.

\`\`\`typescript
// ❌ Loses type safety
function first(arr: any[]): any {
  return arr[0];
}

// ✅ Generic preserves types
function first<T>(arr: T[]): T {
  return arr[0];
}

const num = first([1, 2, 3]);     // inferred as: number
const str = first(['a', 'b']);    // inferred as: string
\`\`\`

### Generic Interfaces for API Responses

\`\`\`typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

// Fully typed — no casting needed
async function fetchUser(id: string): Promise<ApiResponse<User>> {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json();
}

const { data } = await fetchUser('123');
console.log(data.email); // ✅ TypeScript knows this is a string
\`\`\`

### Generic Constraints with \`extends\`

Use \`extends\` to restrict what types a generic can accept:

\`\`\`typescript
// T must have an 'id' field — useful for data normalization
function normalizeById<T extends { id: string }>(items: T[]): Record<string, T> {
  return Object.fromEntries(items.map(item => [item.id, item]));
}

const usersById = normalizeById(users); // Record<string, User>
\`\`\`

### Generic React Hooks

\`\`\`typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setItem = (newValue: T) => {
    setValue(newValue);
    window.localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setItem] as const;
}

// Usage: fully typed
const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
\`\`\`

Mastering generics is the single biggest leap from intermediate to advanced TypeScript.`,
  },
  {
    title: "TypeScript Utility Types You Should Know",
    body: `TypeScript ships with a powerful set of built-in utility types that transform and compose existing types without manual re-declaration. Learning them keeps your codebase DRY and type-safe.

### Essential Utility Types

#### \`Partial<T>\` and \`Required<T>\`

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
}

// All fields become optional — perfect for PATCH request bodies
type UpdateUserDto = Partial<User>;

// All fields required even if originally optional
type StrictUser = Required<User>;
\`\`\`

#### \`Pick<T, K>\` and \`Omit<T, K>\`

\`\`\`typescript
// Only expose safe fields in a public API response
type PublicUser = Pick<User, 'id' | 'name'>;

// Exclude sensitive fields
type UserWithoutEmail = Omit<User, 'email'>;
\`\`\`

#### \`Record<K, T>\`

\`\`\`typescript
type Role = 'admin' | 'editor' | 'viewer';

const permissions: Record<Role, string[]> = {
  admin:  ['read', 'write', 'delete'],
  editor: ['read', 'write'],
  viewer: ['read'],
};
\`\`\`

#### \`ReturnType<T>\` and \`Parameters<T>\`

\`\`\`typescript
async function createUser(name: string, email: string) {
  return { id: crypto.randomUUID(), name, email };
}

// Infer the resolved return type without importing it explicitly
type NewUser = Awaited<ReturnType<typeof createUser>>;
// { id: string; name: string; email: string }

// Infer parameter types for wrapper functions
type CreateUserArgs = Parameters<typeof createUser>;
// [name: string, email: string]
\`\`\`

#### \`NonNullable<T>\`

\`\`\`typescript
type MaybeUser = User | null | undefined;
type DefiniteUser = NonNullable<MaybeUser>; // User
\`\`\`

### Composing Utilities

The real power comes from combining them:

\`\`\`typescript
// A safe update payload: all fields optional except 'id' which is required
type UpdatePayload = Required<Pick<User, 'id'>> & Partial<Omit<User, 'id'>>;
\`\`\``,
  },
  {
    title: "TypeScript Discriminated Unions for Robust State Modeling",
    body: `Discriminated unions are TypeScript's most powerful tool for modeling **mutually exclusive states** in a way that eliminates invalid state combinations entirely at compile time.

### The Problem with Optional Fields

\`\`\`typescript
// ❌ Allows impossible states: both data and error defined, or neither
interface RequestState {
  isLoading: boolean;
  data?: User[];
  error?: string;
}
\`\`\`

A component consuming this type must defensively check every field — and the compiler can't help catch impossible combinations.

### Discriminated Unions to the Rescue

\`\`\`typescript
// ✅ Every state is unambiguous and complete
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; error: string; retryCount: number };
\`\`\`

### Using Discriminated Unions in Components

\`\`\`tsx
function UserList({ state }: { state: RequestState }) {
  switch (state.status) {
    case 'idle':
      return <p>Start a search to see results.</p>;

    case 'loading':
      return <Skeleton count={5} />;

    case 'success':
      // ✅ TypeScript KNOWS state.data exists here
      return <ul>{state.data.map(u => <li key={u.id}>{u.name}</li>)}</ul>;

    case 'error':
      // ✅ TypeScript KNOWS state.error and state.retryCount exist here
      return (
        <ErrorBanner message={state.error} retries={state.retryCount} />
      );

    default:
      // Exhaustive check — this will be a compile error if a new state is added
      // but not handled above
      state satisfies never;
  }
}
\`\`\`

### Modelling Async Actions with Discriminated Unions

\`\`\`typescript
type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: User[] }
  | { type: 'FETCH_ERROR'; error: string };

function reducer(state: RequestState, action: Action): RequestState {
  switch (action.type) {
    case 'FETCH_START':   return { status: 'loading' };
    case 'FETCH_SUCCESS': return { status: 'success', data: action.payload };
    case 'FETCH_ERROR':   return { status: 'error', error: action.error, retryCount: 0 };
  }
}
\`\`\`

> **Rule of thumb:** Any time you find yourself writing \`isLoading: boolean; error?: string; data?: T\` — reach for a discriminated union instead.`,
  },

  // ── Docker / DevOps ──────────────────────────────────────────────────────
  {
    title: "Getting Started with Docker for Local Development",
    body: `Docker has become an indispensable tool for modern software development, eliminating the classic *"works on my machine"* problem by packaging your application and all its dependencies into a portable, reproducible container.

### Core Concepts

| Concept | What it is |
|---|---|
| **Image** | A read-only blueprint (built from a Dockerfile) |
| **Container** | A running instance of an image |
| **Volume** | Persistent storage that survives container restarts |
| **Network** | Isolated communication channel between containers |

### A Minimal Node.js Dockerfile

\`\`\`dockerfile
FROM node:20-alpine

WORKDIR /app

# Install deps first (layer cache optimization)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

EXPOSE 3000
CMD ["node", "dist/index.js"]
\`\`\`

### Full-Stack \`docker-compose.yml\`

\`\`\`yaml
version: '3.9'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: postgres://postgres:secret@db:5432/mydb
    volumes:
      - .:/app                  # Live code reloading
      - /app/node_modules       # Preserve container's node_modules
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
\`\`\`

### Useful Commands

\`\`\`bash
# Start all services (detached)
docker compose up -d

# Tail logs
docker compose logs -f app

# Run a one-off command (e.g., migrations)
docker compose exec app npx prisma migrate dev

# Tear down (keep volumes)
docker compose down

# Tear down (destroy volumes too)
docker compose down -v
\`\`\``,
  },
  {
    title: "Writing Production-Grade Dockerfiles",
    body: `A production \`Dockerfile\` differs fundamentally from a development one. It must produce a **minimal, secure, and reproducible** image that starts fast and exposes the smallest possible attack surface.

### Multi-Stage Builds

Multi-stage builds use a full image to compile/build, then copy only the output into a lean runtime image:

\`\`\`dockerfile
# ─── Stage 1: Build ───────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

COPY . .
RUN npm run build        # outputs to /app/dist


# ─── Stage 2: Runtime ─────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 appuser

# Copy only what's needed to run
COPY --from=builder /app/dist      ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER appuser

EXPOSE 3000
CMD ["node", "dist/index.js"]
\`\`\`

**Result:** Image shrinks from ~1.2GB → ~120MB. No build tools, no source code, no dev dependencies in production.

### Layer Caching Strategy

\`\`\`dockerfile
# ✅ Dependencies cached unless package.json changes
COPY package.json package-lock.json ./
RUN npm ci

# Source code changes bust only this layer
COPY . .
RUN npm run build
\`\`\`

### \`.dockerignore\`

Always create a \`.dockerignore\` to prevent unnecessary files from bloating the build context:

\`\`\`
node_modules
.git
.env*
dist
*.log
coverage
.next
README.md
\`\`\`

### Security Checklist

- ✅ Run as non-root user (\`USER appuser\`)
- ✅ Pin base image versions (\`node:20.12-alpine3.19\`)
- ✅ Use \`npm ci\` not \`npm install\` for deterministic installs
- ✅ Scan images with \`docker scout cves <image>\` before deploying
- ✅ Never embed secrets — use environment variables or secret managers`,
  },

  // ── Databases ────────────────────────────────────────────────────────────
  {
    title: "Mastering PostgreSQL Indexing for High-Performance Queries",
    body: `Poor indexing is one of the most common causes of slow queries in production PostgreSQL. Understanding when and how to index is an essential skill for any backend developer.

### How Indexes Work

An index is a separate data structure (typically a B-tree) that PostgreSQL maintains alongside your table. It trades slightly slower writes for dramatically faster reads on indexed columns.

### Index Types

| Type | Best For |
|---|---|
| **B-tree** (default) | Equality (\`=\`), range (\`>\`, \`<\`), \`ORDER BY\`, \`LIKE 'foo%'\` |
| **GIN** | Full-text search, \`JSONB\` containment, arrays |
| **GiST** | Geometric data, PostGIS, range types |
| **Partial** | Subset of rows (e.g., only active records) |
| **Composite** | Multiple columns queried together |

### Creating Indexes

\`\`\`sql
-- Basic index on a foreign key (always index FKs!)
CREATE INDEX idx_posts_user_id ON posts(user_id);

-- Composite index: column order matters — matches (status), (status, created_at)
CREATE INDEX idx_posts_status_created ON posts(status, created_at DESC);

-- Partial index: only indexes published posts
CREATE INDEX idx_posts_published ON posts(created_at)
WHERE status = 'published';

-- GIN index for full-text search
ALTER TABLE posts ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || body)) STORED;

CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);
\`\`\`

### Reading Query Plans

\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM posts
WHERE user_id = 42 AND status = 'published'
ORDER BY created_at DESC
LIMIT 10;
\`\`\`

Look for:
- **Seq Scan** → No index used, potentially slow on large tables
- **Index Scan** → Good — using a B-tree index
- **Bitmap Heap Scan** → Efficient for moderate result sets
- **Index Only Scan** → Best — all data served from the index

> **Remember:** Indexes speed up reads but add overhead to \`INSERT\`, \`UPDATE\`, and \`DELETE\`. Always measure with realistic data volumes before and after.`,
  },
  {
    title: "Database Migrations with Prisma: A Production Checklist",
    body: `Running database migrations in production is one of the most risk-prone operations in backend engineering. Prisma's migration system generates SQL files you can review and version-control — but discipline is still required.

### The Golden Rule: Backwards Compatibility

Deployments are not instantaneous. During a rolling deploy, old and new code runs simultaneously. Your migration **must be safe for both versions**.

### Safe Migration Patterns

#### ✅ Adding a New Nullable Column

\`\`\`sql
-- Safe: old code ignores the new column
ALTER TABLE "User" ADD COLUMN "displayName" TEXT;
\`\`\`

#### ✅ Renaming a Column (Multi-Step Process)

Never rename directly in one migration:

\`\`\`sql
-- Step 1: Add new column and copy data
ALTER TABLE "User" ADD COLUMN "displayName" TEXT;
UPDATE "User" SET "displayName" = "username";

-- Step 2: (After code is deployed and stable) Drop old column
ALTER TABLE "User" DROP COLUMN "username";
\`\`\`

#### ❌ Dangerous: Adding NOT NULL Without a Default

\`\`\`sql
-- This locks the table on large datasets!
ALTER TABLE "Post" ADD COLUMN "slug" TEXT NOT NULL;
\`\`\`

#### ✅ Safe Version

\`\`\`sql
-- Step 1: Add as nullable
ALTER TABLE "Post" ADD COLUMN "slug" TEXT;

-- Step 2: Backfill in batches
UPDATE "Post" SET "slug" = LOWER(REPLACE("title", ' ', '-'))
WHERE "slug" IS NULL;

-- Step 3: Add NOT NULL constraint (after backfill)
ALTER TABLE "Post" ALTER COLUMN "slug" SET NOT NULL;
\`\`\`

### Prisma-Specific Tips

\`\`\`bash
# Generate migration SQL without applying (review first!)
npx prisma migrate dev --create-only

# Apply in production (non-interactive, CI/CD safe)
npx prisma migrate deploy

# Check migration status
npx prisma migrate status
\`\`\`

### Production Checklist

- [ ] Test migration on a production-sized dataset snapshot
- [ ] Ensure migration runs in under 1 second for tables > 1M rows (or use concurrent index builds)
- [ ] Migration is backwards compatible with currently deployed code
- [ ] Rollback plan documented
- [ ] Tested \`migrate deploy\` in staging with the same Prisma version as production`,
  },

  // ── APIs / Backend ───────────────────────────────────────────────────────
  {
    title: "Designing RESTful APIs That Developers Will Love",
    body: `A well-designed REST API dramatically reduces integration friction and becomes a product in itself. A poorly designed one generates endless support tickets. Here's how to get it right.

### URL Design

\`\`\`
# ✅ Resource-oriented nouns, hierarchical relationships
GET    /v1/users                    → List users
POST   /v1/users                    → Create user
GET    /v1/users/:id                → Get user
PATCH  /v1/users/:id                → Partial update
DELETE /v1/users/:id                → Delete user
GET    /v1/users/:id/posts          → User's posts

# ❌ Verb-based, RPC-style — avoid this
POST   /getUser
POST   /createNewUser
GET    /deleteUser?id=1
\`\`\`

### HTTP Status Codes

| Scenario | Code |
|---|---|
| Successful read/update | 200 OK |
| Resource created | 201 Created |
| No content (e.g., delete) | 204 No Content |
| Validation failed | 400 Bad Request |
| Not authenticated | 401 Unauthorized |
| Authenticated but no permission | 403 Forbidden |
| Resource not found | 404 Not Found |
| Conflict (e.g., duplicate email) | 409 Conflict |
| Server error | 500 Internal Server Error |

### Consistent Error Response Shape

\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request body is invalid.",
    "details": [
      { "field": "email", "message": "Must be a valid email address." },
      { "field": "password", "message": "Must be at least 8 characters." }
    ],
    "requestId": "req_01j3k8..."
  }
}
\`\`\`

### Pagination

\`\`\`
# Cursor-based (preferred for large/real-time datasets)
GET /v1/posts?cursor=post_abc123&limit=20

# Offset-based (simple, but drifts on insertions)
GET /v1/posts?page=3&limit=20
\`\`\`

Always include pagination metadata in the response:

\`\`\`json
{
  "data": [...],
  "pagination": {
    "nextCursor": "post_xyz789",
    "hasMore": true,
    "total": 1482
  }
}
\`\`\`

> **Version from Day One:** Add \`/v1/\` to all routes immediately. Changing this later is far more painful than the initial overhead.`,
  },
  {
    title: "GraphQL vs REST: Choosing the Right API Architecture",
    body: `The debate between GraphQL and REST isn't about which is "better" — it's about which fits your specific use case. Both are production-proven. Here's a no-hype comparison.

### REST: Simple, Cacheable, Ubiquitous

\`\`\`
GET /v1/posts/123
GET /v1/posts/123/comments
GET /v1/users/456
\`\`\`

**Strengths:** HTTP caching out of the box, tooling everywhere, simple mental model, easy to secure with path-based authorization.

**Weaknesses:** Overfetching (getting fields you don't need), underfetching (N+1 requests for related data), versioning pain.

### GraphQL: Flexible, Client-Driven

\`\`\`graphql
query GetPostWithAuthor($id: ID!) {
  post(id: $id) {
    title
    body
    publishedAt
    author {
      name
      avatarUrl
    }
    comments(first: 5) {
      text
      createdAt
    }
  }
}
\`\`\`

One request. Exactly the data you need. No more, no less.

**Strengths:** Eliminates over/underfetching, strongly typed schema serves as documentation, excellent for mobile clients with variable bandwidth.

**Weaknesses:** HTTP caching is non-trivial, N+1 database query problem requires DataLoader, file uploads are awkward, higher initial setup cost.

### Solving the N+1 Problem with DataLoader

\`\`\`typescript
import DataLoader from 'dataloader';

const userLoader = new DataLoader<string, User>(async (ids) => {
  const users = await db.user.findMany({ where: { id: { in: [...ids] } } });
  // Return users in the same order as ids
  return ids.map(id => users.find(u => u.id === id) ?? null);
});

// In a resolver — batches automatically
const author = await userLoader.load(post.authorId);
\`\`\`

### Decision Matrix

| Use Case | Recommendation |
|---|---|
| Public API for third parties | REST |
| Simple CRUD microservice | REST |
| Mobile app with varied screens | GraphQL |
| Complex product with many entity relationships | GraphQL |
| Real-time subscriptions | GraphQL (or WebSockets over REST) |`,
  },
  {
    title: "Understanding JWT Authentication and Its Security Tradeoffs",
    body: `JSON Web Tokens (JWT) are a popular mechanism for stateless authentication. Understanding their tradeoffs — not just their implementation — is what separates secure systems from vulnerable ones.

### Anatomy of a JWT

\`\`\`
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9   ← Header (Base64)
.eyJzdWIiOiJ1c2VyXzEyMyIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTcxMDAwMDAwMH0  ← Payload
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ← Signature
\`\`\`

The payload is **not encrypted** — only signed. Anyone can decode and read the claims. Never put sensitive data (passwords, PII) in a JWT payload.

### Secure Storage

\`\`\`typescript
// ❌ Vulnerable to XSS — any injected script can steal the token
localStorage.setItem('token', jwt);

// ✅ Inaccessible to JavaScript — protected from XSS
// Set on the server:
res.cookie('auth_token', jwt, {
  httpOnly: true,    // No JS access
  secure: true,      // HTTPS only
  sameSite: 'lax',   // CSRF mitigation
  maxAge: 60 * 15,   // 15 minutes
});
\`\`\`

### Access Token + Refresh Token Pattern

\`\`\`
┌─────────┐      POST /auth/login          ┌─────────────┐
│ Client  │ ──────────────────────────────► │   Server    │
│         │ ◄────────────────────────────── │             │
│         │  access_token (15min, httpOnly) │             │
│         │  refresh_token (7d, httpOnly)   │             │
│         │                                 │             │
│         │  GET /api/data                  │             │
│         │  Cookie: access_token=...       │             │
│         │ ──────────────────────────────► │             │
│         │ ◄── 200 OK with data ────────── │             │
│         │                                 │             │
│         │  POST /auth/refresh             │             │
│         │  Cookie: refresh_token=...      │             │
│         │ ──────────────────────────────► │             │
│         │ ◄── New access_token ────────── │             │
└─────────┘                                 └─────────────┘
\`\`\`

### Algorithm Choice

\`\`\`typescript
import jwt from 'jsonwebtoken';

// ❌ HS256: Symmetric. Any service that verifies can also forge tokens.
const token = jwt.sign(payload, process.env.JWT_SECRET!, { algorithm: 'HS256' });

// ✅ RS256: Asymmetric. Services verify with the public key; only auth service holds the private key.
const token = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '15m' });
const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
\`\`\`

### Token Revocation

JWTs are stateless — there's no built-in revocation. Solutions:

1. **Short TTL** (15 min access tokens) — Limits the damage window
2. **Blocklist** — Store revoked \`jti\` (JWT ID) claims in Redis with TTL matching the token's expiry
3. **Token rotation** — Invalidate refresh tokens on use (detect reuse = potential theft)`,
  },
];

// ─── Template Expander (Ensures 390+ unique posts) ──────────────────────────
function generateUniqueTemplates(
  base: typeof basePostTemplates,
  targetCount: number,
) {
  const templates = [...base];
  let iteration = 1;

  while (templates.length < targetCount) {
    for (const t of base) {
      if (templates.length >= targetCount) break;
      templates.push({
        title: `${t.title} - Part ${iteration + 1}`,
        body: `${t.body}\n\n*Update: These concepts have been expanded upon in our Vol ${iteration + 1} deep dive.*`,
      });
    }
    iteration++;
  }
  return templates;
}

// ─── Secondary Users ───────────────────────────────────────────────────────────
const secondaryUsersData = [
  { email: "alex.morgan@devmail.io", name: "Alex Morgan" },
  { email: "priya.sharma@techcorp.dev", name: "Priya Sharma" },
  { email: "james.whitfield@cloudbuilder.io", name: "James Whitfield" },
  { email: "sofia.reyes@opensourcehub.dev", name: "Sofia Reyes" },
  { email: "ethan.park@stacklabs.io", name: "Ethan Park" },
  { email: "nina.volkov@bytecraft.dev", name: "Nina Volkov" },
  { email: "david.okonkwo@apiforge.io", name: "David Okonkwo" },
  { email: "laura.chen@devecosystem.dev", name: "Laura Chen" },
  { email: "marcus.hill@cloudnative.io", name: "Marcus Hill" },
  { email: "aisha.patel@mlops.dev", name: "Aisha Patel" },
  { email: "tom.erikson@opensource.dev", name: "Tom Erikson" },
  { email: "yuki.tanaka@infrasync.io", name: "Yuki Tanaka" },
];

// ─── Sample Messages (Guest + Registered Users) ────────────────────────────────
const guestMessagesData = [
  {
    name: "John Developer",
    email: "john.dev@external.com",
    message:
      "Great blog posts! The React Server Components guide was really helpful.",
  },
  {
    name: "Sarah Tech",
    email: "sarah.tech@startup.dev",
    message:
      "Please write more articles about performance optimization in Next.js",
  },
  {
    name: "Mike Code",
    email: "mike.code@freelance.io",
    message:
      "I implemented the accessibility tips from your ARIA guide. Thanks!",
  },
  {
    name: "Emma Stack",
    email: "emma.stack@agency.co",
    message:
      "Could you elaborate on Docker best practices for production deployments?",
  },
  {
    name: "Alex Build",
    email: "alex.build@company.net",
    message: "Love the TypeScript generics tutorial. Very comprehensive!",
  },
  {
    name: "Lisa Dev",
    email: "lisa.dev@startup.com",
    message:
      "The PostgreSQL indexing guide helped optimize our slow queries significantly.",
  },
];

// ─── Fisher-Yates Shuffle ─────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function main() {
  console.log("🌱 Seeding started...\n");

  const hashedPassword =
    "$2b$10$F9QAfgM/Abshr5BxPTfEw.MQEmqIGSGYVl45rpSkRyUfDs3pXefKW";

  // ─── Clean up existing data ────────────────────────────────────────────────
  console.log("🗑️  Cleaning up existing data...\n");

  // Delete in correct order (respecting foreign key constraints)
  await prisma.like.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("✅ Database cleaned.\n");

  // ─── Main / Special User ──────────────────────────────────────────────────
  const targetUser = await prisma.user.create({
    data: {
      id: "cmnijrif000003ov7vjrcc8s7",
      email: "officialluckylongre@gmail.com",
      password: hashedPassword,
      name: "Lucky Longre",
    },
  });
  console.log("🎯 Main user ready:", targetUser.email);

  // ─── Secondary Users ──────────────────────────────────────────────────────
  const secondaryUsers = [];
  for (const u of secondaryUsersData) {
    const created = await prisma.user.create({
      data: { email: u.email, name: u.name, password: hashedPassword },
    });
    secondaryUsers.push(created);
  }

  const allUsers = [targetUser, ...secondaryUsers];
  console.log("\n✅ All users ready:");
  allUsers.forEach((u) => console.log(`   📧 ${u.email}  |  👤 ${u.name}`));

  // ─── Generate 390 Unique Posts & Shuffle ──────────────────────────────────
  console.log("📝 Generating posts...\n");
  const TOTAL_POSTS_NEEDED = 390;
  const fullPostPool = generateUniqueTemplates(
    basePostTemplates,
    TOTAL_POSTS_NEEDED,
  );
  const shuffledPool = shuffle(fullPostPool);

  let poolIndex = 0;
  let totalPosts = 0;

  for (const user of allUsers) {
    const count = getRandomInt(20, 30);

    // Make sure we don't exceed the available templates
    const available = shuffledPool.length - poolIndex;
    const actualCount = Math.min(count, available);

    if (actualCount <= 0) break;

    const slice = shuffledPool.slice(poolIndex, poolIndex + actualCount);
    poolIndex += actualCount;

    const postsData = slice.map((template) => ({
      title: template.title.slice(0, 100),
      body: template.body, // No slicing to 1000 here to preserve the Markdown structure
      published: Math.random() > 0.3, // ~70% published
      authorId: user.id,
    }));

    await prisma.post.createMany({ data: postsData });
    totalPosts += actualCount;

    console.log(
      `   📝 ${actualCount} unique posts  →  ${user.name} (${user.email})`,
    );
  }

  // ─── Create Messages (Guest + From Registered Users) ──────────────────────────
  console.log("\n📬 Creating messages...");

  const messagesData = [];

  // 1. Guest messages
  for (const msg of guestMessagesData) {
    messagesData.push({
      name: msg.name,
      email: msg.email,
      message: msg.message,
      userId: null, // Guest user - no link to registered user
      isRead: Math.random() > 0.5, // Random read status
    });
  }

  // 2. Messages from registered users
  for (let i = 0; i < 8; i++) {
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
    const feedbackMessages = [
      "This is a great learning resource. Thanks for sharing!",
      "I found this very helpful for my project.",
      "Could you write more about this topic?",
      "Excellent explanation! Keep up the good work.",
      "I implemented this in my application with great results.",
      "Very detailed and well-structured content.",
      "This helped me solve a critical performance issue.",
      "Amazing technical insights. Thank you!",
    ];
    const randomMessage =
      feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];

    messagesData.push({
      name: randomUser.name || "Unknown",
      email: randomUser.email,
      message: randomMessage,
      userId: randomUser.id, // Link to registered user
      isRead: Math.random() > 0.6, // ~40% unread messages
    });
  }

  // Create new messages
  await prisma.message.createMany({ data: messagesData });

  console.log(`   💬 ${guestMessagesData.length} guest messages created`);
  console.log(`   💬 8 messages from registered users created`);
  console.log(`   ✉️  Total messages: ${messagesData.length}`);

  console.log(`\n🎉 Seeding complete!`);
  console.log(`   👥 Users    : ${allUsers.length}`);
  console.log(`   📄 Posts    : ${totalPosts}  (all unique, zero duplicates)`);
  console.log(`   💬 Messages : ${messagesData.length}`);
  console.log(`   🔑 Password : Lucky@123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
