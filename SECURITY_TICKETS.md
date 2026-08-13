# Security Tickets (Medium)

Tracked during the pre-launch security review (Aug 2026).
Open each as a GitHub issue from this file, or fix directly.

---

## TICKET-01: Add security headers (CSP, nosniff, frame, referrer)

**Priority:** Medium
**Status:** Open

### Description
`next.config.mjs` sets no security headers. Add response headers so browsers
enforce sane defaults: a Content-Security-Policy, `X-Content-Type-Options:
nosniff`, `X-Frame-Options: DENY`, and `Referrer-Policy`.

### Acceptance Criteria
- [ ] Security headers configured in `next.config.mjs`
- [ ] CSP allows self-hosted fonts (next/font), no inline script
- [ ] Verified with `curl -I` on the deployed app
- [ ] App still renders and auth still works under CSP

---

## TICKET-02: Rate limit API routes

**Priority:** Medium
**Status:** Open

### Description
`/api/applications*` endpoints have no rate limiting. An authenticated user
(or leaked session) can hammer the Postgres DB. Add per-user rate limiting at
the edge (e.g. Vercel/Cloudflare) or in the route layer.

### Acceptance Criteria
- [ ] Rate limit applied to write endpoints (POST/PATCH/DELETE)
- [ ] Configurable per-user quota and window
- [ ] 429 responses returned with `Retry-After`
- [ ] No measurable latency regression for normal use

---

## TICKET-03: Sanitize external URL schemes

**Priority:** Medium
**Status:** Open

### Description
`jobPostingUrl` and `contact.linkedinUrl` are rendered directly into `href`
(`applications/[id]/page.tsx`). React does not block `javascript:` URLs, so a
paste of such a value yields a clickable script link (self-XSS vector).

### Acceptance Criteria
- [ ] Server-side: reject `jobPostingUrl` whose protocol is not `http`/`https`
- [ ] Client-side: render links only when `new URL(...).protocol` is `http(s):`
- [ ] Same guard applied to `linkedinUrl`

---

## TICKET-04: Upgrade @clerk/nextjs SDK

**Priority:** Medium
**Status:** Open

### Description
`@clerk/nextjs` is pinned at `^5.2.0`; current major is 7.x. Upgrade to the
latest 5.x, then latest 7.x, to pick up auth SDK security and compatibility
fixes. Requires re-running `clerk doctor` and re-testing sign-in/sign-up.

### Acceptance Criteria
- [ ] `@clerk/nextjs` upgraded (latest major)
- [ ] `clerk doctor` reports all green
- [ ] Sign-in, sign-up, session persistence, `UserButton` verified
- [ ] Middleware protection verified for anonymous requests

---

## TICKET-05: Upgrade Prisma to latest major

**Priority:** Medium
**Status:** Open

### Description
`@prisma/client`/`prisma` are at 5.16; current major is 7.x. Upgrade, regenerate
the client, and re-run a smoke test of all CRUD + attachment flows.

### Acceptance Criteria
- [ ] Prisma upgraded to latest major
- [ ] `prisma generate` succeeds
- [ ] Schema push/seed works against Neon
- [ ] All CRUD + attachment endpoints pass smoke test

---

## TICKET-06: Next.js 16 major upgrade (clears remaining npm audit)

**Priority:** Medium
**Status:** Open

### Description
`npm audit` still reports Next advisories that only clear with a major upgrade
to next@16 (breaking: React 19, config/middleware changes). Current code does
not exercise the vulnerable surfaces (no Server Actions, rewrites, custom
server, Pages Router, i18n), so this is not urgent — but schedule it.

### Acceptance Criteria
- [ ] Upgrade to next@16 + React 19
- [ ] All routes, middleware, and Clerk integration verified
- [ ] `npm audit` clean for Next package
- [ ] Full regression pass on core flows

---

## TICKET-07: Verify platform request-body limits for uploads

**Priority:** Medium
**Status:** Open

### Description
The upload limit is 10MB, but Vercel caps serverless function request bodies at
~4.5MB, so large uploads will fail in production. Confirm the host, and either
lower `MAX_ATTACHMENT_SIZE` in `src/lib/upload.ts` or pick a host without the cap.

### Acceptance Criteria
- [ ] Target host's request-body limit documented
- [ ] `MAX_ATTACHMENT_SIZE` matches or is below the platform limit
- [ ] Upload of a file near the limit verified in production

---

## TICKET-08: Credential/secret rotation before launch

**Priority:** Medium
**Status:** Open

### Description
Pre-launch hygiene: rotate the Neon `DATABASE_URL` password and Clerk keys so
no pre-production value is reused, and confirm they exist only in the hosting
platform's secret store (never in the repo).

### Acceptance Criteria
- [ ] Neon DB password rotated and DB still reachable via new URL
- [ ] Clerk `CLERK_SECRET_KEY` rotated
- [ ] Confirmed no secret present in git history or deployed bundles
- [ ] Env vars configured only in the hosting platform
