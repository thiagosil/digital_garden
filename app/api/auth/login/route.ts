import { NextRequest, NextResponse } from 'next/server';
import { db, initializeDb } from '@/lib/db';
import { verifyPassword, createSession, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await initializeDb();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db.execute({
      sql: 'SELECT * FROM User WHERE email = ?',
      args: [email],
    });

    if (!user.rows || user.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const userData = user.rows[0];
    const isValidPassword = await verifyPassword(
      password,
      userData.password as string
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session
    const token = await createSession({
      userId: userData.id as string,
      email: userData.email as string,
    });

    await setSessionCookie(token);

    return NextResponse.json(
      {
        user: {
          id: userData.id,
          email: userData.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
