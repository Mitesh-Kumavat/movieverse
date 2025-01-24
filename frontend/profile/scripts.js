import { movieCard, loadingMovieCard, API_BASE_URL } from '../scripts/util.js';

const watchlistContainer = document.getElementById('watchlist');

loadingMovieCard(watchlistContainer);

const fetchWatchList = async () => {
    const userid = localStorage.getItem("userId")
    const res = await fetch(`${API_BASE_URL}/api/user/${userid}/watchlist`)
    const data = await res.json();
    console.log(data);
    if (res.status !== 200) {
        watchlistContainer.innerHTML = `<div class="text-center text-2xl text-red-500">Error fetching watchlist</div>`
        return;
    }

    if (data.length === 0) {
        document.querySelector("#userName").innerText = `${String(data.username).charAt(0).toUpperCase() + String(data.username).slice(1)}'s Watchlist`
        watchlistContainer.innerHTML = `<div class="text-center text-2xl text-gray-500 mt-12">No movies in watchlist</div>`
        return
    }


    document.querySelector("#userName").innerText = `${String(data.username).charAt(0).toUpperCase() + String(data.username).slice(1)}'s Watchlist`
    movieCard(watchlistContainer, data);
}

fetchWatchList()