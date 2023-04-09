//https://api.themoviedb.org/3/search/movie?api_key=b0b911938716bf1c1f2c3acb09ff4525&language=en-US&query=terminator
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_API_KEY;
export function getMovies(query) {
  return fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${query}`
  ).then((response) => response.json());
}