import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_KEY = process.env.ADMIN_KEY;
const AUTH_COOKIE = 'admin_auth';

export function isAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const authCookie = request.cookies.get(AUTH_COOKIE);
  
  if (authHeader === `Bearer ${ADMIN_KEY}`) {
    return true;
  }
  
  if (authCookie?.value === ADMIN_KEY) {
    return true;
  }
  
  return false;
}

export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE);
  return authCookie?.value === ADMIN_KEY;
}

export async function setAuthCookie(key: string): Promise<boolean> {
  if (key !== ADMIN_KEY) {
    return false;
  }
  
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, key, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
  
  return true;
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  );
}