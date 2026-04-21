const API_KEY = "f833faaba54d6eb393c19ecb9d80d465";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

let movies = [];

async function fetchPopular() {
  let temp = [];

  for (let page = 1; page <= 2; page++) {
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();
    temp = temp.concat(data.results);
  }

  movies = temp;
  displayMovies(movies);
}

function displayMovies(list) {
  const container = document.getElementById("movies");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>No movies found</p>";
    return;
  }

  list.forEach(movie => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${movie.poster_path 
        ? IMG_URL + movie.poster_path 
        : 'https://via.placeholder.com/200x300'}">
    `;

    card.onclick = () => showDetails(movie.id);

    container.appendChild(card);
  });
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
  const id = parseInt(e.target.value);

  if (!id) return displayMovies(movies);

  const filtered = movies.filter(m => m.genre_ids.includes(id));
  displayMovies(filtered);
});

async function showDetails(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  const data = await res.json();

  const videoRes = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`);
  const videoData = await videoRes.json();

  const trailer = videoData.results.find(
    v => v.type === "Trailer" && v.site === "YouTube"
  );

  const modal = document.getElementById("modal");
  const content = document.getElementById("modalContent");

  content.innerHTML = `
    <h2>${data.title}</h2>
    <p>${data.overview}</p>
    <p>⭐ ${data.vote_average}</p>

    ${
      trailer
        ? `<iframe src="https://www.youtube.com/embed/${trailer.key}"></iframe>`
        : "<p>No trailer available</p>"
    }

    <button onclick="closeModal()">Close</button>
  `;

  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

const toggle = document.getElementById("themeToggle");

toggle.onclick = () => {
  document.body.classList.toggle("light");
  toggle.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
};

fetchPopular();
loadGenres();