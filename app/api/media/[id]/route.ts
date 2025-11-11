import { NextRequest, NextResponse } from 'next/server';
import { mediaQueries, initializeDb } from '@/lib/db';

// GET single media item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Ensure database is initialized
    await initializeDb();

    const { id } = await params;
    const item = await mediaQueries.findUnique(id);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Ensure database is initialized
    await initializeDb();

    const { id } = await params;
    const body = await request.json();
    const { status, notes, rating, completedAt, currentSeason, currentEpisode, totalSeasons, episodesInSeason } = body;

    const updateData: any = {};

    if (status !== undefined) {
      updateData.status = status;

      // Auto-set completedAt when status changes to COMPLETED
      if (status === 'COMPLETED' && completedAt === undefined) {
        // Get current item to check if completedAt is already set
        const currentItem = await mediaQueries.findUnique(id);
        if (!currentItem?.completedAt) {
          updateData.completedAt = new Date().toISOString();
        }
      }

      // Clear completedAt when status changes away from COMPLETED
      if (status !== 'COMPLETED' && completedAt === undefined) {
        updateData.completedAt = null;
      }
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (rating !== undefined) {
      updateData.rating = rating;
    }

    if (completedAt !== undefined) {
      updateData.completedAt = completedAt;
    }

    if (currentSeason !== undefined) {
      updateData.currentSeason = currentSeason;
    }

    if (currentEpisode !== undefined) {
      updateData.currentEpisode = currentEpisode;
    }

    if (totalSeasons !== undefined) {
      updateData.totalSeasons = totalSeasons;
    }

    if (episodesInSeason !== undefined) {
      updateData.episodesInSeason = episodesInSeason;
    }

    const item = await mediaQueries.update(id, updateData);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Ensure database is initialized
    await initializeDb();

    const { id } = await params;
    await mediaQueries.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete media item:', error);
    return NextResponse.json(
      { error: 'Failed to delete media item' },
      { status: 500 }
    );
  }
}
