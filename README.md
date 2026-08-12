# Job Tracker

A blazing-fast, tech-agnostic job application tracker built with **Clean Architecture** (Ports & Adapters). Swap any technology — database, auth, storage — without touching your business logic or UI.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER                                          │
│  ├─ Components (React)                                       │
│  ├─ Pages (Next.js App Router)                               │
│  └─ API Routes (Next.js)                                    │
├─────────────────────────────────────────────────────────────┤
│  APPLICATION LAYER                                         │
│  ├─ Use Cases (business logic)                               │
│  └─ Domain Models (pure TypeScript)                        │
├─────────────────────────────────────────────────────────────┤
│  PORTS (Interfaces)                                        │
│  ├─ IApplicationRepository                                  │
│  ├─ IAuthProvider                                           │
│  └─ IStorageProvider                                        │
├─────────────────────────────────────────────────────────────┤
│  ADAPTERS (Implementations)                                │
│  ├─ DB: Prisma (Neon/Supabase/Postgres) or Dexie (IndexedDB)│
│  ├─ Auth: Clerk or Local (no external service)               │
│  └─ Storage: Local (base64), Supabase, S3                   │
└─────────────────────────────────────────────────────────────┘
```

## Swap Technologies in 30 Seconds

### Database
| Adapter | Use Case | How |
|---------|----------|-----|
| `prisma` | PostgreSQL (Neon, Supabase, Railway, RDS) | `DATABASE_ADAPTER=prisma` + `DATABASE_URL=...` |
| `dexie` | Zero-backend, offline-first, privacy | `DATABASE_ADAPTER=dexie` |

### Auth
| Adapter | Use Case | How |
|---------|----------|-----|
| `clerk` | Production OAuth, MFA, sessions | `AUTH_ADAPTER=clerk` + Clerk keys |
| `local` | Dev mode, no external service | `AUTH_ADAPTER=local` |

### Storage
| Adapter | Use Case | How |
|---------|----------|-----|
| `local` | Base64 in DB, no external service | `STORAGE_ADAPTER=local` |
| `supabase` | Cloud file storage | `STORAGE_ADAPTER=supabase` + Supabase keys |

## Quick Start

### Option 1: Zero Setup (Dexie + Local Auth)
No database, no auth service, no credit card. Everything stays in your browser.

```bash
git clone https://github.com/YOUR_USERNAME/job-tracker.git
cd job-tracker
npm install
```

Create `.env.local`:
```bash
DATABASE_ADAPTER=dexie
AUTH_ADAPTER=local
STORAGE_ADAPTER=local
```

```bash
npm run dev
```

Done. Open `http://localhost:3000`. Your data lives in IndexedDB.

### Option 2: Full Stack (Neon + Clerk)

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local`:
```bash
DATABASE_ADAPTER=prisma
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/jobtracker?sslmode=require"

AUTH_ADAPTER=clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

STORAGE_ADAPTER=local
```

```bash
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

## Project Structure

```
job-tracker/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth pages (sign-in, sign-up)
│   │   ├── (dashboard)/              # Main app pages
│   │   │   ├── page.tsx              # Dashboard (list/board views)
│   │   │   ├── applications/
│   │   │   │   ├── new/page.tsx      # New application form
│   │   │   │   └── [id]/page.tsx     # Application detail
│   │   └── api/applications/         # REST API (uses container)
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── applications/             # Application-specific components
│   │   └── layout/                   # Layout components
│   ├── lib/
│   │   ├── core/                     # Business logic (framework-agnostic)
│   │   │   ├── domain/               # Domain models & types
│   │   │   ├── ports/                # Interfaces (contracts)
│   │   │   └── usecases/             # Business logic
│   │   ├── adapters/                 # Concrete implementations
│   │   │   ├── db/prisma/            # PostgreSQL via Prisma
│   │   │   ├── db/dexie/             # IndexedDB via Dexie
│   │   │   ├── auth/clerk/           # Clerk auth
│   │   │   ├── auth/local/           # Local auth (dev mode)
│   │   │   └── storage/local/        # Local file storage
│   │   └── infrastructure/           # DI container & config
│   └── types/                        # Shared types
├── prisma/
│   └── schema.prisma                 # Database schema
└── public/                           # Static assets
```

## Adding a New Adapter

Want to use **Supabase** as your database? Create one file:

```typescript
// src/lib/adapters/db/supabase/supabase-repository.ts
import { IApplicationRepository } from "@/lib/core/ports/repository";

export class SupabaseApplicationRepository implements IApplicationRepository {
  async findAll(userId: string) { /* ... */ }
  async findById(id: string, userId: string) { /* ... */ }
  async create(userId: string, input) { /* ... */ }
  async update(id, userId, input) { /* ... */ }
  async delete(id, userId) { /* ... */ }
  async search(userId, query) { /* ... */ }
  async findByStatus(userId, status) { /* ... */ }
  async findByTags(userId, tags) { /* ... */ }
}
```

Then register it in `src/lib/infrastructure/container.ts`:

```typescript
case "supabase":
  const { SupabaseApplicationRepository } = await import("@/lib/adapters/db/supabase/supabase-repository");
  this._repo = new SupabaseApplicationRepository();
  break;
```

Set `DATABASE_ADAPTER=supabase` in `.env.local`. Done. Zero UI changes.

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Add environment variables from `.env.local`
4. If using Prisma: add `npx prisma generate` to build command
5. Deploy

### Self-Hosted
```bash
npm run build
npm start
```

## Roadmap

- [x] Clean Architecture (Ports & Adapters)
- [x] Prisma adapter (PostgreSQL/SQLite)
- [x] Dexie adapter (IndexedDB, offline-first)
- [x] Clerk auth adapter
- [x] Local auth adapter (zero external deps)
- [x] Application CRUD + status pipeline
- [x] Search & filter
- [x] List view + Kanban board
- [x] Dark mode
- [ ] Contact management
- [ ] Interview tracking
- [ ] Reminders & notifications
- [ ] Resume upload & versioning
- [ ] Analytics dashboard
- [ ] PWA / Offline mode
- [ ] Android app (TWA)

## License

MIT
