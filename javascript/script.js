const API_KEY = 'a193a1e35492fef05a07b98c1844f80c';
const BASE_URL = 'https://api.themoviedb.org/3';

// Referencias a los contenedores en el HTML
const favorite = document.getElementById('favorites-movies');
const popularContainer = document.getElementById('popular-movies');
const topContainer = document.getElementById('top-movies');

// Objeto localStorage
var movies_fav = JSON.parse(localStorage.getItem("favorites")) || [];

// Obtener películas desde la API
function fetchMovies(endpoint, type_container) {
  fetch(`${BASE_URL}/movie/${endpoint}?api_key=${API_KEY}&language=es-ES`)
    .then(res => res.json())
    .then(data => {
      data.results.forEach(movie => {
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"/>
          <button class="fav-btn">❤️</button>
          `;
          card.querySelector('.fav-btn').addEventListener('click', () => addToFavorites(movie));
        type_container.appendChild(card);
      });
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
function showfavorites(){
  favorite.innerHTML = '';
  movies_fav.forEach(movie =>{
      const card = document.createElement('div');
      card.classList.add('movie-card');
      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"/>
        <button class="delete-btn">🤍</button>
        `;
        card.querySelector('.delete-btn').addEventListener('click', () => deleteFavorite(movie.id));
      favorite.appendChild(card);
  })
}

//eliminar peliculas favoritas
function deleteFavorite(id){
  const index = movies_fav.findIndex(movie => movie.id === id);
  if (index !== -1) {
    movies_fav.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(movies_fav));
    showfavorites();
  }
}

showfavorites()
fetchMovies('popular', popularContainer);
fetchMovies('top_rated', topContainer);