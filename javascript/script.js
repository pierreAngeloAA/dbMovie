const API_KEY = 'a193a1e35492fef05a07b98c1844f80c';
const BASE_URL = 'https://api.themoviedb.org/3';

// Referencias a los contenedores en el HTML
const favorite = document.getElementById('favorites-movies');
const popularContainer = document.getElementById('popular-movies');
const topContainer = document.getElementById('top-movies');
const modal = document.getElementById('movie-modal');
const modalContent = document.getElementById('modal-details');

// Objeto localStorage
var movies_fav = JSON.parse(localStorage.getItem("favorites")) || [];

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

// Obtener películas desde la API
function fetchMovies(endpoint, type_container) {
  fetch(`${BASE_URL}/movie/${endpoint}?api_key=${API_KEY}&language=es-ES`)
    .then(res => res.json())
    .then(data => {
      createCard(data.results, type_container);
    });
}

// Agregar película a favoritos
function addToFavorites(movie){
  if (!movies_fav.some(item => item.id === movie.id)){
    movies_fav.push(movie);
    localStorage.setItem("favorites", JSON.stringify(movies_fav));
    showfavorites();
  }else{
    alert("La pelicula ya existe en tus favoritos");
  }
}

//mostrar peliculas favoritas
function showfavorites(movies,type_container){
  favorite.innerHTML = '';
  createCard(movies_fav, favorite);
}

//eliminar peliculas favoritas
function deleteFavorite(id){
  const index = movies_fav.findIndex(movie => movie.id === id);
  if (index !== -1) {
    movies_fav.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(movies_fav));
    showfavorites(movies_fav, favorite);
  }
}

// mostrar detalles de peliculas
function showDetails(idMovie) {
   fetch(`${BASE_URL}/movie/${idMovie}?api_key=${API_KEY}&language=es-ES`)
    .then(res => res.json())
    .then(movie => {
      modalContent.innerHTML = `
          <h2 class="modal-title">${movie.title}</h2>
          <img class="modal-image" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
          <p class="movie-overview">${movie.overview}</p>
          <div class="movie-genres">
            ${movie.genres.map(genre => `<span class="genre">${genre.name}</span>`).join('')}
          </div>
      `;
      modal.classList.remove('hidden');
    });
}

modal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

showfavorites(movies_fav, favorite);
fetchMovies('popular', popularContainer);
fetchMovies('top_rated', topContainer);