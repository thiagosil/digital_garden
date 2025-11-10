import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function getDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
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
  findMany: (where?: { status?: string; mediaType?: string }): MediaItem[] => {
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

    return db.prepare(query).all(...params) as MediaItem[];
  },

  findUnique: (id: string): MediaItem | undefined => {
    const db = getDb();
    return db.prepare('SELECT * FROM MediaItem WHERE id = ?').get(id) as MediaItem | undefined;
  },

  create: (data: {
    title: string;
    mediaType: string;
    coverImage?: string;
    creator?: string;
    synopsis?: string;
    apiId?: string;
  }): MediaItem => {
    const db = getDb();
    const id = generateId();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO MediaItem (id, title, mediaType, status, coverImage, creator, synopsis, apiId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
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
    );

    return mediaQueries.findUnique(id)!;
  },

  update: (id: string, data: {
    status?: string;
    notes?: string;
    completedAt?: string | null;
  }): MediaItem => {
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

    const stmt = db.prepare(`
      UPDATE MediaItem
      SET ${updates.join(', ')}
      WHERE id = ?
    `);

    stmt.run(...params);

    return mediaQueries.findUnique(id)!;
  },

  delete: (id: string): void => {
    const db = getDb();
    db.prepare('DELETE FROM MediaItem WHERE id = ?').run(id);
  },
};
