import { createClient } from '@libsql/client';

async function migrate() {
  const url = process.env.DATABASE_URL || 'http://127.0.0.1:8080';
  const authToken = process.env.TURSO_AUTH_TOKEN;

  const client = createClient({
    url,
    authToken,
  });

  try {
    console.log('Running migration: Add rating column to MediaItem table');
    console.log('Database URL:', url);

    // Check if column already exists
    const tableInfo = await client.execute({
      sql: 'PRAGMA table_info(MediaItem)',
      args: []
    });

    const hasRating = tableInfo.rows.some((row: any) => row.name === 'rating');

    if (hasRating) {
      console.log('✓ Rating column already exists, skipping migration');
      return;
    }

    // Add the rating column
    await client.execute({
      sql: 'ALTER TABLE MediaItem ADD COLUMN rating INTEGER',
      args: []
    });

    console.log('✓ Migration completed successfully');
    console.log('  - Added rating column to MediaItem table');
  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  } finally {
    client.close();
  }
}

migrate();
