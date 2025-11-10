import { NextRequest, NextResponse } from 'next/server';
import { mediaQueries, initializeDb } from '@/lib/db';

// GET all media items with optional filtering
export async function GET(request: NextRequest) {
  try {
    // Ensure database is initialized
    await initializeDb();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || undefined;
    const mediaType = searchParams.get('mediaType') || undefined;

    const where: any = {};
    if (status) where.status = status;
    if (mediaType) where.mediaType = mediaType;

    const items = await mediaQueries.findMany(where);

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to fetch media items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media items' },
      { status: 500 }
    );
  }
}

// POST - Create a new media item
export async function POST(request: NextRequest) {
  try {
    // Ensure database is initialized
    await initializeDb();

    const body = await request.json();
    const { title, mediaType, coverImage, creator, synopsis, apiId } = body;

    if (!title || !mediaType) {
      return NextResponse.json(
        { error: 'Title and media type are required' },
        { status: 400 }
      );
    }

    const item = await mediaQueries.create({
      title,
      mediaType,
      coverImage,
      creator,
      synopsis,
      apiId,
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error('Failed to create media item:', error);
    return NextResponse.json(
      { error: 'Failed to create media item' },
      { status: 500 }
    );
  }
}
