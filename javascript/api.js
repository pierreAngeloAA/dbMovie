import { TMDB_API_KEY as API_KEY } from './config.js';

const BASE_URL = 'https://api.themoviedb.org/3';

export function popularMovies() {
  return fetchMovies("popular");
}

export function topRatedMovies() {
  return fetchMovies("top_rated");
}

export function fetchMovie(movieId) {
  return fetchMovies(movieId);
}

async function fetchMovies(endpoint) {
  const res = await fetch(`${BASE_URL}/movie/${endpoint}?api_key=${API_KEY}&language=es-ES`);
  if (!res.ok) {
    throw new Error(`TMDB respondió ${res.status} en /movie/${endpoint}`);
  }
  return res.json();
}
