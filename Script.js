const API_KEY = "218f4830";

async function getMovies() {
  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=avengers`);
  const data = await res.json();

  const container = document.getElementById("movies");

  if (!data.Search) {
    container.innerHTML = "No movies found";
    return;
  }

  container.innerHTML = data.Search.map(movie => `
    <div>
      <h3>${movie.Title}</h3>
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : ''}" />
    </div>
  `).join("");
}

getMovies();