// src/components/MovieCard.jsx
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function MovieCard({ movie, onCardClick }) {
  const posterPath = movie.poster_path
    ? `${IMG_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div className="movie-card" onClick={() => onCardClick(movie.id)}>
      <img src={posterPath} alt={movie.title} />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
      </div>
    </div>
  );
}

export default MovieCard;