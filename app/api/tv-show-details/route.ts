import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tmdbId = searchParams.get('tmdbId');

  if (!tmdbId) {
    return NextResponse.json(
      { error: 'Missing TMDB ID' },
      { status: 400 }
    );
  }

  const accessToken = process.env.TMDB_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'TMDB API not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${tmdbId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`TMDB API error (${response.status}):`, errorBody);
      throw new Error(`Failed to fetch TV show details: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      totalSeasons: data.number_of_seasons || 0,
      seasons: data.seasons?.map((season: any) => ({
        seasonNumber: season.season_number,
        episodeCount: season.episode_count,
        name: season.name,
        airDate: season.air_date,
      })) || []
    });
  } catch (error) {
    console.error('Error fetching TV show details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TV show details' },
      { status: 500 }
    );
  }
}
