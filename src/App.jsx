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
function sort(movies, sortBy) {
  if (!sortBy) return;
  const order = {
    title: "asc",
    year: "desc",
    vote_average: "desc",
  };
  if (order[sortBy] === "desc") {
    movies.sort((a, b) => (a[sortBy] <= b[sortBy] ? 1 : -1));
  } else {
    movies.sort((a, b) => (a[sortBy] <= b[sortBy] ? -1 : 1));
  }
}
function filterMovies(movies, filters) {
  if (filters.length === 0) return movies;
  console.log(filters);
  console.log(movies);
  const filteredMovies = movies.filter((movie) =>
    movie.genres.some((genre) => filters.includes(genre.toLowerCase()))
  );
  return filteredMovies;
}
function getUniqueGenres(movies) {
  const genres = new Set();
  for (const movie of movies) {
    for (const genre of movie.genres) {
      genres.add(genre);
    }
  }
  //set
  return [...genres]; //array
}
function App() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [sortBy, setSortBy] = useState("");
  // const [crime, setCrime] = useState(false);
  const [filterGenres, setFilterGenres] = useState([]); // ["crime","drama"]
  const filteredMovies = filterMovies(movies, filterGenres);
  sort(filteredMovies, sortBy);
  const uniqueGenres = getUniqueGenres(movies);
  async function searchMovies(query) {
    // LLamar a la api
    try {
      const data = await getMovies(query);
      const parseMovies = parsedMovies(data.results, genres);
      setMovies(parseMovies);
      setSortBy("");
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
  function handleCheck(event) {
    const genreName = event.target.name;
    const isChecked = event.target.checked;
    if (isChecked) {
      setFilterGenres([...filterGenres, genreName]);
    } else {
      setFilterGenres(filterGenres.filter((genre) => genre != genreName));
    }
  }
  const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    max-width: 480px;
    padding: 16px;
    margin: 0 auto;
  `;
  return (
    <Container>
      <h1 style={{ textAlign: "center" }}>🎥 Movies workshop 🎥</h1>
      <SearchForm onSubmit={searchMovies} />
      <div>
        <p>Genre</p>
        {uniqueGenres.map((genre) => (
          <label>
            <input
              type="checkbox"
              name={genre.toLowerCase()}
              id={genre.toLowerCase()}
              onChange={handleCheck}
              checked={filterGenres.includes(genre.toLowerCase())}
            />
            {genre}
          </label>
        ))}
      </div>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option>Sort By</option>
        <option value="title">Title</option>
        <option value="year">Year</option>
        <option value="vote_average">Score</option>
      </select>
      <MovieList movies={filteredMovies} />
    </Container>
  );
}

export default App;