# Vercel Deployment Setup

This guide will help you deploy the Media Garden application to Vercel with Turso database.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. A [Turso account](https://turso.tech/) (free tier available)

## Step 1: Create a Turso Database

1. Install the Turso CLI:
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

2. Login to Turso:
```bash
turso auth login
```

3. Create a new database:
```bash
turso db create media-garden
```

4. Get your database URL:
```bash
turso db show media-garden --url
```

5. Create an authentication token:
```bash
turso db tokens create media-garden
```

Save both the URL and token - you'll need them for Vercel.

## Step 2: Deploy to Vercel

1. Push your code to GitHub

2. Import your repository on Vercel:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your repository
   - Click "Import"

3. Configure Environment Variables:
   - Add `DATABASE_URL` with your Turso database URL (e.g., `libsql://media-garden-[username].turso.io`)
   - Add `TURSO_AUTH_TOKEN` with the token you created

4. Click "Deploy"

## Step 3: Database Initialization

The application will automatically create the required database tables on first run. No manual migration is needed.

When the deployment finishes, visit your app URL. The first API call will initialize the database schema automatically.

## Optional: Add API Keys for Media Search

To enable full media search functionality, add these optional environment variables:

- `TMDB_API_KEY` - For movie and TV show search ([Get key](https://www.themoviedb.org/settings/api))
- `RAWG_API_KEY` - For video game search ([Get key](https://rawg.io/apidocs))

Google Books API doesn't require a key for basic usage.

## Troubleshooting

### Error: "Failed to fetch media items"

This usually means:
1. Environment variables are not set correctly
2. Turso database URL or token is invalid

To fix:
1. Go to your Vercel project settings → Environment Variables
2. Verify `DATABASE_URL` and `TURSO_AUTH_TOKEN` are set correctly
3. Redeploy your application

### Database Connection Errors

If you see database connection errors in Vercel logs:
1. Verify your Turso database is active: `turso db list`
2. Test the token: `turso db tokens validate <your-token>`
3. Regenerate a new token if needed: `turso db tokens create media-garden`

### Empty Collection on First Load

This is normal! Your database is empty initially. Click "Add Media" to start adding items to your collection.

## Local Development

For local development, you can use SQLite:

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. The default configuration uses a local SQLite file:
```env
DATABASE_URL="file:./prisma/dev.db"
```

3. Run the development server:
```bash
npm run dev
```

The database will be automatically initialized on first run.
