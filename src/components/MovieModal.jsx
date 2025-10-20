// src/components/MovieModal.jsx
import { useState, useEffect } from 'react';
const API_KEY = import.meta.env.VITE_API_KEY;
const MOVIE_DETAILS_URL = `https://api.themoviedb.org/3/movie/`;
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function MovieModal({ movieId, onClose }) {
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(localStorage.getItem(`movie_${movieId}_rating`) || 0);
  const [comment, setComment] = useState(localStorage.getItem(`movie_${movieId}_comment`) || '');
  const [commentInput, setCommentInput] = useState('');

  useEffect(() => {
    // Fetch movie details when the component is shown
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`${MOVIE_DETAILS_URL}${movieId}?api_key=${API_KEY}`);
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };
    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]); // This effect runs whenever movieId changes

  const handleRating = (rate) => {
    localStorage.setItem(`movie_${movieId}_rating`, rate);
    setRating(rate);
  };

  const handleSaveComment = () => {
    localStorage.setItem(`movie_${movieId}_comment`, commentInput);
    setComment(commentInput);
    setCommentInput('');
  };

  if (!movie) {
    return null; // Don't render anything if there's no movie data yet
  }

  const posterPath = movie.poster_path
    ? `${IMG_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div className="modal-container">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <div id="modal-body">
          <img src={posterPath} alt={movie.title} style={{ width: '200px', float: 'left', marginRight: '20px' }}/>
          <h2>{movie.title}</h2>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> ⭐ {movie.vote_average.toFixed(1)}</p>
          <p>{movie.overview}</p>

          <div id="interaction-section">
            <h4>Your Rating:</h4>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`star ${star <= rating ? 'gold' : ''}`} onClick={() => handleRating(star)}>★</span>
              ))}
            </div>
            <p id="user-rating-text">{rating > 0 ? `You rated this ${rating} out of 5.` : ''}</p>

            <h4>Your Comment:</h4>
            <div id="comment-display">{comment || 'No comment yet.'}</div>
            <textarea
              id="comment-input"
              placeholder="Add your thoughts..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            ></textarea>
            <button id="save-comment-btn" onClick={handleSaveComment}>Save Comment</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;