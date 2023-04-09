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
function filterByGenre(movies, genres) {
  if (genres.length === 0) return movies;

  const filteredMovies = movies.filter((movie) =>
    movie.genres.some((genre) => genres.includes(genre.toLowerCase()))
  );
  return filteredMovies;
}
function filterByYear(movies, years) {
  if (years.length === 0) return movies;
  return movies.filter((movie) => years.includes(movie.year));
}
function filterMovies(movies, filters) {
  const moviesByGenres = filterByGenre(movies, filters.genres);
  const moviesByYears = filterByYear(moviesByGenres, filters.years);
  return moviesByYears;
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
function getUniqueYears(movies) {
  return [...new Set(movies.map((movie) => movie.year))];
}
function App() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [sortBy, setSortBy] = useState("");
  // const [filterGenres, setFilterGenres] = useState([]); // ["crime","drama"]
  const [filters, setFilters] = useState({
    genres: [],
    years: [],
    score: { min: 0, max: Infinity },
  });
  const filteredMovies = filterMovies(movies, filters);
  sort(filteredMovies, sortBy);
  const uniqueGenres = getUniqueGenres(movies);
  const uniqueYears = getUniqueYears(movies);
  async function searchMovies(query) {
    // LLamar a la api
    try {
      const data = await getMovies(query);
      const parseMovies = parsedMovies(data.results, genres);
      setMovies(parseMovies);
      setSortBy("");
      setFilters({
        genres: [],
        years: [],
        score: { min: 0, max: Infinity },
      });      
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
      setFilters({ ...filters, genres: [...filters.genres, genreName] });
    } else {
      setFilters({
        ...filters,
        genres: filters.genres.filter((genre) => genre != genreName),
      });
    }
  }
  function handleYear(event) {
    const newYear = event.target.name;
    const isChecked = event.target.checked;
    if (isChecked) {
      setFilters({ ...filters, years: [...filters.years, newYear] });
    } else {
      setFilters({
        ...filters,
        years: filters.years.filter((year) => year != newYear),
      });
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
          <label key={genre}>
            <input
              type="checkbox"
              name={genre.toLowerCase()}
              id={genre.toLowerCase()}
              onChange={handleCheck}
              checked={filters.genres.includes(genre.toLowerCase())}
            />
            {genre}
          </label>
        ))}
      </div>
      <div>
        <p>Release year</p>
        {uniqueYears.map((year) => (
          <label key={year}>
            <input
              type="checkbox"
              name={year}
              id={year}
              onChange={handleYear}
              checked={filters.years.includes(year)}
            />
            {year}
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