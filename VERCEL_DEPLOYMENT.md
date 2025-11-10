# Deploying to Vercel

This app uses SQLite with better-sqlite3, which **does not work on Vercel's serverless platform**. You need to migrate to a cloud database first.

## Option 1: Use Turso (Recommended - SQLite Compatible)

Turso is a SQLite-compatible edge database that works great with Vercel and requires minimal code changes.

### Steps:

1. **Create a Turso account and database:**
   ```bash
   # Install Turso CLI
   curl -sSfL https://get.tur.so/install.sh | bash

   # Sign up
   turso auth signup

   # Create a database
   turso db create digital-garden

   # Get your database URL
   turso db show digital-garden --url

   # Create an auth token
   turso db tokens create digital-garden
   ```

2. **Update your dependencies:**
   ```bash
   npm install @libsql/client
   npm uninstall better-sqlite3
   ```

3. **Update lib/db.ts to use Turso:**
   Replace the better-sqlite3 implementation with @libsql/client

4. **Update Prisma schema (prisma/schema.prisma):**
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

5. **Deploy to Vercel:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login
   vercel login

   # Deploy
   vercel
   ```

6. **Set environment variables in Vercel:**
   - Go to your project settings in Vercel dashboard
   - Add `DATABASE_URL` with your Turso database URL
   - Add `TURSO_AUTH_TOKEN` with your auth token

## Option 2: Use Vercel Postgres

1. **Enable Vercel Postgres:**
   - Go to your Vercel project dashboard
   - Navigate to Storage tab
   - Create a Postgres database

2. **Update Prisma schema:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Migrate your code:**
   - Remove lib/db.ts (better-sqlite3)
   - Use lib/prisma.ts instead
   - Update all API routes to use Prisma Client
   - Run `npx prisma generate`
   - Run `npx prisma db push`

4. **Deploy:**
   ```bash
   vercel
   ```

## Option 3: Deploy to a Different Platform

If you want to keep using SQLite with better-sqlite3, consider these platforms:
- **Railway**: Supports persistent storage
- **Fly.io**: Supports volumes for SQLite
- **Render**: Supports persistent disks

## Quick Deploy (after choosing a database solution)

```bash
# Build locally to test
npm run build

# Deploy to Vercel
vercel

# For production deployment
vercel --prod
```

## Environment Variables

Make sure to set these in your Vercel project settings:
- `DATABASE_URL`: Your database connection string

## Post-Deployment

After deployment:
1. Run database migrations if needed
2. Test all API endpoints
3. Verify media search and CRUD operations work correctly
