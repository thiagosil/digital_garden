import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth';
import { getDb, initializeDb } from '@/lib/db';

const PUBLIC_PATHS = ['/login', '/api/auth/login'];
const SETUP_PATHS = ['/setup', '/api/auth/setup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow setup-related paths
  if (SETUP_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if users exist in the database (onboarding check)
  try {
    await initializeDb();
    const db = getDb();
    const result = await db.execute({
      sql: 'SELECT COUNT(*) as count FROM User',
      args: [],
    });

    const count = result.rows[0]?.count as number || 0;

    // If no users exist, redirect to setup page
    if (count === 0) {
      const setupUrl = new URL('/setup', request.url);
      return NextResponse.redirect(setupUrl);
    }
  } catch (error) {
    console.error('Error checking user count:', error);
    // Continue to auth check if database check fails
  }

  // Allow public paths (after user check)
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for session
  const token = request.cookies.get('session')?.value;

  if (!token) {
    // Redirect to login page
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify the session
  const session = await verifySession(token);

  if (!session) {
    // Invalid session, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
