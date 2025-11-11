import { createClient, Client } from '@libsql/client';

let dbClient: Client | null = null;
let dbInitialized = false;

export function getDb() {
  if (!dbClient) {
    // Support both local Turso dev server and remote Turso databases
    const url = process.env.DATABASE_URL || 'http://127.0.0.1:8080';
    const authToken = process.env.TURSO_AUTH_TOKEN;

    dbClient = createClient({
      url,
      authToken,
    });
  }
  return dbClient;
}

// Export db for direct use in other files
export const db = getDb();

// Initialize database schema if it doesn't exist
export async function initializeDb() {
  if (dbInitialized) return;

  const db = getDb();

  try {
    // Create User table if it doesn't exist
    await db.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS User (
          id TEXT PRIMARY KEY NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        )
      `,
      args: []
    });

    // Create MediaItem table if it doesn't exist
    await db.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS MediaItem (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          mediaType TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'BACKLOG',
          coverImage TEXT,
          creator TEXT,
          synopsis TEXT,
          notes TEXT,
          rating INTEGER,
          completedAt TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          apiId TEXT,
          currentSeason INTEGER,
          currentEpisode INTEGER,
          totalSeasons INTEGER,
          episodesInSeason INTEGER
        )
      `,
      args: []
    });

    // Add TV show progress columns if they don't exist (migration)
    try {
      await db.execute({
        sql: `ALTER TABLE MediaItem ADD COLUMN currentSeason INTEGER`,
        args: []
      });
      await db.execute({
        sql: `ALTER TABLE MediaItem ADD COLUMN currentEpisode INTEGER`,
        args: []
      });
      await db.execute({
        sql: `ALTER TABLE MediaItem ADD COLUMN totalSeasons INTEGER`,
        args: []
      });
      await db.execute({
        sql: `ALTER TABLE MediaItem ADD COLUMN episodesInSeason INTEGER`,
        args: []
      });
      console.log('TV show progress columns added successfully');
    } catch (error) {
      // Columns might already exist, ignore error
      console.log('TV show progress columns already exist or migration skipped');
    }

    dbInitialized = true;
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

export interface MediaItem {
  id: string;
  title: string;
  mediaType: 'BOOK' | 'MOVIE' | 'TV_SHOW' | 'VIDEO_GAME';
  status: 'BACKLOG' | 'IN_PROGRESS' | 'COMPLETED';
  coverImage: string | null;
  creator: string | null;
  synopsis: string | null;
  notes: string | null;
  rating: number | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  apiId: string | null;
  // TV Show progress tracking
  currentSeason: number | null;
  currentEpisode: number | null;
  totalSeasons: number | null;
  episodesInSeason: number | null;
}

function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const mediaQueries = {
  findMany: async (where?: { status?: string; mediaType?: string }): Promise<MediaItem[]> => {
    const db = getDb();
    let query = 'SELECT * FROM MediaItem WHERE 1=1';
    const params: any[] = [];

    if (where?.status) {
      query += ' AND status = ?';
      params.push(where.status);
    }

    if (where?.mediaType) {
      query += ' AND mediaType = ?';
      params.push(where.mediaType);
    }

    query += ' ORDER BY createdAt DESC';

    const result = await db.execute({ sql: query, args: params });
    return result.rows as unknown as MediaItem[];
  },

  findUnique: async (id: string): Promise<MediaItem | undefined> => {
    const db = getDb();
    const result = await db.execute({ sql: 'SELECT * FROM MediaItem WHERE id = ?', args: [id] });
    return result.rows[0] as unknown as MediaItem | undefined;
  },

  create: async (data: {
    title: string;
    mediaType: string;
    status?: string;
    rating?: number | null;
    coverImage?: string;
    creator?: string;
    synopsis?: string;
    apiId?: string;
    currentSeason?: number | null;
    currentEpisode?: number | null;
    totalSeasons?: number | null;
    episodesInSeason?: number | null;
  }): Promise<MediaItem> => {
    const db = getDb();
    const id = generateId();
    const now = new Date().toISOString();

    await db.execute({
      sql: `
        INSERT INTO MediaItem (id, title, mediaType, status, rating, coverImage, creator, synopsis, apiId, currentSeason, currentEpisode, totalSeasons, episodesInSeason, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        id,
        data.title,
        data.mediaType,
        data.status || 'BACKLOG',
        data.rating || null,
        data.coverImage || null,
        data.creator || null,
        data.synopsis || null,
        data.apiId || null,
        data.currentSeason || null,
        data.currentEpisode || null,
        data.totalSeasons || null,
        data.episodesInSeason || null,
        now,
        now
      ]
    });

    return (await mediaQueries.findUnique(id))!;
  },

  update: async (id: string, data: {
    status?: string;
    notes?: string;
    rating?: number | null;
    completedAt?: string | null;
    currentSeason?: number | null;
    currentEpisode?: number | null;
    totalSeasons?: number | null;
    episodesInSeason?: number | null;
  }): Promise<MediaItem> => {
    const db = getDb();
    const now = new Date().toISOString();

    const updates: string[] = ['updatedAt = ?'];
    const params: any[] = [now];

    if (data.status !== undefined) {
      updates.push('status = ?');
      params.push(data.status);

      // Auto-set completedAt when status changes to COMPLETED
      if (data.status === 'COMPLETED' && data.completedAt === undefined) {
        updates.push('completedAt = ?');
        params.push(now);
      } else if (data.status !== 'COMPLETED') {
        updates.push('completedAt = ?');
        params.push(null);
      }
    }

    if (data.notes !== undefined) {
      updates.push('notes = ?');
      params.push(data.notes);
    }

    if (data.rating !== undefined) {
      updates.push('rating = ?');
      params.push(data.rating);
    }

    if (data.completedAt !== undefined) {
      updates.push('completedAt = ?');
      params.push(data.completedAt);
    }

    if (data.currentSeason !== undefined) {
      updates.push('currentSeason = ?');
      params.push(data.currentSeason);
    }

    if (data.currentEpisode !== undefined) {
      updates.push('currentEpisode = ?');
      params.push(data.currentEpisode);
    }

    if (data.totalSeasons !== undefined) {
      updates.push('totalSeasons = ?');
      params.push(data.totalSeasons);
    }

    if (data.episodesInSeason !== undefined) {
      updates.push('episodesInSeason = ?');
      params.push(data.episodesInSeason);
    }

    params.push(id);

    await db.execute({
      sql: `
        UPDATE MediaItem
        SET ${updates.join(', ')}
        WHERE id = ?
      `,
      args: params
    });

    return (await mediaQueries.findUnique(id))!;
  },

  delete: async (id: string): Promise<void> => {
    const db = getDb();
    await db.execute({ sql: 'DELETE FROM MediaItem WHERE id = ?', args: [id] });
  },
};
