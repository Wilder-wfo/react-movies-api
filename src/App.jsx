import { useState } from "react";
import SearchForm from "./components/Pages/SearchForm";
import { getMovies } from "./services/movies-services";
import MovieList from "./components/MovieList";

function parsedMovies(movies) {
  return movies.map((movie) => parseMovie(movie));
}
function parseMovie(movie) {
  const {
    id,
    original_title,
    release_date,
    vote_average,
    overview,
    poster_path,
    genre_ids,
  } = movie;
  return {
    id,
    title: original_title,
    year: release_date.substr(0, 4),
    vote_average,
    overview,
    poster: `https://image.tmdb.org/t/p/w200${poster_path}`,
    genres: genre_ids,
  };
}
function App() {
  const [movies, setMovies] = useState([]);
  async function searchMovies(query) {
    // LLamar a la api
    try {
      const data = await getMovies(query);
      const parseMovies = parsedMovies(data.results);
      setMovies(parseMovies);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>🎥 Movies workshop 🎥</h1>
      <SearchForm onSubmit={searchMovies} />
      <MovieList movies={movies} />
    </div>
  );
}

export default App;