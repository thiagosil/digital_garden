import { createClient, Client } from '@libsql/client';

let db: Client | null = null;

export function getDb() {
  if (!db) {
    // Support both local SQLite files and Turso remote databases
    const url = process.env.DATABASE_URL || 'file:./prisma/dev.db';
    const authToken = process.env.TURSO_AUTH_TOKEN;

    db = createClient({
      url,
      authToken,
    });
  }
  return db;
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
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  apiId: string | null;
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
    return result.rows as MediaItem[];
  },

  findUnique: async (id: string): Promise<MediaItem | undefined> => {
    const db = getDb();
    const result = await db.execute({ sql: 'SELECT * FROM MediaItem WHERE id = ?', args: [id] });
    return result.rows[0] as MediaItem | undefined;
  },

  create: async (data: {
    title: string;
    mediaType: string;
    coverImage?: string;
    creator?: string;
    synopsis?: string;
    apiId?: string;
  }): Promise<MediaItem> => {
    const db = getDb();
    const id = generateId();
    const now = new Date().toISOString();

    await db.execute({
      sql: `
        INSERT INTO MediaItem (id, title, mediaType, status, coverImage, creator, synopsis, apiId, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        id,
        data.title,
        data.mediaType,
        'BACKLOG',
        data.coverImage || null,
        data.creator || null,
        data.synopsis || null,
        data.apiId || null,
        now,
        now
      ]
    });

    return (await mediaQueries.findUnique(id))!;
  },

  update: async (id: string, data: {
    status?: string;
    notes?: string;
    completedAt?: string | null;
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

    if (data.completedAt !== undefined) {
      updates.push('completedAt = ?');
      params.push(data.completedAt);
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
