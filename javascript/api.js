import { TMDB_API_KEY as API_KEY } from './config.js';

const BASE_URL = 'https://api.themoviedb.org/3';

export function pupularMovies() {
  return fetchMovies("popular");
}

export function topRatedMovies() {
  return fetchMovies("top_rated");
}

export function fetchMovie(movieId) {
  return fetchMovies(movieId);
}

function fetchMovies(endpoint) {
  return fetch(`${BASE_URL}/movie/${endpoint}?api_key=${API_KEY}&language=es-ES`).then(res => res.json());
}