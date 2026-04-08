const API_KEY = "218f4830";
let allMovies = [];

getMovies("avengers");

async function getMovies(query) {
  const container = document.getElementById("movies");
  container.innerHTML = "Loading...";

  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
  const data = await res.json();

  if (!data.Search) {
    container.innerHTML = "No movies found";
    return;
  }

  allMovies = data.Search;
  displayMovies(allMovies);
}

function displayMovies(movies) {
  const container = document.getElementById("movies");

  container.innerHTML = movies.map(movie => `
    <div class="card" onclick="showDetails('${movie.imdbID}')">
      <h3>${movie.Title}</h3>
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : ''}" />
    </div>
  `).join("");
}

let timeout;
document.getElementById("search").addEventListener("input", (e) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    getMovies(e.target.value || "avengers");
  }, 500);
});

document.getElementById("sort").addEventListener("change", (e) => {
  let sorted = [...allMovies];

  if (e.target.value === "az") {
    sorted.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (e.target.value === "year") {
    sorted.sort((a, b) => b.Year - a.Year);
  }

  displayMovies(sorted);
});

document.getElementById("filter").addEventListener("change", (e) => {
  const filtered = allMovies.filter(movie => movie.Type === e.target.value);
  displayMovies(e.target.value ? filtered : allMovies);
});

async function showDetails(id) {
  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`);
  const data = await res.json();

  const modal = document.getElementById("modal");
  const content = document.getElementById("modalContent");

  content.innerHTML = `
    <h2>${data.Title}</h2>
    <p>${data.Plot}</p>
    <p>⭐ ${data.imdbRating}</p>
    <button onclick="closeModal()">Close</button>
  `;

  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}
