import { StorageHandler } from './storage.js';
import { fetchMovie, popularMovies, topRatedMovies } from './api.js';

const FAV = "favorites";

// Referencias a los contenedores en el HTML
const favorite = document.getElementById('favorites-movies');
const popularContainer = document.getElementById('popular-movies');
const topContainer = document.getElementById('top-movies');
const modalMovie = document.getElementById('movie-modal');
const modalDetail = document.getElementById('modal-details');

const storage = new StorageHandler(FAV);
let moviesFav = storage.readLocalStorage();

const POSTER_URL = 'https://image.tmdb.org/t/p/w500';

// Escapa texto que viene de la API antes de meterlo en innerHTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text ?? '';
  return div.innerHTML;
}

function posterSrc(movie) {
  return movie.poster_path ? `${POSTER_URL}${movie.poster_path}` : 'https://placehold.co/500x750?text=Sin+imagen';
}

function showError(container, error) {
  console.error(error);
  container.innerHTML = '<p class="text-danger">No se pudieron cargar las películas. Revisa tu API key en javascript/config.js.</p>';
}

// funcion para crear cartas
function createCard(movies, type_container){
  const isFavorite = type_container === favorite;
  const btnClass = isFavorite ? 'delete-btn' : 'fav-btn';
  const btnIcon = isFavorite ? '🤍' : '❤️';
  movies.forEach(movie => {
    const card = document.createElement('div');
    card.classList.add('movie-card');
    card.innerHTML = `
      <img src="${posterSrc(movie)}" alt="${escapeHtml(movie.title)}" loading="lazy"/>
      <button class="${btnClass}">${btnIcon}</button>
      `;
      card.querySelector(`.${btnClass}`).addEventListener('click', () => {
      if (isFavorite) {
        deleteFavorite(movie.id);
      } else {
        addToFavorites(movie);
      }
    });
      card.querySelector('img').addEventListener('click', () => showDetails(movie.id));
    type_container.appendChild(card);
  });
}

// Agregar película a favoritos
function addToFavorites(movie){
  if (!moviesFav.some(item => item.id === movie.id)){
    moviesFav.push(movie);
    storage.writeLocalStorage(moviesFav);
    showfavorites();
  }else{
    alert("La pelicula ya existe en tus favoritos");
  }
}

// Mostrar peliculas favoritas
function showfavorites(){
  favorite.innerHTML = '';
  createCard(moviesFav, favorite);
}

// Eliminar peliculas favoritas
function deleteFavorite(id){
  const index = moviesFav.findIndex(movie => movie.id === id);
  if (index !== -1) {
    moviesFav.splice(index, 1);
    storage.writeLocalStorage(moviesFav);
    showfavorites();
  }
}

// Mostrar detalles de peliculas
function showDetails(idMovie) {
  fetchMovie(idMovie).then(movie => {
    const isFavorite = moviesFav.some(item => item.id === idMovie);
    const btnClass = isFavorite ? 'delete-btn' : 'fav-btn';
    const btnIcon = isFavorite ? '🤍' : '❤️';

    modalDetail.innerHTML = `
      <div class="modal-img">
        <img class="modal-image" src="${posterSrc(movie)}" alt="${escapeHtml(movie.title)}" />
        <button class="${btnClass}">${btnIcon}</button>
      </div>

      <h2 class="modal-title">${escapeHtml(movie.title)}</h2>
      <p class="modal-tagline"><em>${escapeHtml(movie.tagline)}</em></p>
      
      <div class="modal-info">
        <span><strong>Fecha de estreno:</strong> ${escapeHtml(movie.release_date)}</span>
        <span><strong>Duración:</strong> ${movie.runtime} min</span>
        <span><strong>Idioma original:</strong> ${movie.original_language.toUpperCase()}</span>
        <span><strong>Estado:</strong> ${escapeHtml(movie.status)}</span>
        <span><strong>Calificación:</strong> ⭐ ${movie.vote_average.toFixed(1)} / 10</span>
      </div>
      
      <div class="movie-genres">
        ${movie.genres.map(genre => `<span class="genre">${escapeHtml(genre.name)}</span>`).join('')}
      </div>

      <p class="movie-overview">${escapeHtml(movie.overview)}</p>
    `;

    const modalFavBtn = modalDetail.querySelector(`.${btnClass}`);
    modalFavBtn.addEventListener('click', () => {
      if (isFavorite) {
        deleteFavorite(movie.id);
        modalFavBtn.className = 'fav-btn';      
        modalFavBtn.innerHTML = '❤️';
      } else {
        addToFavorites(movie);
        modalFavBtn.className = 'delete-btn';
        modalFavBtn.innerHTML = '🤍';
      }
      
    });
    modalMovie.classList.remove('hidden');
  }).catch(error => console.error(error));
}

modalMovie.addEventListener('click', (event) => {
  if (event.target === modalMovie) {
    modalMovie.classList.add('hidden');
  }
});

// Inicialización
showfavorites();

popularMovies()
  .then(data => createCard(data.results, popularContainer))
  .catch(error => showError(popularContainer, error));
topRatedMovies()
  .then(data => createCard(data.results, topContainer))
  .catch(error => showError(topContainer, error));
