import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const mediaType = searchParams.get('type');

  if (!query || !mediaType) {
    return NextResponse.json(
      { error: 'Missing query or media type' },
      { status: 400 }
    );
  }

  try {
    let results;

    switch (mediaType) {
      case 'BOOK':
        results = await searchBooks(query);
        break;
      case 'MOVIE':
        results = await searchMovies(query);
        break;
      case 'TV_SHOW':
        results = await searchTVShows(query);
        break;
      case 'VIDEO_GAME':
        results = await searchVideoGames(query);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid media type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    );
  }
}

// Google Books API
async function searchBooks(query: string) {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=40`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }

  const data = await response.json();

  const books = data.items?.map((item: any) => ({
    apiId: item.id,
    title: item.volumeInfo.title,
    creator: item.volumeInfo.authors?.join(', ') || 'Unknown Author',
    coverImage: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
    synopsis: item.volumeInfo.description || null,
    ratingsCount: item.volumeInfo.ratingsCount || 0,
  })) || [];

  // Sort by ratingsCount (descending) and return top 10
  return books
    .sort((a, b) => b.ratingsCount - a.ratingsCount)
    .slice(0, 10)
    .map(({ ratingsCount, ...book }) => book); // Remove ratingsCount from final result
}

// TMDB API
async function searchMovies(query: string) {
  const accessToken = process.env.TMDB_ACCESS_TOKEN;

  if (!accessToken) {
    console.warn('TMDB_ACCESS_TOKEN not set, returning empty results');
    return [];
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`,
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
      throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const movies = data.results?.map((item: any) => ({
      apiId: item.id.toString(),
      title: item.title,
      creator: item.release_date ? new Date(item.release_date).getFullYear().toString() : 'Unknown Year',
      coverImage: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : null,
      synopsis: item.overview || null,
      popularity: item.popularity || 0,
    })) || [];

    // Sort by popularity (descending)
    return movies
      .sort((a, b) => b.popularity - a.popularity)
      .map(({ popularity, ...movie }) => movie); // Remove popularity from final result
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
}

async function searchTVShows(query: string) {
  const accessToken = process.env.TMDB_ACCESS_TOKEN;

  if (!accessToken) {
    console.warn('TMDB_ACCESS_TOKEN not set, returning empty results');
    return [];
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}`,
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
      throw new Error(`Failed to fetch TV shows: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const tvShows = data.results?.map((item: any) => ({
      apiId: item.id.toString(),
      title: item.name,
      creator: item.first_air_date ? new Date(item.first_air_date).getFullYear().toString() : 'Unknown Year',
      coverImage: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : null,
      synopsis: item.overview || null,
      popularity: item.popularity || 0,
    })) || [];

    // Sort by popularity (descending)
    return tvShows
      .sort((a, b) => b.popularity - a.popularity)
      .map(({ popularity, ...show }) => show); // Remove popularity from final result
  } catch (error) {
    console.error('Error searching TV shows:', error);
    throw error;
  }
}

// RAWG API
async function searchVideoGames(query: string) {
  const apiKey = process.env.RAWG_API_KEY;

  if (!apiKey) {
    console.warn('RAWG_API_KEY not set, returning empty results');
    return [];
  }

  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}&page_size=10&ordering=-ratings_count`
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`RAWG API error (${response.status}):`, errorBody);
      throw new Error(`Failed to fetch video games: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return data.results?.map((item: any) => ({
      apiId: item.id.toString(),
      title: item.name,
      creator: item.released ? new Date(item.released).getFullYear().toString() : 'Unknown Year',
      coverImage: item.background_image || null,
      synopsis: item.description_raw || null,
    })) || [];
  } catch (error) {
    console.error('Error searching video games:', error);
    throw error;
  }
}
