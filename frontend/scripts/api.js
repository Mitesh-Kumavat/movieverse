import { API_BASE_URL } from "./util.js";
import { userId } from "./util.js";

export async function fetchData(endpoint) {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${API_BASE_URL}/api${endpoint}`);
    }
    return await response.json();
}

export async function checkWatchList() {
    const res = await fetch(`${API_BASE_URL}/api/user/${userId}/watchlist`)
    const data = await res.json()
    return data.map(movie => movie.imdb_title_id)
}

export async function fetchSearchResults(url, query) {
    try {
        const response = await fetch(`${url}?search=${query}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}
