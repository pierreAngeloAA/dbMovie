const API_KEY = 'a193a1e35492fef05a07b98c1844f80c';
const BASE_URL = 'https://api.themoviedb.org/3';

// se apunta hacia los div donde se intrudira la informacion.
const favorite = document.getElementById('favorites-movies')
const popularContainer = document.getElementById('popular-movies');
const topContainer = document.getElementById('top-movies');

//funcion que se reutilizara con los tres tipos de contenedores.
function fetchMovies(endpoint, type_container) {
  //`https://api.themoviedb.org/3/movie/popular?api_key=a193a1e35492fef05a07b98c1844f80c&language=en-ES`
  fetch(`${BASE_URL}/movie/${endpoint}?api_key=${API_KEY}&language=es-ES`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      data.results.forEach(movie => {
        const card = document.createElement('div'); // se crea un div por cada elemento del resultado de la consulta a la Api.
        card.classList.add('movie-card'); //para agregar un clase a los div creados anteriormente.
        card.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"/>
          `; //se le agregala imagen de cada elemento, concatenando el path de cada imagen a la base_url de las imagenes.
              // se tiene en cuenta el w500 que en este caso es el tamaño de la imagen en un rango de 200-500 px.
        type_container.appendChild(card);
      });
    });
}

fetchMovies('popular', popularContainer);
fetchMovies('top_rated', topContainer);