import { NextResponse } from 'next/server';
import { deleteAward } from '@/lib/db';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const awardId = searchParams.get('id');
    
    if (!awardId) {
      return NextResponse.json(
        { error: 'Award ID is required' },
        { status: 400 }
      );
    }
    
    const success = await deleteAward(awardId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete award' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete award error:', error);
    return NextResponse.json(
      { error: 'Failed to delete award' },
      { status: 500 }
    );
  }
}