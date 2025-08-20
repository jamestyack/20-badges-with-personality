import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();
    
    console.log('Auth attempt:', { 
      keyReceived: key, 
      expectedKey: process.env.ADMIN_KEY,
      match: key === process.env.ADMIN_KEY 
    });
    
    const success = await setAuthCookie(key);
    
    if (success) {
      console.log('Auth successful, cookie set');
      return NextResponse.json({ success: true });
    } else {
      console.log('Auth failed');
      return NextResponse.json({ error: 'Invalid key' }, { status: 401 });
    }
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}