#!/bin/bash
set -e

echo "🚀 Job Tracker — GitHub Setup Script"
echo ""

if [ ! -d .git ]; then
  echo "📦 Initializing Git repository..."
  git init
  git branch -m main
fi

if [ ! -f .env.local ]; then
  echo "📝 Creating .env.local from template..."
  cp .env.example .env.local
fi

echo "➕ Adding files to Git..."
git add .

echo "💾 Creating initial commit..."
git commit -m "feat: initial project scaffold with clean architecture

- Ports & Adapters architecture (swap any tech)
- Prisma adapter (Neon, Supabase, any Postgres)
- Dexie adapter (IndexedDB, offline-first, zero backend)
- Clerk auth adapter
- Local auth adapter (no external service)
- Application CRUD with status pipeline
- Kanban board + list views
- Search, filter, and tags
- Dark mode support
- Mobile-first responsive design"

if ! git remote get-url origin > /dev/null 2>&1; then
  echo ""
  echo "🔗 No remote repository configured."
  echo ""
  echo "Create a new repo at: https://github.com/new"
  echo ""
  echo "Then choose ONE:"
  echo ""
  echo "  SSH:"
  echo "    git remote add origin git@github.com:YOUR_USERNAME/job-tracker.git"
  echo ""
  echo "  HTTPS:"
  echo "    git remote add origin https://github.com/YOUR_USERNAME/job-tracker.git"
  echo ""
  echo "  Then: git push -u origin main"
  echo ""
else
  REMOTE_URL=$(git remote get-url origin)
  echo "🌐 Remote: $REMOTE_URL"
  echo "🚀 Pushing..."
  git push -u origin main
  echo "✅ Done!"
fi

echo ""
echo "📋 Next steps:"
echo "  1. Choose your stack in .env.local:"
echo "     - Zero setup: DATABASE_ADAPTER=dexie, AUTH_ADAPTER=local"
echo "     - Full stack: DATABASE_ADAPTER=prisma, AUTH_ADAPTER=clerk"
echo "  2. Run: npm install"
echo "  3. If using Prisma: npx prisma migrate dev"
echo "  4. Run: npm run dev"
echo ""
