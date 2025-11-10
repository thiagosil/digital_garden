import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all media items with optional filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const mediaType = searchParams.get('mediaType');

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (mediaType) {
      where.mediaType = mediaType;
    }

    const items = await prisma.mediaItem.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

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
    const body = await request.json();
    const { title, mediaType, coverImage, creator, synopsis, apiId } = body;

    if (!title || !mediaType) {
      return NextResponse.json(
        { error: 'Title and media type are required' },
        { status: 400 }
      );
    }

    const item = await prisma.mediaItem.create({
      data: {
        title,
        mediaType,
        coverImage,
        creator,
        synopsis,
        apiId,
        status: 'BACKLOG',
      },
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
