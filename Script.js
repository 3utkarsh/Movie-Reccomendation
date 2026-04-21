const API_KEY = "f833faaba54d6eb393c19ecb9d80d465";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

let movies = []; 
async function fetchTrendingMovies() {
  try {
    let temp = [];

    for (let page = 1; page <= 2; page++) {
      const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`);
      const data = await res.json();
      temp = temp.concat(data.results);
    }

    movies = temp;
    displayMovies(movies);

  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

function displayMovies(movieList) {
  const container = document.getElementById("trending");
  container.innerHTML = "";

  if (movieList.length === 0) {
    container.innerHTML = "<p>No movies found</p>";
    return;
  }

  movieList.forEach(movie => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${
        movie.poster_path
          ? IMG_URL + movie.poster_path
          : "https://via.placeholder.com/200x300"
      }" alt="${movie.title}" />
    `;

    container.appendChild(card);
    card.onclick = () => showMovieDetails(movie.id);
  });
}


async function loadGenres() {
  try {
    const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    const data = await res.json();

    const select = document.getElementById("genreFilter");

    data.genres.forEach(genre => {
      const option = document.createElement("option");
      option.value = genre.id;
      option.textContent = genre.name;
      select.appendChild(option);
    });

  } catch (error) {
    console.error("Error loading genres:", error);
  }
}

function filterMoviesByGenre(genreId) {
  if (!genreId) {
    displayMovies(movies);
    return;
  }

  const filtered = movies.filter(movie =>
    movie.genre_ids.includes(genreId)
  );

  displayMovies(filtered);
}


document.getElementById("genreFilter").addEventListener("change", (e) => {
  const genreId = parseInt(e.target.value);
  filterMoviesByGenre(genreId);
});
async function showMovieDetails(id) {
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
    <p>⭐ Rating: ${data.vote_average}</p>

    ${
      trailer
        ? `<iframe src="https://www.youtube.com/embed/${trailer.key}" allowfullscreen></iframe>`
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


fetchTrendingMovies();
loadGenres();
