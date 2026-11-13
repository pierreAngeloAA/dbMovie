# 🍿 POPCORN (dbMovie)

Catálogo de películas en JavaScript puro que consume la API de [TMDB](https://www.themoviedb.org/):
películas populares, mejor valoradas, ficha de detalle en un modal y lista de favoritos guardada en `localStorage`.

## Tecnologías

- HTML, CSS y JavaScript (módulos ES), sin build ni dependencias
- Bootstrap 5 desde CDN
- API REST de TMDB v3

## Cómo ejecutarlo

1. Consigue una API key gratis en <https://www.themoviedb.org/settings/api>.
2. Crea tu archivo de configuración:
   ```bash
   cp javascript/config.example.js javascript/config.js
   ```
   y pon tu key en `TMDB_API_KEY`. `config.js` está en `.gitignore`.
3. Sírvelo con cualquier servidor estático. Los módulos ES no cargan si abres el archivo con `file://`:
   ```bash
   npx serve .        # o: python3 -m http.server 8000
   ```

## Estructura

```
index.html
javascript/
  api.js        llamadas a TMDB
  storage.js    lectura y escritura de favoritos en localStorage
  script.js     render de tarjetas, modal y favoritos
  config.js     tu API key (no se versiona)
styles/styles.css
```

> Existe una versión más completa en React: [react-db-movie](https://github.com/pierreAngeloAA/react-db-movie).
