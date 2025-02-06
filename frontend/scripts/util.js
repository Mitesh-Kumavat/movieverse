import {
  fetchData,
  checkWatchList,
  fetchSearchResults
} from "./api.js";

// export const API_BASE_URL = "https://flask-movieverse.onrender.com";
export const userId = localStorage.getItem("userId")
export const API_BASE_URL = "http://127.0.0.1:5000";


export async function movieCard(container, movies) {
  container.innerHTML = movies.map((movie, index) =>
    ` <div class="relative overflow-hidden rounded-xl flex-none w-[200px] sm:w-[260px] group cursor-pointer">
    <a href="/movieDetail.html?id=${movie.imdb_title_id}">
            <img src="${movie.img}" 
                alt="${movie.original_title}" 
                class="w-full h-[315px] sm:h-[350px] rounded-xl object-cover transition-transform duration-300 group-hover:scale-105">
                <div class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                    <div class="flex items-center gap-2">
                        <span class="text-6xl font-bold opacity-80 backdrop bg-shadow">${index + 1}</span>
                    </div>
                </div>
                </a>
        </div>`).join("");
}

export function loadingMovieCard(container) {
  const skeletonCards = Array.from({ length: 5 }).map(() => `
        <div class="relative overflow-hidden rounded-xl flex-none w-[200px] sm:w-[260px] group cursor-pointer">
            <div class="w-full h-[315px] sm:h-[350px] bg-gray-700 rounded-xl animate-pulse"></div>
            <div class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-gray">
                <div class="flex items-center gap-2">
                   
                </div>
            </div>
        </div>
    `).join("");

  container.innerHTML = skeletonCards;
}

export async function renderPoster(img_src, title, movieid) {
  let isAddedInWatchList = false;

  document.querySelector(".poster-here").innerHTML = ` <img src="${img_src}" alt="${title}" class="w-auto h-[380px] sm:h-[500px] rounded-lg shadow-xl">`;

  try {
    const watchlistMoviesId = await checkWatchList();
    if (watchlistMoviesId.includes(movieid)) isAddedInWatchList = true;
  } catch (error) {
    console.error("Error checking the watchlist:", error);
  }
  document.querySelector("#watchlistButton").classList.remove("hidden")
  document.querySelector(".watchlist-buttons").innerHTML = `${isAddedInWatchList ? removeButton : addButton}`;
}

const addButton = `<svg fill="white" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>Add to watchlist`;

const removeButton = `<svg height="20" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM184 232l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/></svg>Remove from watchlist`;

export function renderMovieHeader(data) {
  const hours = `${Math.floor(data.duration / 60)}h ${data.duration % 60}m`;
  document.querySelector(".movie-main-content-header").innerHTML = `
    <div>
      <h1 class="text-4xl md:text-5xl font-bold mb-4">${data.original_title}</h1>
      <div class="flex items-center gap-4 text-sm text-gray-300 mb-4 flex-wrap">
        <span>${data.year}</span>
        <span>${hours}</span>
        <span class="px-2 py-1 border border-gray-300 rounded">${data.language_1}</span>
        <div class="flex items-center gap-2">
          <span class="text-2xl font-bold">${data.avg_vote}</span>
          <span class="text-yellow-500">★</span>
        </div>
      </div>
    </div>
  `;
}

export function renderOverviewContent(data) {
  document.querySelector(".overview-content").innerHTML = `
    <p class="text-lg text-gray-300">${data.description}</p>
    <div class="space-y-2">
      <div class="flex gap-8">
        <span class="text-gray-400 mr-10">Starring</span>
        <span class="text-gray-300">${data.actors}</span>
      </div>
      <div class="flex gap-8">
        <span class="text-gray-400 w-24">Created by</span>
        <span class="text-gray-300">${data.director}</span>
      </div>
      <div class="flex gap-8">
        <span class="text-gray-400 w-24">Genre</span>
        <div class="flex gap-2 flex-wrap">
          <span class="text-gray-300">${data.genre}</span>
        </div>
      </div>
    </div>
  `;
}

export function renderTrailer(trailerLink) {
  if (trailerLink) {
    document.querySelector(".trailer-here").innerHTML = `
    <iframe allowfullscreen class="h-[200px] md:h-[340px] md:w-[550px] w-[400px]" src="${trailerLink}" allow="clipboard-write; encrypted-media; gyroscope; picture-in-picture"  frameborder="0"></iframe>
    `;
  } else {
    document.querySelector(".trailer-here").innerHTML = `
    <div class="w-full p-6 text-white text-3xl font-semibold">Youtube Trailer API Limit is over.</div>
    `;
  }
}

export function renderPosterSkeleton() {
  document.querySelector(".poster-here").innerHTML = `
    <div class="sm:w-[320px] w-[260px] h-[380px] sm:h-[500px] rounded-lg bg-gray-700 animate-pulse"></div>
  `;
}

export function renderMovieHeaderSkeleton() {
  document.querySelector(".movie-main-content-header").innerHTML = `
    <div>
      <div class="w-3/4 h-8 bg-gray-700 rounded mb-4 animate-pulse"></div>
      <div class="flex items-center gap-4 text-sm text-gray-300 mb-4 flex-wrap">
        <div class="w-16 h-6 bg-gray-700 rounded animate-pulse"></div>
        <div class="w-20 h-6 bg-gray-700 rounded animate-pulse"></div>
        <div class="w-24 h-6 bg-gray-700 rounded animate-pulse"></div>      
        <div class="w-12 h-6 bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  `;
}

export function renderOverviewContentSkeleton() {
  document.querySelector(".overview-content").innerHTML = `
    <div class="w-full h-6 bg-gray-700 rounded mb-4 animate-pulse"></div>
    <div class="space-y-2">
      <div class="flex gap-8">
        <div class="w-24 h-6 bg-gray-700 rounded animate-pulse"></div>
        <div class="w-48 h-6 bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div class="flex gap-8">
        <div class="w-24 h-6 bg-gray-700 rounded animate-pulse"></div>
        <div class="w-48 h-6 bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div class="flex gap-8">
        <div class="w-24 h-6 bg-gray-700 rounded animate-pulse"></div>
        <div class="w-48 h-6 bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  `;
}

export function renderSuggestions(modal, movies, query) {
  if (movies.length === 0) {
    modal.innerHTML = `<p class="text-gray-400 text-center py-3">No results found</p>`;
    modal.classList.remove('hidden');
    return;
  }

  const suggestionsHTML = movies
    .slice(0, 5)
    .map((movie) => `
        <div class="flex items-center gap-3 p-2 hover:bg-zinc-900 cursor-pointer ">
           <a href="/movieDetail.html?id=${movie.imdb_title_id}" class="flex items-center w-full gap-3">
            <img src="${movie.img}" alt="${movie.original_title}" class="w-12 h-16 object-cover rounded" />
            <div class="flex flex-col w-full">
                <div class="flex justify-between w-full">
                    <p class="text-white font-medium">${movie.original_title}</p>
                    <p class="text-gray-400 text-sm">${movie.year}</p>
                </div>
                <div class="flex justify-between w-full">
                    <p class="text-gray-400 font-medium">${movie.genre}</p>
                </div>
            </div>
           </a>
        </div>`)
    .join('');

  const showAllButton = movies.length > 5
    ? `<div class="p-4 pt-1">
     <button class="w-full rounded-xl py-3 bg-red-600 text-center font-medium  text-white transition duration-200 hover:bg-red-700 " onclick="window.location.href='/searchResult.html?search=${query}'"> View All Results </button></div>`
    : '';

  modal.innerHTML = suggestionsHTML + showAllButton;
  modal.classList.remove('hidden');
}

export function setupSearch({ searchBar, suggestionsModal, searchEndpoint, resultPageUrl }) {
  let debounceTimeout;

  searchBar.addEventListener('input', (event) => {
    const query = event.target.value.trim();
    if (!query) {
      suggestionsModal.classList.add('hidden');
      return;
    }

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
      const movies = await fetchSearchResults(searchEndpoint, query);

      if (movies.message === 'No movies found') {
        suggestionsModal.innerHTML = `<p class="h-28 m-auto p-auto text-gray-400 text-center py-3"><span class="mt-22 inline-block p-8">No results found</span></p>`;
        suggestionsModal.classList.remove('hidden');
        suggestionsModal.classList.remove('rounded-br-2xl');
        suggestionsModal.classList.remove('rounded-bl-2xl');
        return;
      }
      renderSuggestions(suggestionsModal, movies, query);
    }, 10);
  });

  document.querySelector('#searchForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchBar.value.trim();
    if (query) {
      window.location.href = `${resultPageUrl}?search=${query}`;
    }
  });
}

export const showToast = (message, destination = null) => {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = "fixed z-[99999999] left-1/2 transform -translate-x-1/2 bottom-5 bg-gray-800/40 backdrop-blur-sm shadow-lg text-white px-6 py-3 rounded-lg shadow-lg text-sm font-medium transition-all opacity-100 min-w-max-content";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("opacity-0");
    setTimeout(() => {
      toast.remove();
      if (destination !== null) {
        window.location.href = destination;
      }
    }, 500);
  }, 1500);
};