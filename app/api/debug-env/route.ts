import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasAdminKey: !!process.env.ADMIN_KEY,
    adminKeyLength: process.env.ADMIN_KEY?.length || 0,
    nodeEnv: process.env.NODE_ENV,
  });
}