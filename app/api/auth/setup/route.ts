import { NextRequest, NextResponse } from 'next/server';
import { db, initializeDb } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(request: NextRequest) {
  try {
    await initializeDb();

    // First, check if any users already exist
    const checkResult = await db.execute({
      sql: 'SELECT COUNT(*) as count FROM User',
      args: [],
    });

    const count = checkResult.rows[0]?.count as number || 0;

    if (count > 0) {
      return NextResponse.json(
        { error: 'Setup has already been completed. Users already exist.' },
        { status: 403 }
      );
    }

    // Get email and password from request
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Basic validation
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Create the user
    const hashedPassword = await hashPassword(password);
    const id = generateId();
    const now = new Date().toISOString();

    await db.execute({
      sql: `
        INSERT INTO User (id, email, password, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?)
      `,
      args: [id, email, hashedPassword, now, now]
    });

    return NextResponse.json(
      {
        message: 'Admin account created successfully',
        user: {
          id,
          email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Setup error:', error);

    if (error.message?.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
