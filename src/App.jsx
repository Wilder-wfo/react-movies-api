import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import MovieList from "./components/MovieList";
import SearchForm from "./components/Pages/SearchForm";
import { getGenres, getMovies } from "./services/movies-services";

function parsedMovies(movies, genres) {
  return movies.map((movie) => parseMovie(movie, genres));
}
function parseMovie(movie, genres) {
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
    genres: genre_ids.map((genre_id) => genres[genre_id]),
  };
}
function App() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  async function searchMovies(query) {
    // LLamar a la api
    try {
      const data = await getMovies(query);
      const parseMovies = parsedMovies(data.results, genres);
      setMovies(parseMovies);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getGenres().then((data) => {
      const genresObject = {};
      for (const genre of data.genres) {
        genresObject[genre.id] = genre.name;
      }
      setGenres(genresObject);
    });
  }, []);
  const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    max-width: 480px;
  `;
  return (
    <Container>
      <h1 style={{ textAlign: "center" }}>🎥 Movies workshop 🎥</h1>
      <SearchForm onSubmit={searchMovies} />
      <MovieList movies={movies} />
      </Container>
  );
}

export default App;