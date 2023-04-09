import { useState } from "react";
import SearchForm from "./components/Pages/SearchForm";
import { getMovies } from "./services/movies-services";

function App() {
  const [movies, setMovies] = useState([]);
  function searchMovies(query) {
    // LLamar a la api
    getMovies(query).then((data) => setMovies(data.results));
  }
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>🎥 Movies workshop 🎥</h1>
      <SearchForm onSubmit={searchMovies} />
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.original_title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;