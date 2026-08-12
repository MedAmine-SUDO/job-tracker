# Job Tracker

A blazing-fast job application tracker built with Next.js 14, Tailwind CSS, and Prisma. Track your applications, interviews, contacts, and offers in one place. Works offline and syncs when connected.

## Features

- **Application Pipeline**: Track from Wishlist → Applied → Interview → Offer
- **Document Management**: Upload resumes, cover letters, job descriptions
- **Contact Tracking**: Save recruiter/hiring manager details with LinkedIn links
- **Interview Log**: Record questions, notes, and ratings for each round
- **Smart Search**: Fuzzy search across companies, positions, and notes
- **Kanban Board**: Visual pipeline view
- **Dark Mode**: System-aware with manual toggle
- **Mobile-First**: Optimized for phone use, PWA-ready
- **Offline-First**: Works without internet, syncs when connected

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL + Prisma
- **Auth**: Clerk
- **State**: Zustand + TanStack Query
- **Search**: Fuse.js (client-side)
- **Offline**: Dexie.js (IndexedDB)

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/job-tracker.git
cd job-tracker
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — From Clerk dashboard
- `CLERK_SECRET_KEY` — From Clerk dashboard

### 3. Database Setup

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
job-tracker/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (Clerk)
│   ├── (dashboard)/       # Main app pages
│   └── api/               # API routes
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── applications/      # Application-specific components
│   └── layout/            # Layout components
├── lib/
│   ├── db/                # Prisma client
│   └── stores/            # Zustand stores
├── types/                 # TypeScript types
├── prisma/
│   └── schema.prisma      # Database schema
└── public/                # Static assets
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Add PostgreSQL (Vercel Postgres or Supabase)
5. Deploy

### Self-Hosted

Build and start:
```bash
npm run build
npm start
```

## Roadmap

- [x] Core application CRUD
- [x] Status pipeline
- [x] Search & filter
- [ ] Resume upload & versioning
- [ ] Contact management
- [ ] Interview tracking
- [ ] Reminders & notifications
- [ ] Analytics dashboard
- [ ] PWA / Offline mode
- [ ] Android app (TWA)
- [ ] iOS app

## License

MIT
