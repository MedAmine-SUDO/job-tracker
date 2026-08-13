# Job Tracker

A fast, tech-agnostic job application tracker built with **Clean Architecture** (Ports & Adapters). Swap any technology — database, auth, storage — without touching your business logic or UI.

## Features

- **Authentication** — Clerk-powered sign-in/sign-up with route protection (middleware, fail-closed)
- **Application CRUD** — full pipeline (wishlist → applied → interviews → offer → accepted/rejected), tags, search & status filters
- **Views** — list view and Kanban board, dark/light mode
- **Attachments** — upload your resume, cover letter, or job description (PDF/DOC/TXT/images) when creating an application or from the detail page; per-category, with 10MB limit and server-side MIME whitelist
- **Detail page** — job description, notes, contacts, interviews, and attachment list
- **Dashboard stats** — total, active, in-interviews, offers
- **Tech-agnostic storage** — files stored as base64 data URLs (local adapter) by default; swap to Supabase/S3 later via `STORAGE_ADAPTER`
- **Tests** — Vitest unit tests + Playwright e2e (auth, create, upload)

## Technology Choices & Why

| Tech | Why we chose it |
|------|-----------------|
| **Next.js 14 (App Router)** | React meta-framework: file-based routing, RSC/CSR where it fits, and colocated API routes — one codebase for UI + API. Middleware enables edge-level route protection. |
| **TypeScript** | Type-safe domain models and adapter contracts; catches cross-layer bugs at compile time. |
| **Clean Architecture (Ports & Adapters)** | The core decision. Business logic (`src/lib/core`) knows nothing about Prisma, Clerk, or storage. Every integration is behind a port (`IApplicationRepository`, `IAuthProvider`, `IStorageProvider`) so you can swap providers by changing one env var — no UI or use-case changes. |
| **Prisma ORM + Neon Postgres** | Type-safe database access with an ergonomic schema; Neon is a serverless Postgres that doesn't pause, so it's cheap and always-on. Postgres also means migrations, relations, and array fields (tags) out of the box. |
| **Clerk** | Authentication is the one thing you shouldn't DIY. Clerk handles OAuth (Google/GitHub/LinkedIn/Microsoft), MFA, sessions, and password resets as a managed service — with a single integration that also provides route-level guards. |
| **Dexie (IndexedDB)** | Optional zero-backend mode: same app works fully offline in the browser. Proves the port/adapters design — swap `DATABASE_ADAPTER=dexie` and nothing else changes. |
| **Base64 local storage adapter** | Simplest possible file storage: files become data URLs in the DB, no buckets or CDN to manage at launch. The `IStorageProvider` port means we can move to Supabase/S3 later without touching upload code. |
| **TanStack Query** | Server-state management: caching, refetching, and optimistic updates for the dashboard and detail pages with minimal boilerplate. |
| **Tailwind CSS + Radix + shadcn-style components** | Rapid, consistent UI without a heavy component library; dark mode via `next-themes`. |
| **Vitest + Playwright** | Fast unit tests for the core layer, plus real-browser e2e tests that exercise auth, form flows, and uploads against the running app. |
| **Next 14.2.35 (not 15/16)** | The latest patched 14.x line fixes critical CVEs (e.g. CVE-2025-29927) while keeping the stable React 18 setup. A major upgrade is tracked in `SECURITY_TICKETS.md`. |

> Note: `fuse.js`, `date-fns`, `zustand`, `react-hook-form`, and `zod` are declared in `package.json` from earlier scaffolding but are not yet used; nothing relies on them.

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
git clone https://github.com/MedAmine-SUDO/job-tracker.git
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
npx prisma generate
npx prisma db push
npm run dev
```

## Testing

### Unit tests (Vitest)

Covers the core layer: application use cases (CRUD, ownership isolation, attachment upload/delete wiring) and the local storage adapter (MIME detection, base64 encoding).

```bash
npm run test        # run once
npm run test:watch  # watch mode
npm run test:coverage
```

### E2E tests (Playwright + Clerk)

Smoke test of the real stack: sign-in via Clerk testing tokens, create an application, upload a resume, verify the detail page. Requires Clerk **Email + Password** auth enabled on your dev instance.

```bash
npx playwright install chromium
npm run test:e2e
```

Prerequisites (in `.env.local`, keys already in `.env.example`):

```bash
# E2E user (the +clerk_test suffix avoids real emails; verification codes are always 424242)
E2E_CLERK_USER_EMAIL=jobtracker-e2e+clerk_test@example.com
E2E_CLERK_USER_PASSWORD=change-me-strong-password
```

## Security

Pre-launch hardening applied:

- **Next.js 14.2.35** — fixes CVE-2025-29927 (critical middleware authorization bypass)
- **Fail-closed middleware** — if Clerk errors, requests are redirected to sign-in instead of passing through
- **Server-side upload MIME whitelist** — only PDF/DOC/DOCX/TXT/MD/images accepted (shared constants in `src/lib/upload.ts`)
- **Ownership-scoped data access** — every repository query filters by `userId`

Medium-priority follow-ups are tracked as tickets in [`SECURITY_TICKETS.md`](./SECURITY_TICKETS.md) (security headers, rate limiting, URL scheme sanitization, SDK upgrades, credential rotation).

## Project Structure

```
job-tracker/
├── src/
│   ├── app/
│   │   ├── (auth)/                   # Sign-in / sign-up pages
│   │   ├── (dashboard)/              # Main app pages (dashboard, new, detail)
│   │   └── api/applications/         # REST API (uses DI container)
│   │       └── [id]/attachments/     # Upload + delete attachments
│   ├── components/
│   │   ├── ui/                       # shadcn/ui-style primitives
│   │   ├── applications/             # Form, list, board, attachments section
│   │   └── layout/                   # Sidebar, search, filters, providers
│   ├── lib/
│   │   ├── core/                     # Domain, ports, use cases (framework-agnostic)
│   │   ├── adapters/                 # Prisma, Dexie, Clerk, local auth, local storage
│   │   ├── infrastructure/           # DI container
│   │   └── upload.ts                 # Shared upload constraints (server + client)
│   └── middleware.ts                 # Route protection (fail-closed)
├── e2e/                              # Playwright tests + fixtures
├── prisma/schema.prisma              # Database schema
├── vitest.config.ts                  # Unit test config
├── playwright.config.ts              # E2E test config
└── SECURITY_TICKETS.md               # Open security follow-ups
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
  async addAttachment(applicationId, userId, input) { /* ... */ }
  async deleteAttachment(applicationId, userId, attachmentId) { /* ... */ }
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
4. Add `npx prisma generate` to the build command
5. Deploy

> Note: Vercel caps serverless function request bodies at ~4.5MB. The upload limit is 10MB, so large uploads will fail there — see `SECURITY_TICKETS.md` TICKET-07.

### Self-Hosted
```bash
npm run build
npm start
```

## Roadmap

- [x] Clean Architecture (Ports & Adapters)
- [x] Prisma adapter (PostgreSQL)
- [x] Dexie adapter (IndexedDB, offline-first)
- [x] Clerk auth adapter + route protection
- [x] Application CRUD + status pipeline
- [x] Search, tags & filters
- [x] List view + Kanban board
- [x] Dark mode
- [x] Dashboard stats
- [x] Resume / cover letter / job description upload
- [x] Unit + e2e test suite
- [x] Security hardening + ticket backlog
- [ ] Contact management (CRUD)
- [ ] Interview tracking (CRUD)
- [ ] Reminders & notifications
- [ ] Resume versioning
- [ ] Analytics dashboard
- [ ] PWA / Offline mode
- [ ] Android app (TWA)

## License

MIT
