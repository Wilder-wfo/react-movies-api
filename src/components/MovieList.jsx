import styled from "@emotion/styled";
import Movie from "./Movie";

const Wrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
`;
const MovieList = ({ movies }) => {
  return (
    <Wrapper>
      {movies.map((movie) => (
        <Movie key={movie.id} movie={movie} />
      ))}
    </Wrapper>
  );
};
export default MovieList;
