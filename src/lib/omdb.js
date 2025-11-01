
const API_URL = "https://www.omdbapi.com/";
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export async function fetchMovies(searchTerm = "Avengers") {
  try {
    const res = await fetch(`${API_URL}?s=${encodeURIComponent(searchTerm)}&apikey=${API_KEY}`);
    const data = await res.json();
    return data.Search || [];
  } catch (err) {
    console.error("OMDb fetchMovies error:", err);
    return [];
  }
}

export async function fetchMovieDetails(imdbID) {
  try {
    const res = await fetch(`${API_URL}?i=${imdbID}&apikey=${API_KEY}`);
    return await res.json();
  } catch (err) {
    console.error("OMDb fetchMovieDetails error:", err);
    return null;
  }
}
