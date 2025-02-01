import {
  fetchData,
  loadingMovieCard,
  movieCard,
  renderPoster,
  renderMovieHeader,
  renderOverviewContent,
  renderTrailer,
  renderMovieHeaderSkeleton,
  renderPosterSkeleton,
  renderOverviewContentSkeleton,
  setupSearch,
  API_BASE_URL,
  userId
} from './util.js';

let img;
let title;
const movieId = window.location.href.split("?id=")[1];
let watchlistButton = document.getElementById('watchlistButton');

renderPosterSkeleton();
renderMovieHeaderSkeleton();
renderOverviewContentSkeleton();

async function displaySimilarMovies(movieId) {
  const container = document.querySelector(".realted-movies");
  loadingMovieCard(container);
  const movies = await fetchData(`/movie/${movieId}/similar`);
  if (!movies || movies.length === 0) {
    console.error("No similar movies found.");
    return;
  }
  movieCard(container, movies);
}

async function fetchMovieData(movieId) {
  const data = await fetchData(`/movie/${movieId}`);
  if (!data) {
    console.error("No movie data found.");
    return;
  }

  img = data.img;
  title = data.original_title;
  renderPoster(data.img, data.original_title, movieId);
  renderMovieHeader(data);
  renderOverviewContent(data);
  renderTrailer(data.trailer_link);
}

async function watchlistToggle(userId, movieId) {
  document.querySelector(".watchlist-buttons").innerHTML = `
    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>Loading...`;
  watchlistButton.disabled = true;
  if (!userId) {
    window.alert("Please login to add to watchlist.");
    window.location.href = "login/index.html";
    return;
  }

  const res = await fetch(`${API_BASE_URL}/api/user/${userId}/watchlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      movieId
    }),
  })
  const data = await res.json();
  await renderPoster(img, title, movieId);
  watchlistButton.disabled = false;
}

if (watchlistButton) {
  watchlistButton.addEventListener("click", () => {
    watchlistToggle(userId, movieId);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const overviewTab = document.querySelector("#overviewTab");
  const trailerTab = document.querySelector("#trailerTab");
  const overviewContent = document.querySelector("#overview");
  const trailerContent = document.querySelector("#trailer");
  overviewContent.classList.remove("hidden");
  trailerContent.classList.add("hidden");
  overviewTab.classList.add("border-b-2", "border-red-600", "text-white");
  trailerTab.classList.add("text-gray-400");
  trailerTab.classList.remove("border-red-600", "border-b-2", "text-white");

  overviewTab.addEventListener("click", () => {
    overviewContent.classList.remove("hidden");
    trailerContent.classList.add("hidden");
    overviewTab.classList.remove("text-gray-400");
    overviewTab.classList.add("border-b-2", "border-red-600", "text-white");
    trailerTab.classList.remove("border-red-600", "text-white", "border", "border-b-2");
    trailerTab.classList.add("text-gray-400");
  });

  trailerTab.addEventListener("click", () => {
    trailerContent.classList.remove("hidden");
    overviewContent.classList.add("hidden");
    trailerTab.classList.remove("text-gray-400");
    trailerTab.classList.add("border-red-600", "border-b-2", "text-white");
    overviewTab.classList.remove("border-red-600", "border-b-2", "text-white");
    overviewTab.classList.add("text-gray-400");
  });
});

document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const query = document.getElementById("searchBar").value.trim();
  if (query) {
    window.location.href = `/searchResult.html?search=${query}`;
  }
});

fetchMovieData(movieId);
displaySimilarMovies(movieId);

setupSearch({
  searchBar: document.getElementById('SearchBar'),
  suggestionsModal: document.getElementById('SuggestionsModal'),
  searchEndpoint: `${API_BASE_URL}/api/movie/search`,
  resultPageUrl: '/searchResult.html',
});