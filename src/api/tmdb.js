// Replace with your TMDB API key (v3 auth)
// Get one free at: https://www.themoviedb.org/settings/api
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY ?? ''
const TMDB_BASE = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

/**
 * Search TMDB for a movie by title.
 * Returns { posterUrl, tmdbId, overview, year } or null.
 */
export async function searchMoviePoster(title) {
  if (!TMDB_API_KEY) return null
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    query: title,
    language: 'zh-TW',
    include_adult: 'false',
  })
  const res = await fetch(`${TMDB_BASE}/search/movie?${params}`)
  if (!res.ok) return null
  const data = await res.json()
  const movie = data.results?.[0]
  if (!movie) return null
  return {
    posterUrl: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : null,
    tmdbId: movie.id,
    overview: movie.overview,
    year: movie.release_date?.slice(0, 4) ?? '',
    originalTitle: movie.original_title,
  }
}
