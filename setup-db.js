const Database = require('better-sqlite3');
const path = require('path');

// Create database file
const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath);

// Create MediaItem table
db.exec(`
  CREATE TABLE IF NOT EXISTS MediaItem (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    mediaType TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'BACKLOG',
    coverImage TEXT,
    creator TEXT,
    synopsis TEXT,
    notes TEXT,
    completedAt DATETIME,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    apiId TEXT
  );
`);

// Create indexes for better query performance
db.exec(`
  CREATE INDEX IF NOT EXISTS MediaItem_status_idx ON MediaItem(status);
  CREATE INDEX IF NOT EXISTS MediaItem_mediaType_idx ON MediaItem(mediaType);
`);

console.log('✅ Database created successfully at:', dbPath);
console.log('✅ MediaItem table created with indexes');

db.close();
