const API_KEY = 'a193a1e35492fef05a07b98c1844f80c';
const BASE_URL = 'https://api.themoviedb.org/3';

export function fetchMovies(endpoint) {
  return fetch(`${BASE_URL}/movie/${endpoint}?api_key=${API_KEY}&language=es-ES`).then(res => res.json());
}