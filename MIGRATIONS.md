# Database Migrations

## Running Migrations

### Local Development

For local development with Turso dev server:

```bash
pnpm run migrate
```

This will connect to your local database at `http://127.0.0.1:8080` and apply the migration.

### Production

For production Turso database:

1. Set your production database credentials:
   ```bash
   export DATABASE_URL="libsql://your-database.turso.io"
   export TURSO_AUTH_TOKEN="your-auth-token"
   ```

2. Run the migration:
   ```bash
   pnpm run migrate
   ```

## Alternative: Using Turso CLI

You can also run migrations directly using the Turso CLI:

### Local
```bash
turso db shell --url http://127.0.0.1:8080 "ALTER TABLE MediaItem ADD COLUMN rating INTEGER"
```

### Production
```bash
turso db shell your-database-name "ALTER TABLE MediaItem ADD COLUMN rating INTEGER"
```

## Current Migrations

### 2025-11-11: Add rating column
- **File**: `scripts/migrate-add-rating.ts`
- **Description**: Adds `rating INTEGER` column to `MediaItem` table
- **Safe to re-run**: Yes (checks if column exists first)
