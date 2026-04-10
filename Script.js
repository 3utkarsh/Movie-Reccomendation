const API_KEY = "f833faaba54d6eb393c19ecb9d80d465";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
let recent = JSON.parse(localStorage.getItem("recent")) || [];

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

  const container = document.getElementById("trending");
  container.innerHTML = "";

  data.results.forEach(m => container.appendChild(createCard(m)));
}

async function loadRecommended() {
  let url;

  if (recent.length) {
    const last = recent[recent.length - 1];
    url = `${BASE_URL}/movie/${last.id}/recommendations?api_key=${API_KEY}`;
  } else {
    url = `${BASE_URL}/movie/popular?api_key=${API_KEY}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  const container = document.getElementById("recommended");
  container.innerHTML = "";

  data.results.forEach(m => container.appendChild(createCard(m)));
}

function loadWatchlist() {
  const container = document.getElementById("watchlist");
  container.innerHTML = "";

  watchlist.forEach(m => container.appendChild(createCard(m)));
}

async function showDetails(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  const data = await res.json();

  recent.push(data);
  localStorage.setItem("recent", JSON.stringify(recent));

  const modal = document.getElementById("modal");
  const content = document.getElementById("modalContent");

  content.innerHTML = `
    <h2>${data.title}</h2>
    <p>${data.overview}</p>
    <p>⭐ ${data.vote_average}</p>
    <button onclick="addToWatchlist(${data.id}, '${data.title}', '${data.poster_path}')">
      ❤️ Add to Watchlist
    </button>
    <button onclick="closeModal()">Close</button>
  `;

  modal.style.display = "flex";
}

function addToWatchlist(id, title, poster) {
  if (!watchlist.find(m => m.id === id)) {
    watchlist.push({ id, title, poster_path: poster });
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    loadWatchlist();
  }
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

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

loadTrending();
loadRecommended();
loadWatchlist();
