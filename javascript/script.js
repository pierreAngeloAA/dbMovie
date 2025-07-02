import { StorageHandler } from './storage.js';
import { fetchMovie, pupularMovies, topRatedMovies  } from './api.js';

const FAV = "favorites";

// Referencias a los contenedores en el HTML
const favorite = document.getElementById('favorites-movies');
const popularContainer = document.getElementById('popular-movies');
const topContainer = document.getElementById('top-movies');
const modalMovie = document.getElementById('movie-modal');
const modalDetail = document.getElementById('modal-details');

const storage = new StorageHandler(FAV);
var movies_fav = storage.readLocalStorage();

// funcion para crear cartas
function createCard(movies, type_container){
  const isFavorite = type_container === favorite;
  const btnClass = isFavorite ? 'delete-btn' : 'fav-btn';
  const btnIcon = isFavorite ? '🤍' : '❤️';
  movies.forEach(movie => {
    const card = document.createElement('div');
    card.classList.add('movie-card');
    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"/>
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
  if (!movies_fav.some(item => item.id === movie.id)){
    movies_fav.push(movie);
    storage.writeLocalStorage(movies_fav);
    showfavorites();
  }else{
    alert("La pelicula ya existe en tus favoritos");
  }
}

// Mostrar peliculas favoritas
function showfavorites(){
  favorite.innerHTML = '';
  createCard(movies_fav, favorite);
}

// Eliminar peliculas favoritas
function deleteFavorite(id){
  const index = movies_fav.findIndex(movie => movie.id === id);
  if (index !== -1) {
    movies_fav.splice(index, 1);
    storage.writeLocalStorage(movies_fav);
    showfavorites();
  }
}

// Mostrar detalles de peliculas
function showDetails(idMovie) {
  fetchMovie(idMovie).then(movie => {
    const isFavorite = movies_fav.some(item => item.id === idMovie);
    const btnClass = isFavorite ? 'delete-btn' : 'fav-btn';
    const btnIcon = isFavorite ? '🤍' : '❤️';

    modalDetail.innerHTML = `
      <div class="modal-img">
        <img class="modal-image" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
        <button class="${btnClass}">${btnIcon}</button>
      </div>

      <h2 class="modal-title">${movie.title}</h2>
      <p class="modal-tagline"><em>${movie.tagline || ''}</em></p>
      
      <div class="modal-info">
        <span><strong>Fecha de estreno:</strong> ${movie.release_date}</span>
        <span><strong>Duración:</strong> ${movie.runtime} min</span>
        <span><strong>Idioma original:</strong> ${movie.original_language.toUpperCase()}</span>
        <span><strong>Estado:</strong> ${movie.status}</span>
        <span><strong>Calificación:</strong> ⭐ ${movie.vote_average.toFixed(1)} / 10</span>
      </div>
      
      <div class="movie-genres">
        ${movie.genres.map(genre => `<span class="genre">${genre.name}</span>`).join('')}
      </div>

      <p class="movie-overview">${movie.overview}</p>
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
  });
}

modalMovie.addEventListener('click', (event) => {
  if (event.target === modalMovie) {
    modalMovie.classList.add('hidden');
  }
});

// Inicialización
showfavorites();

pupularMovies().then(data => createCard(data.results, popularContainer));
topRatedMovies().then(data => createCard(data.results, topContainer));
