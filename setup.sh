#!/bin/bash
set -e

echo "🚀 Job Tracker — GitHub Setup Script"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
  echo "📦 Initializing Git repository..."
  git init
  git branch -m main
fi

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
  echo "📝 Creating .env.local from template..."
  cp .env.example .env.local
fi

# Add all files
echo "➕ Adding files to Git..."
git add .

# Initial commit
echo "💾 Creating initial commit..."
git commit -m "feat: initial project scaffold

- Next.js 14 app router setup
- Tailwind CSS + shadcn/ui
- Prisma schema with full data model
- Application CRUD components
- Kanban board + list views
- Search, filter, and status pipeline
- Clerk auth integration
- Dark mode support
- Mobile-first responsive design"

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
  echo ""
  echo "🔗 No remote repository configured."
  echo ""
  echo "To push to GitHub, first create a new repo at:"
  echo "  https://github.com/new"
  echo ""
  echo "Then choose ONE of these:"
  echo ""
  echo "  SSH (recommended):"
  echo "    git remote add origin git@github.com:YOUR_USERNAME/job-tracker.git"
  echo ""
  echo "  HTTPS:"
  echo "    git remote add origin https://github.com/YOUR_USERNAME/job-tracker.git"
  echo ""
  echo "  Then run: git push -u origin main"
  echo ""
else
  REMOTE_URL=$(git remote get-url origin)
  echo "🌐 Remote found: $REMOTE_URL"
  echo "🚀 Pushing to origin..."
  git push -u origin main
  echo "✅ Done! Your project is on GitHub."
fi

echo ""
echo "📋 Next steps:"
echo "  1. Run: npm install"
echo "  2. Update .env.local with your credentials"
echo "  3. Run: npx prisma migrate dev"
echo "  4. Run: npm run dev"
echo ""
