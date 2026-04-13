const API_KEY = "f833faaba54d6eb393c19ecb9d80d465";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

let currentMovies = [];

async function fetchMovies(query) {
  const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
  const data = await res.json();
  return data.results || [];
}

function createCard(movie) {
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <img src="${movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/200x300'}" />
  `;

  div.onclick = () => showDetails(movie.id);

  return div;
}


async function loadTrending() {
  const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
  const data = await res.json();

  currentMovies = data.results;

  const container = document.getElementById("trending");
  container.innerHTML = "";

  data.results.forEach(m => container.appendChild(createCard(m)));
}


async function loadRecommended() {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  const data = await res.json();

  const container = document.getElementById("recommended");
  container.innerHTML = "";

  data.results.forEach(m => container.appendChild(createCard(m)));
}


async function showDetails(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=external_ids`);
  const data = await res.json();

  const videoRes = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`);
  const videoData = await videoRes.json();

  const trailer = videoData.results.find(v => v.type === "Trailer" && v.site === "YouTube");
  const imdbId = data.imdb_id;

  const modal = document.getElementById("modal");
  const content = document.getElementById("modalContent");

  content.innerHTML = `
    <h2>${data.title}</h2>
    <p>${data.overview}</p>
    <p>⭐ ${data.vote_average}</p>

    ${trailer ? `
      <iframe width="100%" height="250"
        src="https://www.youtube.com/embed/${trailer.key}">
      </iframe>` : "<p>No trailer available</p>"}

    ${imdbId ? `
      <a href="https://www.imdb.com/title/${imdbId}" target="_blank">
        <button>Learn More</button>
      </a>
    ` : ""}

    <button onclick="closeModal()">Close</button>
  `;

  modal.style.display = "flex";
}


function closeModal() {
  document.getElementById("modal").style.display = "none";
}


async function loadGenres() {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  const data = await res.json();

  const select = document.getElementById("genreFilter");

  data.genres.forEach(g => {
    const option = document.createElement("option");
    option.value = g.id;
    option.textContent = g.name;
    select.appendChild(option);
  });
}


document.getElementById("genreFilter").addEventListener("change", (e) => {
  const genreId = parseInt(e.target.value);

  const filtered = currentMovies.filter(m =>
    m.genre_ids.includes(genreId)
  );

  const container = document.getElementById("trending");
  container.innerHTML = "";

  (genreId ? filtered : currentMovies)
    .forEach(m => container.appendChild(createCard(m)));
});


let timeout;
document.getElementById("search").addEventListener("input", (e) => {
  clearTimeout(timeout);

  timeout = setTimeout(async () => {
    const movies = await fetchMovies(e.target.value || "popular");

    const container = document.getElementById("trending");
    container.innerHTML = "";

    movies.forEach(m => container.appendChild(createCard(m)));
  }, 400);
});


document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("light");
};


loadTrending();
loadRecommended();
loadGenres();
