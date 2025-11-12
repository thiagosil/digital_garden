# Deploying to Vercel

This app has been configured to use **Turso**, a SQLite-compatible edge database that works perfectly with Vercel's serverless platform.

## Setup Turso Database

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

2. **Initialize your database schema:**
   ```bash
   # Get the Turso database URL from the previous step
   export DATABASE_URL="libsql://[your-database].turso.io"
   export TURSO_AUTH_TOKEN="your-token-here"

   # Push the Prisma schema to Turso
   pnpm exec prisma db push
   ```

## Deploy to Vercel

1. **Install Vercel CLI (if not already installed):**
   ```bash
   pnpm add -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set environment variables in Vercel:**
   - Go to your project settings in Vercel dashboard
   - Navigate to Environment Variables
   - Add the following variables:
     - `DATABASE_URL` = Your Turso database URL (e.g., `libsql://digital-garden-xxx.turso.io`)
     - `TURSO_AUTH_TOKEN` = Your Turso auth token

5. **Redeploy after setting environment variables:**
   ```bash
   vercel --prod
   ```

## Local Development

For local development, you can use a local SQLite file:

```bash
# Create a .env file
cp .env.example .env

# The DATABASE_URL is already set to file:./prisma/dev.db
# Initialize your local database
pnpm exec prisma db push

# Start development server
pnpm run dev
```

## Troubleshooting

### Database Connection Issues

If you see database errors after deployment:
1. Verify your environment variables are set correctly in Vercel
2. Ensure the Turso auth token has not expired
3. Check that your Turso database is active

### Schema Migrations

To update your database schema:
```bash
# Update prisma/schema.prisma
# Then push changes to Turso
pnpm exec prisma db push
```

## Post-Deployment Checklist

After deployment:
- ✅ Test all API endpoints (`/api/media`, `/api/media/[id]`, `/api/search`)
- ✅ Verify media search functionality
- ✅ Test CRUD operations (Create, Read, Update, Delete)
- ✅ Check image loading from external sources (TMDB, Google Books, RAWG)

## Additional Resources

- [Turso Documentation](https://docs.turso.tech/)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
