import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tmdbId = searchParams.get('tmdbId');
  const seasonNumber = searchParams.get('seasonNumber');

  if (!tmdbId || !seasonNumber) {
    return NextResponse.json(
      { error: 'Missing TMDB ID or season number' },
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
      `https://api.themoviedb.org/3/tv/${tmdbId}/season/${seasonNumber}`,
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
      throw new Error(`Failed to fetch season episodes: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      seasonNumber: data.season_number,
      name: data.name,
      overview: data.overview,
      airDate: data.air_date,
      episodes: data.episodes?.map((episode: any) => ({
        episodeNumber: episode.episode_number,
        name: episode.name,
        overview: episode.overview,
        airDate: episode.air_date,
        stillPath: episode.still_path ? `https://image.tmdb.org/t/p/w300${episode.still_path}` : null,
        runtime: episode.runtime,
      })) || []
    });
  } catch (error) {
    console.error('Error fetching season episodes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch season episodes' },
      { status: 500 }
    );
  }
}
