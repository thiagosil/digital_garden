import { NextResponse } from 'next/server';
import { db, initializeDb } from '@/lib/db';

export async function GET() {
  try {
    await initializeDb();

    // Check if any users exist
    const result = await db.execute({
      sql: 'SELECT COUNT(*) as count FROM User',
      args: [],
    });

    const count = result.rows[0]?.count as number || 0;

    return NextResponse.json(
      {
        hasUsers: count > 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Setup check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
