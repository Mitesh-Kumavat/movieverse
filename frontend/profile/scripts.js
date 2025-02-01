import { movieCard, loadingMovieCard, API_BASE_URL } from '../scripts/util.js';

const watchlistContainer = document.getElementById('watchlist');

loadingMovieCard(watchlistContainer);

const getUserName = async (userid) => {
    const res = await fetch(`${API_BASE_URL}/api/user/${userid}`)
    const data = await res.json();
    return data.username;
}

const fetchWatchList = async () => {
    const userid = localStorage.getItem("userId")
    const res = await fetch(`${API_BASE_URL}/api/user/${userid}/watchlist`)
    const data = await res.json();
    const username = await getUserName(userid);
    const modiefiedUsername = String(username).charAt(0).toUpperCase() + String(username).slice(1);

    if (res.status !== 200) {
        watchlistContainer.innerHTML = `<div class="text-center text-2xl text-red-500">Error fetching watchlist</div>`
        return;
    }

    document.querySelector("#userName").innerText = `${modiefiedUsername}'s Watchlist`
    watchlistContainer.innerHTML = `<div class="text-center text-2xl text-gray-500 mt-12">No movies in watchlist</div>`;

    movieCard(watchlistContainer, data);
}

fetchWatchList()