import styled from "@emotion/styled";
import Pill from "./Pill";

const Wrapper = styled.li`
  background: #f3f4f6;
  padding: 8px;
  display: flex;
  gap: 8px;
`;

const PosterWrapper = styled.div`
  min-width: 96px;
  max-width: 96px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const VoteSubtitle = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #4b5563;
`;

const Score = styled.p`
  color: #111827;
`;

const Title = styled.h2`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #111827;
`;

const Year = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #4b5563;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Overview = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #111827;
`;

const Genres = styled.div`
  display: flex;
  gap: 8px;
`;

function Movie({ movie }) {
  return (
    <Wrapper>
      <PosterWrapper>
        <img src={movie.poster} alt={movie.title} />
        <div>
          <VoteSubtitle>Vote Score</VoteSubtitle>
          <Score>{movie.vote_average}</Score>
        </div>
      </PosterWrapper>
      <InfoWrapper>
        <div>
          <Title>{movie.title}</Title>
          <Year>({movie.year})</Year>
        </div>
        <Overview>{movie.overview}</Overview>
        <Genres>
          {movie.genres.map((genre) => (
            <Pill key={genre}>{genre}</Pill>
          ))}
        </Genres>
      </InfoWrapper>
    </Wrapper>
  );
}

export default Movie;