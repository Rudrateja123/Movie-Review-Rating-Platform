// src/App.jsx
import { useState } from 'react';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}`;

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const fetchMovies = async (query) => {
    try {
      const response = await fetch(`${API_URL}&query=${query}`);
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchMovies(searchTerm);
    }
  };

  const openModal = (id) => {
    setSelectedMovieId(id);
  };

  const closeModal = () => {
    setSelectedMovieId(null);
  };

  return (
    <div className="container">
      <header>
        <h1>Movie Finder</h1>
        <form id="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            id="search-input"
            placeholder="Search for a movie..."
            autoComplete="off"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </header>

      <main id="movie-container">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onCardClick={openModal} />
          ))
        ) : (
          <p style={{ color: 'white' }}>Search for a movie to begin!</p>
        )}
      </main>

      {selectedMovieId && (
        <MovieModal movieId={selectedMovieId} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;