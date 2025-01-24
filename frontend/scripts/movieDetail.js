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

let img;
let title;

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

const movieId = window.location.href.split("?id=")[1];


renderPosterSkeleton();
renderMovieHeaderSkeleton();
renderOverviewContentSkeleton();

fetchMovieData(movieId);
displaySimilarMovies(movieId);

setupSearch({
  searchBar: document.getElementById('SearchBar'),
  suggestionsModal: document.getElementById('SuggestionsModal'),
  searchEndpoint: `${API_BASE_URL}/api/movie/search`,
  resultPageUrl: '/searchResult.html',
});

async function watchlistToggle(userId, movieId) {
  if (!userId) {
    window.alert("Please login to add to watchlist.");
    window.location.href = "login/index.html";
    console.error("User not logged in.");
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
  console.log(data);

  renderPoster(img, title, movieId);
}


let watchlistButton = document.getElementById('watchlistButton');
if (watchlistButton) {
  watchlistButton.addEventListener("click", () => {
    console.log("Button Clicked");
    watchlistToggle(userId, movieId);
  });
} else {
  console.log("Watchlist button not found.");
}
