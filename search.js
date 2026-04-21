const API_KEY = "f833faaba54d6eb393c19ecb9d80d465";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";


async function searchMovies(query) {
  if (!query) {
    document.getElementById("movies").innerHTML = "";
    return;
  }

  try {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
    );

    const data = await res.json();
    displayMovies(data.results);

  } catch (err) {
    console.error("Error fetching search results:", err);
  }
}


function displayMovies(list) {
  const container = document.getElementById("movies");
  container.innerHTML = "";

  if (!list || list.length === 0) {
    container.innerHTML = "<p>No results found</p>";
    return;
  }

  list.forEach(movie => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${
        movie.poster_path
          ? IMG_URL + movie.poster_path
          : "https://via.placeholder.com/200x300"
      }" alt="${movie.title}">
    `;

    card.onclick = () => showDetails(movie.id);

    container.appendChild(card);
  });
}


let timeout;

document.getElementById("searchInput").addEventListener("input", (e) => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    searchMovies(e.target.value.trim());
  }, 400);
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