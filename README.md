<p align="center">
  <img src="./src/app/android-chrome-512x512.png" width="80" alt="DevPostS Pro Logo" />
</p>

<h1 align="center">DevPostS Pro</h1>

<p align="center">
  <strong>A professional-grade blogging platform for independent thinkers and developers.</strong>
  <br />
  Write, enhance with AI, publish, and share — all from a clean, distraction-free interface.
</p>

<p align="center">
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-features">Features</a> •
  <a href="#-platform-metrics">Metrics</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-challenges-faced">Challenges</a>
</p>

---

## 📖 Overview

**DevPostS Pro** is a full-stack blogging platform built with Next.js 16 (App Router), designed as a clean, performant, and SEO-optimized space for writers and developers to share their thoughts. It features AI-powered content enhancement using Google Gemini, role-based access control, a rich Markdown editor, Cloudinary image management, and a full admin dashboard.

### The Problem

The internet is crowded with algorithm-driven feeds and noisy social platforms. Writers need a focused, professional space to publish and share their ideas without distractions.

### The Solution

DevPostS Pro provides a **distraction-free, developer-focused writing platform** with:

- ✍️ A Markdown-first editor with live preview
- 🤖 AI-powered title and content enhancement (Google Gemini)
- 🖼️ Cloudinary-backed thumbnail management
- 📊 A full admin dashboard for platform management
- 🔍 Production-grade SEO (structured data, sitemap, JSON feed, OpenGraph)
- 🌙 Elegant dark/light theme with zero-FOUC switching

---

## 🏛 System Architecture

<p align="center">
  <img src="./public/system-architecture.png" width="800" alt="DevPostS Pro System Architecture" />
</p>

### High-Level Data Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           BROWSER (CLIENT)                             │
│  React 19 · Zustand · react-hook-form · Zod · Tailwind CSS v4         │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │ REST API / SSR
                                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     NEXT.JS 16 SERVER (APP ROUTER)                     │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │ Middleware   │  │ API Routes   │  │ Server       │  │ SEO Engine  │  │
│  │ (proxy.ts)  │  │ (18 routes)  │  │ Components   │  │ (sitemap,   │  │
│  │ JWT · RBAC  │  │ CRUD · Auth  │  │ Data Fetch   │  │  OG, JSON   │  │
│  │ Guards      │  │ AI · Upload  │  │ cache()      │  │  Feed)      │  │
│  └──────┬──────┘  └──────┬───────┘  └──────┬───────┘  └─────────────┘  │
│         │                │                 │                            │
│         ▼                ▼                 ▼                            │
│  ┌─────────────────────────────────────────────────────┐               │
│  │              PRISMA ORM (PrismaPg Adapter)          │               │
│  │              Type-safe queries · Migrations          │               │
│  └──────────────────────┬──────────────────────────────┘               │
└─────────────────────────┼──────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────────────┐
          ▼               ▼                       ▼
   ┌─────────────┐ ┌─────────────┐        ┌─────────────┐
   │ PostgreSQL  │ │  Google     │        │ Cloudinary  │
   │ Database    │ │  Gemini AI  │        │ CDN         │
   │             │ │             │        │             │
   │ 4 Models    │ │ Content     │        │ Image       │
   │ Indexed     │ │ Enhancement │        │ Upload &    │
   │ Relations   │ │ Rate-limited│        │ Transform   │
   └─────────────┘ └─────────────┘        └─────────────┘
```

---

## ✨ Features

### Core Features

| Feature | Description |
|---|---|
| **Markdown Editor** | Write posts in Markdown with live preview, word count, reading time, and character tracking |
| **AI Content Enhancement** | Enhance titles and body content using Google Gemini Flash with daily token quota (5/day) |
| **Thumbnail Upload** | Drag-and-drop image upload to Cloudinary with validation (5MB, JPEG/PNG/WebP) |
| **Draft Auto-Save** | Drafts are automatically saved to localStorage with debounced saves |
| **Like System** | Toggle likes on posts with unique constraint (one like per user per post) |
| **Social Sharing** | Share posts via Twitter, Facebook, LinkedIn, WhatsApp, Telegram, Reddit, Email, or native Web Share API |
| **Global Search** | Full-text search across titles and content with sort, filter by status/date/author |
| **Pagination** | Server-side pagination with ellipsis-based page navigation |
| **Markdown Rendering** | Full GFM support with syntax highlighting (highlight.js) and HTML sanitization |

### Authentication & Security

| Feature | Description |
|---|---|
| **JWT Authentication** | Secure token-based auth with HttpOnly cookies (7-day expiry) |
| **bcrypt Hashing** | Passwords hashed with bcrypt (10 rounds) |
| **Middleware Protection** | Route-level auth guards for dashboard, profile, admin, and API routes |
| **Redirect Preservation** | Auth flows preserve the original URL for post-login redirect |
| **Zod Validation** | All inputs validated with Zod schemas (forms + API routes) |
| **Security Headers** | CSP, X-Frame-Options, X-Content-Type-Options, XSS-Protection |

### Admin Dashboard & UI/UX Features

| Feature | Description |
|---|---|
| **Platform Analytics** | Top-level overview cards tracking total users, published/draft posts, likes, and inbound messages |
| **"Super Power" Inline Edits** | Double-click to instantly edit post titles or user information, supported by `useInlineEditOptimistic` |
| **Optimistic UI Updates** | Instant UI feedback for role toggles, publishing/unpublishing, marking messages read, and edits |
| **Granular Skeleton Loaders** | Data mutations only refetch the specific modified item and show an inline skeleton loader, preventing full-page flashes |
| **Performance Optimizations** | Heavy use of debounced searches, pagination across all tables, and scoped data fetching to reduce DB load |
| **Post Moderation** | View any user's draft posts, toggle publication status, delete violating content, and view who liked any post |
| **User Management** | Search by name/email, toggle `user`/`admin` roles, and trigger cascade deletes (removes their posts/likes) |
| **Message Inbox** | Read contact form submissions, mark as read/unread with real-time UI toggles, view full details, and filter by unread status |
| **Responsive Sidebar** | Collapsible, mobile-first admin navigation sidebar |

### SEO & Performance

| Feature | Description |
|---|---|
| **Dynamic Sitemap** | Auto-generated sitemap including all published posts |
| **JSON Feed** | Standards-compliant JSON Feed (v1.1) for content syndication |
| **OpenGraph Images** | Dynamic SVG-based OG image generation |
| **Structured Data** | Organization + Website JSON-LD schemas |
| **Per-Page Metadata** | Centralized SEO config with page-specific overrides |
| **Image Optimization** | Responsive Cloudinary URLs with automatic format/quality optimization |
| **Robots.txt** | Configured for proper crawling with sitemap reference |

### User Experience

| Feature | Description |
|---|---|
| **Dark/Light Theme** | Instant theme switching with zero FOUC (localStorage + inline script) |
| **Loading Skeletons** | Contextual loading states for navigation, auth sections, and content |
| **Progress Bar** | Top-of-page progress indicator for page transitions |
| **Toast Notifications** | Themed toast system with success, error, and loading states |
| **Responsive Design** | Mobile-first design with hamburger menu and adaptive layouts |
| **Public Profiles** | View any user's public profile with their published posts |

---

## 📊 Platform Metrics

> Real numbers from the codebase — not estimates.

| Metric | Value | Details |
|---|---|---|
| **Total Lines of Code** | **15,000+** | 11,373 (src/) + 2,495 (components/) + 1,153 (prisma/) |
| **API Route Handlers** | **18** | Auth (3), Posts (6), Users (2), AI (1), Admin (3), Upload (1), OG (1), Feed (1) |
| **Application Pages** | **18** | Including dynamic routes, admin sub-pages, and error pages |
| **React Components** | **78** | 27 shared + 51 feature-specific (Server + Client) |
| **Database Models** | **4** | User, Post, Message, Like — with 6 indexes and 1 composite unique |
| **Zod Validation Schemas** | **5** | signIn, signUp, post, profile, contact — shared client+server |
| **Custom React Hooks** | **4** | useDraftStorage, useInlineEditOptimistic, and more |
| **Security Headers** | **7** | CSP, X-Frame-Options, X-Content-Type, XSS-Protection, HSTS, Referrer-Policy, Permissions-Policy |
| **Middleware Rules** | **79 lines** | JWT verification, RBAC (3 roles), route guards, header injection |
| **SEO Coverage** | **100%** | Every page has metadata, OG tags, Twitter cards, and structured data |
| **Image Optimization** | **Cloudinary CDN** | Auto-format, auto-quality, responsive `srcSet`, lazy loading |
| **AI Rate Limiting** | **5 tokens/day** | Per-user quota with 24h auto-reset and token tracking in DB |
| **Theme Switching** | **0ms FOUC** | Inline `<script>` in `<head>` applies theme before React hydration |
| **Auth Flow** | **Stateless JWT** | HttpOnly cookies, 7-day expiry, bcrypt 10 rounds, Edge-compatible (jose) |

---

## 🎬 Demo

> **Full walkthrough of the core user flows.**

### 📌 Key Flows

| Flow | What It Shows |
|---|---|
| **Create Post** | Markdown editor → AI enhance title → AI enhance body → upload thumbnail → publish |
| **AI Enhancement** | Gemini rewrites content in real-time → accept/dismiss suggestions → token tracking |
| **Like System** | Toggle like with optimistic UI → unique constraint per user → live count update |
| **Admin Dashboard** | Platform stats → manage users (role toggle/delete) → moderate posts → read messages |
| **Theme Toggle** | Instant dark/light switch with zero FOUC → persisted in localStorage |
| **Auth Flow** | Sign up → sign in → redirect preservation → JWT cookies → protected routes |

<p align="center">
  <a href="https://youtu.be/YOUR_VIDEO_ID">
    <img src="https://img.shields.io/badge/▶_Watch_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="Watch Demo on YouTube" />
  </a>
</p>

<!-- 🔗 UPDATE: Replace YOUR_VIDEO_ID above with your actual YouTube video ID -->

> 💡 **Tip:** Run the app locally with `bun run dev` and explore all flows at [localhost:3000](http://localhost:3000)

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.2.1 | React framework (App Router) |
| [React](https://react.dev) | 19.2.4 | UI library |
| [TypeScript](https://typescriptlang.org) | 6.0 | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | v4 | Utility-first CSS |
| [Zustand](https://zustand-demo.pmnd.rs) | 5.0 | Lightweight state management |
| [React Hook Form](https://react-hook-form.com) | 7.72 | Form management |
| [Zod](https://zod.dev) | 4.3 | Schema validation |
| [Lucide React](https://lucide.dev) | 1.7 | Icon library |
| [react-markdown](https://github.com/remarkjs/react-markdown) | 10.1 | Markdown rendering |
| [highlight.js](https://highlightjs.org) | 11.11 | Code syntax highlighting |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Next.js API Routes | — | REST API endpoints |
| [Prisma ORM](https://prisma.io) | 7.6 | Database ORM |
| [@prisma/adapter-pg](https://www.prisma.io/docs/orm/overview/databases/postgresql) | 7.6 | PostgreSQL driver adapter |
| [jose](https://github.com/panva/jose) | 6.2 | JWT verification (Edge-compatible) |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | 9.0 | JWT signing |
| [bcryptjs](https://github.com/nicolo-ribaudo/bcryptjs) | 3.0 | Password hashing |

### Integrations

| Service | Purpose |
|---|---|
| [Google Gemini](https://ai.google.dev) | AI content enhancement (gemini-flash-latest) |
| [Cloudinary](https://cloudinary.com) | Image upload, storage, and transformation |
| PostgreSQL | Primary database |

### Developer Tools

| Tool | Purpose |
|---|---|
| [Bun](https://bun.sh) | Package manager and runtime |
| [ESLint](https://eslint.org) | Code linting |
| [PostCSS](https://postcss.org) | CSS processing |
| [@faker-js/faker](https://fakerjs.dev) | Database seeding |

---

## 🔐 Role-Based Access Control

### 👤 Guest (Unauthenticated)

| Access | Allowed |
|---|---|
| View home, about, contact pages | ✅ |
| Browse global published posts | ✅ |
| View post detail | ⚠️ Modal box to sign in |
| Search and filter posts | ✅ |
| Submit contact form | ✅ |
| Sign up / Sign in | ✅ |
| Create, edit, delete posts | ❌ |
| Like posts | ❌ |
| Access dashboard | ❌ |
| Access admin panel | ❌ |

### 🔐 Authenticated User

| Access | Allowed |
|---|---|
| Everything a Guest can do | ✅ |
| View full post details | ✅ |
| Create new posts (draft) | ✅ |
| Edit own posts | ✅ |
| Delete own posts | ✅ |
| Publish/unpublish own posts | ✅ |
| Like/unlike posts | ✅ |
| Use AI enhancement (5 tokens/day) | ✅ |
| Upload thumbnails | ✅ |
| Update profile name | ✅ |
| View own dashboard | ✅ |
| View public user profiles | ✅ |
| Access admin panel | ❌ |

### 🛡️ Admin

| Access | Allowed |
|---|---|
| Everything a User can do | ✅ |
| Access admin dashboard | ✅ |
| View platform analytics | ✅ |
| View all posts (published + drafts) | ✅ |
| Edit/delete any post | ✅ |
| Manage all users | ✅ |
| Toggle user roles (user ↔ admin) | ✅ |
| Delete users (cascade) | ✅ |
| View contact messages | ✅ |
| Mark messages as read | ✅ |
| Filter posts by status in global feed | ✅ |

---

## 🔄 Data Flow

### Post Creation Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Client (Form)  │────▶│  API Route       │────▶│  PostgreSQL     │
│                  │     │  POST /api/posts  │     │  (Prisma)       │
│  1. Zod validate │     │  2. Verify JWT   │     │  3. Create post │
│  4. Upload thumb │     │  5. Validate body │     │  6. Return data │
│     to Cloudinary│     │                  │     │                 │
└────────┬─────────┘     └──────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│  7. Clear draft  │
│  8. Toast success│
│  9. Redirect to  │
│     /posts/{id}  │
└─────────────────┘
```

### Authentication Flow

```
┌────────────┐   POST /api/auth/signin   ┌────────────────┐
│  Sign In   │ ─────────────────────────▶ │  API Route     │
│  (Client)  │                            │                │
│            │   { email, password }       │  1. Zod validate│
│            │                            │  2. Find user   │
│            │   Set-Cookie: token=JWT    │  3. bcrypt check │
│            │ ◀───────────────────────── │  4. Sign JWT    │
└──────┬─────┘                            └────────────────┘
       │
       ▼ router.refresh()
┌────────────────────────┐
│  Root Layout (Server)   │
│  getAuthenticatedUser() │ ── cache() dedup ──▶ Prisma lookup
│  <AuthInitializer />    │ ── seeds Zustand store
└────────────────────────┘
       │
       ▼
  All Client Components read from useAuthStore()
```

### AI Enhancement Flow

```
Client: "AI Enhance" button
       │
       ▼
POST /api/ai/enhance { prompt, field }
       │
       ├── Verify JWT (x-user-id header)
       ├── Check aiTokens (daily quota: 5)
       ├── If expired day → reset tokens
       ├── If tokens <= 0 → 429 error
       │
       ▼
GoogleGenAI.generateContent()
       │
       ├── Decrement aiTokens
       ├── Update lastAiCall timestamp
       │
       ▼
Response: { text, field, remaining }
       │
       ▼
Client: SuggestionBox UI
  ├── Accept → apply to form field
  └── Dismiss → discard suggestion
```

---

## 🏗 Architecture

### Folder Structure

```
learn-next-app/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout (Navbar, Auth, SEO)
│   │   ├── page.tsx              # Home page
│   │   ├── globals.css           # Design tokens & global styles
│   │   ├── sitemap.ts            # Dynamic sitemap
│   │   ├── 403.tsx               # Forbidden page
│   │   ├── not-found.tsx         # 404 page
│   │   ├── posts/                # Public posts listing & detail
│   │   ├── signin/               # Sign in page
│   │   ├── signup/               # Sign up page
│   │   ├── profile/              # User profile settings
│   │   ├── contact/              # Contact form
│   │   ├── about/                # About page
│   │   ├── [userid]/             # Public user profiles
│   │   ├── dashboard/
│   │   │   ├── posts/            # User's posts management
│   │   │   ├── new/              # Post editor with AI
│   │   │   └── admin/            # Admin panel (stats, users, posts, messages)
│   │   └── api/                  # REST API route handlers
│   │       ├── auth/             # signup, signin, logout
│   │       ├── posts/            # CRUD, like, publish, thumbnail
│   │       ├── users/            # User profile updates
│   │       ├── ai/               # Gemini AI enhancement
│   │       ├── contact/          # Contact form handler
│   │       ├── upload/           # Cloudinary upload
│   │       ├── admin/            # Admin-only endpoints
│   │       ├── og/               # OpenGraph image generator
│   │       └── feeds/            # JSON Feed
│   ├── components/               # Shared components (EditableField)
│   ├── constants/                # App constants (thumbnails)
│   ├── hooks/                    # Custom hooks (draft, inline edit)
│   ├── lib/                      # Core utilities
│   │   ├── auth.ts               # Server-side auth (cached)
│   │   ├── data.ts               # Data access layer (Prisma queries)
│   │   ├── admin-utils.ts        # Admin auth helpers
│   │   ├── ai-config.ts          # AI model config & error codes
│   │   ├── cloudinary.ts         # Image upload & optimization
│   │   ├── jwt-utils.ts          # JWT verification (jose)
│   │   ├── seo-config.ts         # Centralized SEO metadata
│   │   ├── og-generator.ts       # OpenGraph utilities
│   │   └── structured-data.ts    # JSON-LD schema generators
│   ├── store/                    # Zustand state management
│   │   └── useAuthStore.ts       # Auth state (user, login, logout)
│   ├── utils/
│   │   └── zod/                  # Validation schemas & helpers
│   ├── types.ts                  # Global TypeScript types
│   └── proxy.ts                  # Middleware (auth guards)
├── components/                   # Global shared components
│   ├── Navbar.tsx                # Navigation bar
│   ├── ThemeToggle.tsx           # Dark/light mode toggle
│   ├── ThemeProvider.tsx         # Theme context provider
│   ├── Search.tsx                # Universal search component
│   ├── PostCard.tsx              # Post card for grids
│   ├── ShareButton.tsx           # Social sharing dropdown
│   ├── ThumbnailUpload.tsx       # Image upload component
│   ├── MarkdownRenderer.tsx      # Markdown → HTML renderer
│   ├── auth/AuthInitializer.tsx  # Auth store hydration
│   └── post/                     # Post-specific components
├── prisma/
│   ├── schema.prisma             # Database schema (4 models)
│   ├── lib/prisma.ts             # Prisma client singleton
│   ├── seed.ts                   # Database seeder
│   └── migrations/               # Migration history
├── public/                       # Static assets
│   ├── default-thumbnail.png     # Default post thumbnail
│   ├── robots.txt                # Crawler directives
│   └── site.webmanifest          # PWA manifest
└── scripts/
    └── diagnose-metadata.mjs     # SEO diagnostic tool
```

### Key Design Decisions

| Decision | Rationale |
|---|---|
| **Zustand over Context** | Minimal boilerplate for auth-only global state; avoids provider nesting |
| **Server-to-Client auth hydration** | Server fetches user once in root layout → seeds client store → eliminates client-side auth waterfall |
| **FOUC prevention inline script** | Runs before React hydration to apply dark mode class from localStorage |
| **Prisma PrismaPg adapter** | Edge-compatible PostgreSQL driver for serverless deployment |
| **Route-colocated components** | Feature components live in their route directory for locality of behavior |
| **Zod everywhere** | Single source of truth for validation rules shared between client forms and API routes |
| **force-dynamic on post routes** | Ensures likes and publish state are always fresh |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.0 or **Bun** ≥ 1.0
- **PostgreSQL** database (local or hosted — e.g., Neon, Supabase, Railway)
- **Cloudinary** account (for image uploads)
- **Google Gemini API Key** (for AI enhancement)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/LuckyLongre123/devposts-pro.git
cd devposts-pro

# 2. Install dependencies
bun install
# or
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your actual values (see below)

# 4. Generate Prisma client
bunx prisma generate
# or
npx prisma generate

# 5. Run database migrations
bunx prisma migrate dev
# or
npx prisma migrate dev

# 6. (Optional) Seed the database
bunx prisma db seed
# or
npx prisma db seed

# 7. Start the development server
bun run dev
# or
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 🔑 Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (pooler URL recommended) |
| `JWT_SECRET` | ✅ | Secret key for JWT signing/verification |
| `NEXT_PUBLIC_BASE_URL` | ✅ | Public application URL (e.g., `http://localhost:3000` for dev) |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key for AI content enhancement |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | ✅ | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key (server-side) |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret (server-side) |
| `NODE_ENV` | ⬡ | `development` or `production` |

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

JWT_SECRET="your-secure-random-secret-key"

NEXT_PUBLIC_BASE_URL="http://localhost:3000"

GEMINI_API_KEY="your-gemini-api-key"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

NODE_ENV=development
```

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push your repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Set the build command: `prisma generate && next build`
5. Deploy!

### Build Locally

```bash
# Build for production
bun run build
# or
npm run build

# Start production server
bun run start
# or
npm run start
```

### Production Considerations

- ✅ Set `NODE_ENV=production` for secure cookies
- ✅ Use a pooled database connection (e.g., Neon, Supabase pooler)
- ✅ Configure `NEXT_PUBLIC_BASE_URL` to your production domain
- ✅ Security headers are configured in `next.config.ts`
- ✅ Source maps are disabled in production (`productionBrowserSourceMaps: false`)

---

## 📝 Application Workflow

### User Journey Example

```
1. 🏠 Land on home page → see hero section
2. 📝 Click "Get Started Free" → /signup
3. ✅ Create account → redirected to /signin
4. 🔑 Sign in → redirected to /profile
5. ✏️ Navigate to Dashboard → "Create Post"
6. 📄 Write post in Markdown editor
7. 🤖 Click "AI Enhance" → Gemini rewrites content
8. 🖼️ Upload a thumbnail (drag & drop)
9. 📤 Click "Create" → post saved as DRAFT
10. 📖 Open post → click "Publish" → post goes live
11. 🌍 Share post via social sharing buttons
12. ❤️ Other users can like the post
13. 👤 View author's profile → see all their published posts
```

### Admin Journey

```
1. 🔑 Login with admin account
2. 🛡️ Click "Admin" in navbar → /dashboard/admin
3. 📊 View platform stats (users, posts, likes, messages)
4. 👥 Navigate to "Users" → manage roles, delete accounts
5. 📄 Navigate to "Posts" → moderate content
6. 💌 Navigate to "Messages" → read contact submissions
```

---

## 🗄️ Database Schema

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User      │       │    Post      │       │   Message    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (cuid)   │──┐    │ id (cuid)   │       │ id (cuid)   │
│ email ◆     │  │    │ title       │       │ name        │
│ password    │  │    │ body        │       │ email       │
│ name?       │  ├───▶│ published   │       │ message     │
│ role (enum) │  │    │ authorId ◆──│───┐   │ userId? ◆───│──┐
│ aiTokens    │  │    │ thumbnailUrl│   │   │ isRead      │  │
│ lastAiCall? │  │    │ createdAt   │   │   │ createdAt   │  │
│ createdAt   │  │    │ updatedAt   │   │   └─────────────┘  │
│ updatedAt   │  │    └──────┬──────┘   │                    │
└─────────────┘  │           │          │                    │
                 │    ┌──────┴──────┐   │                    │
                 │    │    Like      │   │                    │
                 │    ├─────────────┤   │                    │
                 │    │ id (cuid)   │   │                    │
                 └───▶│ userId ◆    │   │                    │
                      │ postId ◆────│───┘                    │
                      │ createdAt   │                        │
                      │ ◆◆ unique   │        ◀───────────────┘
                      └─────────────┘
```

**◆ = Foreign Key / Index** | **◆◆ = Composite Unique Constraint**

---

## 🧠 My Journey & Challenges Faced

> Building DevPostS Pro wasn't just about writing code — it was a journey of escaping "tutorial hell" and tackling real-world engineering problems head-on.

### 1. Escaping Tutorial Hell & The Database Pivot
I originally started this project as a simple note-taking app to break out of tutorial hell. I built and scrapped the authentication system twice because I was just copying code without understanding it. I realized I needed a solid foundation, so I paused to deeply study database architecture. Even though I was comfortable with MongoDB, I forced myself out of my comfort zone and chose **PostgreSQL with Prisma** to learn how relational data fits into Next.js. That decision naturally evolved the project from a simple notes app into a full-fledged social platform.

### 2. The Vercel Deployment & Prisma Mystery
When I was ready to test the OpenGraph implementation across social networks, ngrok kept failing. I decided to deploy to Vercel, but the builds crashed with a mysterious `PrismaClient not found` error. The Vercel logs didn't make the root cause obvious. After hours of debugging, I discovered that Vercel wasn't generating the Prisma files during the build phase. 

**The fix:** A simple but critical update to the build script in `package.json`:
```json
"scripts": {
  "build": "prisma generate && next build"
}
```

### 3. Fighting Outdated LLM Knowledge (Cloudinary & AI)
Adding image uploads with Cloudinary and integrating Google Gemini AI securely with Next.js App Router turned out to be tricky. I initially reached for AI tools to help speed things up, but because both Next.js and Cloudinary had recently released major updates, the LLMs kept suggesting deprecated methods that no longer worked. I had to abandon the AI, dig deep into the official documentation for hours, and manually configure the secure upload pipeline and AI token-tracking system (which grants 5 AI tokens per user per day).

### 4. Admin "Super Powers" & Optimistic UI
I realized early on that users might upload bad thumbnails or titles, so I built an Admin Dashboard. But I didn't just want basic CRUD tables; I wanted the admin to feel like a "Supreme Leader." 

**The Double-Click Edit Feature:** Admins can double-click **any** title or thumbnail across the platform (even on a user's public profile page like `/@user`) to instantly edit them inline without leaving the page.
To make this performant, I avoided standard full-page refetches. When an admin makes a change, only that specific item refetches, replacing the old content with a beautiful skeleton loader during the network request. I heavily utilized **pagination and debouncing** to ensure these "super power" actions wouldn't overload the database.

### 5. OpenGraph SEO & Secure Auth Gating
I wanted to share this project with friends on WhatsApp to show off the fancy OpenGraph image and title without explicitly saying "I built this website." Finding the right OG formats for Facebook, Twitter, LinkedIn, Telegram, Reddit, and WhatsApp took considerable testing.

However, I didn't want strangers wandering aimlessly through the app from open links. So, I implemented strict **auth-gated routing**. When someone clicks a shared link without being logged in, they are immediately intercepted by a mandatory Sign In / Sign Up modal, preventing them from accessing inner posts until they commit to joining the platform.

### 6. The Edge vs Node Runtime (JWT Handling)
Next.js middleware runs in the **Edge Runtime**, which lacks Node's `crypto` module. The standard `jsonwebtoken` library crashes in this environment. 
**My solution:** A dual-library approach. I used `jsonwebtoken` for signing tokens in the API routes (Node runtime) and `jose` (which uses the WebCrypto API) for verifying tokens in the middleware (Edge runtime).

### 7. Avoiding Flash of Unstyled Content (FOUC)
Based on feedback from friends, I added a dark/light mode toggle. However, because the theme preference is stored in `localStorage` (client-side only), React hydration occurs *after* the initial paint, causing a blinding white flash before switching to dark mode.
**The solution:** I injected a blocking, synchronous inline `<script>` into the `<head>` of `layout.tsx` that reads `localStorage` and applies the `dark` class *before* the browser renders the first frame.

---

## 🔮 Future Improvements

### Short-term

- [ ] **Comment System** — Add a Comment model and full CRUD (UI already partially built)
- [ ] **Email Notifications** — Send email on new likes, comments, or admin messages
- [ ] **Password Reset** — Implement forgot password flow with email verification
- [ ] **Rate Limiting** — Add rate limiting on auth and public API endpoints
- [ ] **Image Galleries** — Support multiple images per post

### Medium-term

- [ ] **Rich Text Editor** — Upgrade to a WYSIWYG editor (e.g., Tiptap, Plate) while keeping Markdown export
- [ ] **Tags & Categories** — Add tagging system with filterable categories
- [ ] **Reading Lists / Bookmarks** — Allow users to save posts for later
- [ ] **User Following** — Follow authors and get a personalized feed
- [ ] **Analytics Dashboard** — Per-post analytics (views, reads, shares)

### Long-term

- [ ] **API v2 (tRPC)** — Migrate to type-safe API layer
- [ ] **Real-time Collaboration** — Multi-user post editing
- [ ] **Webhooks** — Notify external services on post publish events
- [ ] **Plugin System** — Extensible architecture for custom integrations
- [ ] **i18n** — Multi-language support
- [ ] **PWA** — Full Progressive Web App with offline reading capability

---

<p align="center">
  Built with ❤️ by the <strong>Lucky Longre</strong>
  <br />
  <a href="https://github.com/LuckyLongre123/devposts-pro">GitHub</a> •
  <a href="https://devposts-pro.vercel.app">Live Demo</a>
</p>
