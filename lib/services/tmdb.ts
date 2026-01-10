// TMDB API Service

const TMDB_API_KEY = process.env.TMDB_API_KEY!;
const BASE_URL = 'https://api.themoviedb.org/3';

// Helper to wait between requests
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
}

interface TMDBSeries {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  genre_ids: number[];
  vote_average: number;
}

interface TMDBResponse<T> {
  page: number;
  total_pages: number;
  total_results: number;
  results: T[];
}

// Fetch with error handling
async function tmdbFetch<T>(endpoint: string): Promise<T> {
  const url = endpoint.includes('?')
    ? `${BASE_URL}${endpoint}&api_key=${TMDB_API_KEY}`
    : `${BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Discover children's movies with pagination - Focus on Western/Danish content
export async function discoverKidsMovies(maxPages = 5): Promise<TMDBMovie[]> {
  const results: TMDBMovie[] = [];

  // Exclude Asian origin countries to focus on Western/Danish audience
  const excludeCountries = 'JP|KR|CN|TW|HK|TH|IN'; // Japan, Korea, China, Taiwan, Hong Kong, Thailand, India

  // Exclude adult genres: Romance(10749), Thriller(53), Horror(27), Crime(80)
  const excludeGenres = '10749,53,27,80';

  for (let page = 1; page <= maxPages; page++) {
    const data = await tmdbFetch<TMDBResponse<TMDBMovie>>(
      `/discover/movie?language=da-DK&watch_region=DK&with_genres=16|10751&without_genres=${excludeGenres}&certification_country=DK&certification.lte=A&without_origin_country=${excludeCountries}&with_original_language=da|en|sv|no|de|fr|es|it&sort_by=popularity.desc&page=${page}`
    );

    results.push(...data.results);

    if (page >= data.total_pages) break;
    await sleep(250);
  }

  return results;
}

// Discover children's series with pagination - Focus on Western/Danish content
export async function discoverKidsSeries(maxPages = 5): Promise<TMDBSeries[]> {
  const results: TMDBSeries[] = [];

  // Exclude Asian origin countries to focus on Western/Danish audience
  const excludeCountries = 'JP|KR|CN|TW|HK|TH|IN';

  // Exclude adult genres: Romance(10749), Drama(18), Crime(80), Thriller(53), Mystery(9648), Horror(27), Comedy(35)
  // Comedy is excluded because Family+Comedy often includes adult sitcoms like Frasier
  const excludeGenres = '10749,18,80,53,9648,27,35';

  for (let page = 1; page <= maxPages; page++) {
    const data = await tmdbFetch<TMDBResponse<TMDBSeries>>(
      `/discover/tv?language=da-DK&watch_region=DK&with_genres=16|10762&without_genres=${excludeGenres}&without_origin_country=${excludeCountries}&with_original_language=da|en|sv|no|de|fr|es|it&vote_count.gte=3&sort_by=popularity.desc&page=${page}`
    );

    results.push(...data.results);

    if (page >= data.total_pages) break;
    await sleep(250);
  }

  return results;
}

// Discover series from DR Ramasjang network
export async function discoverDRRamasjangSeries(): Promise<TMDBSeries[]> {
  const data = await tmdbFetch<TMDBResponse<TMDBSeries>>(
    `/discover/tv?with_networks=3279&language=da-DK`
  );
  return data.results;
}

interface ProviderInfo {
  flatrate?: Array<{
    provider_id: number;
    provider_name: string;
  }>;
}

// Get streaming providers for a movie
export async function getMovieProviders(tmdbId: number): Promise<ProviderInfo | null> {
  const data = await tmdbFetch<{ results: Record<string, ProviderInfo> }>(
    `/movie/${tmdbId}/watch/providers`
  );
  return data.results?.DK || null;
}

// Get streaming providers for a TV series
export async function getTVProviders(tmdbId: number): Promise<ProviderInfo | null> {
  const data = await tmdbFetch<{ results: Record<string, ProviderInfo> }>(
    `/tv/${tmdbId}/watch/providers`
  );
  return data.results?.DK || null;
}

// Get movie details
export async function getMovieDetails(tmdbId: number): Promise<TMDBMovie> {
  return tmdbFetch<TMDBMovie>(`/movie/${tmdbId}?language=da-DK`);
}

// Get TV series details
export async function getTVDetails(tmdbId: number): Promise<TMDBSeries> {
  return tmdbFetch<TMDBSeries>(`/tv/${tmdbId}?language=da-DK`);
}

// Get available translations/languages for a movie
export async function getMovieLanguages(tmdbId: number): Promise<{
  hasDanishAudio: boolean;
  hasDanishSubtitles: boolean;
  availableLanguages: string[];
}> {
  try {
    const data = await tmdbFetch<{ translations: Array<{ iso_639_1: string; name: string; data: { title: string } }> }>(
      `/movie/${tmdbId}/translations`
    );

    const languages = data.translations.map(t => t.iso_639_1);
    const hasDanish = languages.includes('da');
    const uniqueLanguages = Array.from(new Set(languages));

    return {
      hasDanishAudio: hasDanish,
      hasDanishSubtitles: hasDanish,
      availableLanguages: uniqueLanguages,
    };
  } catch {
    return { hasDanishAudio: false, hasDanishSubtitles: false, availableLanguages: [] };
  }
}

// Get available translations/languages for a TV series
export async function getTVLanguages(tmdbId: number): Promise<{
  hasDanishAudio: boolean;
  hasDanishSubtitles: boolean;
  availableLanguages: string[];
}> {
  try {
    const data = await tmdbFetch<{ translations: Array<{ iso_639_1: string; name: string; data: { name: string } }> }>(
      `/tv/${tmdbId}/translations`
    );

    const languages = data.translations.map(t => t.iso_639_1);
    const hasDanish = languages.includes('da');
    const uniqueLanguages = Array.from(new Set(languages));

    return {
      hasDanishAudio: hasDanish,
      hasDanishSubtitles: hasDanish,
      availableLanguages: uniqueLanguages,
    };
  } catch {
    return { hasDanishAudio: false, hasDanishSubtitles: false, availableLanguages: [] };
  }
}

// Get content ratings for a TV series
export async function getTVContentRatings(tmdbId: number) {
  try {
    const data = await tmdbFetch<{ results: Array<{ iso_3166_1: string; rating: string }> }>(
      `/tv/${tmdbId}/content_ratings`
    );
    return data.results;
  } catch {
    return [];
  }
}

// Convert content rating to age range
export function ratingToAgeRange(ratings: Array<{ iso_3166_1: string; rating: string }> | null): { min: number; max: number } {
  if (!ratings || ratings.length === 0) {
    return { min: 3, max: 10 }; // Default for children's TV
  }

  // Prioritize Danish/European ratings, then US
  const dk = ratings.find(r => r.iso_3166_1 === 'DK');
  const de = ratings.find(r => r.iso_3166_1 === 'DE');
  const us = ratings.find(r => r.iso_3166_1 === 'US');

  const rating = dk?.rating || de?.rating || us?.rating || '';

  // Mapping based on known rating systems
  const ratingMap: Record<string, { min: number; max: number }> = {
    // US TV Ratings
    'TV-Y': { min: 0, max: 6 },        // All children
    'TV-Y7': { min: 5, max: 10 },      // Directed to older children
    'TV-Y7-FV': { min: 6, max: 10 },   // Fantasy violence
    'TV-G': { min: 4, max: 12 },       // General audience
    'TV-PG': { min: 7, max: 12 },      // Parental guidance suggested

    // German ratings (FSK)
    '0': { min: 0, max: 6 },
    '6': { min: 4, max: 10 },
    '12': { min: 8, max: 12 },

    // Danish ratings
    'A': { min: 0, max: 12 },  // Tilladt for alle (allowed for all)
    '7': { min: 5, max: 10 },
    '11': { min: 8, max: 12 },
  };

  return ratingMap[rating] || { min: 3, max: 10 }; // Default fallback
}

// Convert TMDB poster path to full URL
export function getTMDBImageUrl(
  path: string | null,
  size = 'w500'
): string | null {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
