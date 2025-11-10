import { NextRequest, NextResponse } from 'next/server';
import { mediaQueries } from '@/lib/db';

// GET single media item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await mediaQueries.findUnique(params.id);

    if (!item) {
      return NextResponse.json(
        { error: 'Media item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Failed to fetch media item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media item' },
      { status: 500 }
    );
  }
}

// PATCH - Update a media item
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, notes, completedAt } = body;

    const updateData: any = {};

    if (status !== undefined) {
      updateData.status = status;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (completedAt !== undefined) {
      updateData.completedAt = completedAt;
    }

    const item = await mediaQueries.update(params.id, updateData);

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Failed to update media item:', error);
    return NextResponse.json(
      { error: 'Failed to update media item' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a media item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await mediaQueries.delete(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete media item:', error);
    return NextResponse.json(
      { error: 'Failed to delete media item' },
      { status: 500 }
    );
  }
}
