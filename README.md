# DevPostS Pro 🚀

**A modern blogging platform where independent writers share thoughts, build communities, and enhance their content with AI.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

---

## 🎯 Overview

DevPostS Pro is a **full-stack blogging platform** built with modern web technologies. It empowers users to create, publish, and share content with a vibrant community while offering intelligent AI-powered writing enhancements.

### ✨ Key Highlights

- 📝 **Full Publishing Suite** - Rich content creation with markdown support
- 🤖 **AI Content Enhancement** - Google Generative AI integration for content improvements
- ❤️ **Social Features** - Like system, community engagement, comments
- 📊 **Creator Dashboard** - Analytics and post management tools
- 🖼️ **Media Management** - Cloudinary integration for image uploads & optimization
- 🔐 **Secure Authentication** - JWT-based auth with role-based access control
- ⚡ **SEO Optimized** - Automatic metadata generation, sitemaps, OG tags
- 📱 **Fully Responsive** - Mobile-first design with Tailwind CSS
- 🎨 **Modern UI** - Clean, distraction-free interface with smooth animations

---


## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router, Server Components)
- **Language**: TypeScript 6
- **Styling**: Tailwind CSS 4 + Typography plugin
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod validation
- **Markdown**: React Markdown + GFM support

### Backend
- **Runtime**: Node.js
- **API Routes**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma 7
- **Authentication**: JWT (jose)
- **Password Hashing**: bcryptjs

### Third-Party Services
- **AI**: Google Generative AI (@google/genai)
- **Image Storage**: Cloudinary
- **Monitoring**: Highlight.js (code syntax)
- **UI Components**: Heroicons, Lucide React

---

## 📁 Project Structure

```
learn-next-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── ai/            # AI enhancement endpoints
│   │   │   ├── auth/          # Auth routes (signin, signup, logout)
│   │   │   ├── posts/         # Post CRUD operations
│   │   │   ├── users/         # User endpoints
│   │   │   ├── upload/        # File upload handlers
│   │   │   ├── contact/       # Contact form submission
│   │   │   └── feeds/         # RSS feed generation
│   │   ├── dashboard/         # Protected dashboard pages
│   │   ├── posts/             # Public post viewing
│   │   ├── profile/           # User profile pages
│   │   ├── signin/            # Authentication pages
│   │   ├── signup/
│   │   ├── contact/           # Contact page
│   │   ├── about/             # About page
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable React components
│   │   ├── auth/              # Authentication components
│   │   ├── post/              # Post-related components
│   │   ├── Navbar.tsx
│   │   ├── Search.tsx
│   │   └── ...
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   │   ├── auth.ts            # Authentication helpers
│   │   ├── ai-config.ts       # AI service configuration
│   │   ├── seo-config.ts      # SEO utilities
│   │   ├── jwt-utils.ts       # JWT token operations
│   │   └── cloudinary.ts      # Image upload service
│   ├── store/                 # Zustand state stores
│   ├── types.ts               # TypeScript types
│   ├── constants/             # App constants
│   └── utils/                 # Utility functions
├── components/                # Server components
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Database seeding
│   ├── migrations/            # Migration history
│   └── lib/prisma.ts          # Prisma client setup
├── public/                    # Static assets
├── scripts/                   # Build & utility scripts
├── next.config.ts             # Next.js configuration
├── tsconfig.json              # TypeScript config
└── package.json               # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommend Node 20 LTS)
- npm or yarn package manager
- PostgreSQL 12+ database (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/learn-next-app.git
   cd learn-next-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   See [Environment Variables](#-environment-variables) section below.

4. **Set up the database**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `DATABASE_URL` | String | PostgreSQL connection string | `postgresql://user:password@localhost:5432/devposts` |
| `GOOGLE_API_KEY` | String | Google Generative AI API key | `AIza...` |
| `CLOUDINARY_CLOUD_NAME` | String | Your Cloudinary cloud name | `my-cloud-123` |
| `CLOUDINARY_API_KEY` | String | Cloudinary API key | `12345...` |
| `CLOUDINARY_API_SECRET` | String | Cloudinary API secret | `abcde...` |
| `JWT_SECRET` | String | Secret key for JWT token signing | `your-secret-key-min-32-chars` |
| `NEXT_PUBLIC_API_BASE` | String | Public API base URL | `http://localhost:3000` (dev) / `https://yoursite.com` (prod) |

### Optional Variables

```env
# Email (if implementing email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 📝 Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (http://localhost:3000) |
| `npm start` | Start production server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint checks |
| `npm run diagnose:seo` | Generate SEO metadata report |

---

## 🔌 API Overview

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/logout` - Logout user

### Posts
- `GET /api/posts` - Fetch all published posts
- `GET /api/posts/[id]` - Get post by ID
- `POST /api/posts` - Create new post (authenticated)
- `PUT /api/posts/[id]` - Update post (author only)
- `DELETE /api/posts/[id]` - Delete post (author only)
- `POST /api/posts/[id]/publish` - Publish/unpublish post
- `POST /api/posts/[id]/like` - Like a post

### AI Enhancement
- `POST /api/ai/enhance` - Enhance post content with AI suggestions

### Users
- `GET /api/users/[id]` - Get user profile
- `POST /api/users/[id]` - Update user profile

### Upload
- `POST /api/upload/thumbnail` - Upload post thumbnail

### Contact
- `POST /api/contact` - Submit contact form

### Feeds
- `GET /api/feeds/json` - Get RSS feed (JSON format)

---

## 💾 Database Schema

DevPostS Pro uses Prisma ORM with PostgreSQL. Key models:

### User
- User authentication & profile management
- Role-based access control (User, Admin)
- AI token allocation system
- Posts and likes relationships

### Post
- Blog post content with markdown support
- Publication status tracking
- Author relationships
- Optional thumbnail images
- Like and comment relationships

### Like
- Post engagement tracking
- Unique constraint: one user = one like per post

### Message
- Contact form submissions
- Email inquiries

---

## 🔐 Authentication Flow

1. **SignUp** → Password hashed with bcryptjs → User stored in DB
2. **SignIn** → Verify credentials → JWT token generated
3. **JWT Token** → Stored in HTTP-only cookie → Verified on protected routes
4. **Protected Routes** → JWT extracted from cookies → User authenticated

---

## 🎨 Styling & Components

- **Tailwind CSS 4** for utility-first styling
- **Typography plugin** for optimized markdown rendering
- **Heroicons** + **Lucide React** for consistent iconography
- **Responsive design** - Mobile-first approach
- **Dark mode ready** - CSS variables for theming

---

## 📊 SEO & Performance

✅ **SEO Features**
- Automatic metadata generation per page
- Open Graph (OG) tags for social sharing
- Structured data (JSON-LD)
- Sitemap generation
- RSS feeds

✅ **Performance Optimizations**
- Server-side rendering (SSR) for SEO pages
- Image optimization with Cloudinary
- Code splitting with dynamic imports
- Bundle size optimization
- Caching strategies

---

## 🐳 Docker Support

*Optional - Add if Docker setup exists*

```bash
docker build -t devposts .
docker run -p 3000:3000 devposts
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from `.env.local`

3. **Configure PostgreSQL**
   - Use Vercel Postgres, AWS RDS, or Supabase
   - Update `DATABASE_URL` on Vercel

4. **Deploy**
   ```bash
   git push origin main  # Auto-deploys on Vercel
   ```

### Alternative: Deploy to Other Platforms

**Heroku:**
```bash
heroku create your-app-name
heroku config:set DATABASE_URL=your-postgres-url
git push heroku main
```

**Railway:**
- Connect GitHub repo
- Add environment variables
- Deploy with one click

**AWS/DigitalOcean:**
- Create VM instance
- Install Node.js & PostgreSQL
- Clone repo and run `npm run build && npm start`

---

## 📈 Roadmap & Future Improvements

### Coming Soon ✨
- [ ] Read time estimation on posts
- [ ] Advanced search with filters
- [ ] User follow system
- [ ] Email notifications
- [ ] Post scheduling
- [ ] Analytics dashboard for creators
- [ ] Export posts as PDF
- [ ] Dark/Light theme switcher
- [ ] Internationalization (i18n)
- [ ] Mobile app (React Native)

### Performance Goals 🎯
- Target Lighthouse scores: 95+ on all metrics
- Core Web Vitals optimization
- Database query optimization

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check DATABASE_URL is correct
echo $DATABASE_URL

# Reset migrations
npx prisma migrate dev --name reset
```

### AI Tokens Not Available
```bash
# Verify GOOGLE_API_KEY is set
echo $GOOGLE_API_KEY

# Check token allocation in database
npx prisma studio
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

---

## 🤝 Contributing

We love contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Quick Start:**
```bash
git checkout -b feat/your-feature
# Make changes
git commit -m "feat(scope): description"
git push origin feat/your-feature
# Create Pull Request
```

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com
- Portfolio: yourportfolio.com

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting & infrastructure
- Prisma for database toolkit
- Google Generative AI for AI capabilities
- All open-source contributors

---

## 📞 Support & Community

- 📖 [Documentation](./docs)
- 🐛 [Report Issues](https://github.com/yourusername/learn-next-app/issues)
- 💬 [Discussions](https://github.com/yourusername/learn-next-app/discussions)
- 📧 Contact: support@devposts.com

---

<div align="center">

**Made with ❤️ by the DevPostS Team**

⭐ Star us on GitHub if this helps you!

</div>
