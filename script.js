document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const movieContainer = document.getElementById('movie-container');
    const modalContainer = document.getElementById('modal-container');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.querySelector('.close-btn');

    // --- API and Image URLs ---
    const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}`;
    const MOVIE_DETAILS_URL = `https://api.themoviedb.org/3/movie/`;
    const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

    // --- Event Listeners ---
    searchForm.addEventListener('submit', handleSearch);
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            closeModal();
        }
    });

    // --- Functions ---

    async function handleSearch(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            const movies = await fetchMovies(searchTerm);
            displayMovies(movies);
        }
        searchInput.value = '';
    }

    async function fetchMovies(query) {
        try {
            const response = await fetch(`${API_URL}&query=${query}`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching movies:', error);
            return [];
        }
    }

    function displayMovies(movies) {
        movieContainer.innerHTML = '';
        if (movies.length === 0) {
            movieContainer.innerHTML = '<p>No movies found. Try another search!</p>';
            return;
        }
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            const posterPath = movie.poster_path ? `${IMG_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
            movieCard.innerHTML = `
                <img src="${posterPath}" alt="${movie.title}">
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <span class="rating">⭐ ${movie.vote_average.toFixed(1)}</span>
                </div>
            `;
            movieCard.addEventListener('click', () => openModal(movie.id));
            movieContainer.appendChild(movieCard);
        });
    }

    async function openModal(movieId) {
        try {
            const response = await fetch(`${MOVIE_DETAILS_URL}${movieId}?api_key=${API_KEY}`);
            const movie = await response.json();
            const posterPath = movie.poster_path ? `${IMG_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
            
            // --- UPDATED: Added HTML for the comment section ---
            modalBody.innerHTML = `
                <img src="${posterPath}" alt="${movie.title}" style="width: 200px; float: left; margin-right: 20px;">
                <h2>${movie.title}</h2>
                <p><strong>Release Date:</strong> ${movie.release_date}</p>
                <p><strong>Rating:</strong> ⭐ ${movie.vote_average.toFixed(1)}</p>
                <p>${movie.overview}</p>
                
                <div id="interaction-section">
                    <h4>Your Rating:</h4>
                    <div class="stars">
                        ${[5, 4, 3, 2, 1].map(star => `<span class="star" data-value="${star}">★</span>`).join('')}
                    </div>
                    <p id="user-rating-text"></p>
                    
                    <h4>Your Comment:</h4>
                    <div id="comment-display"></div>
                    <textarea id="comment-input" placeholder="Add your thoughts..."></textarea>
                    <button id="save-comment-btn">Save Comment</button>
                </div>
            `;
            
            modalContainer.style.display = 'flex';
            setupInteractions(movieId); // UPDATED: Changed function name
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    }

    /**
     * UPDATED: Renamed function and added comment logic.
     * Sets up ratings and comments, loading and saving from localStorage.
     * @param {number} movieId - The ID of the movie.
     */
    function setupInteractions(movieId) {
        // --- Rating Logic (no changes) ---
        const stars = document.querySelectorAll('.star');
        const userRatingText = document.getElementById('user-rating-text');
        const savedRating = localStorage.getItem(`movie_${movieId}_rating`);
        if (savedRating) {
            updateStars(savedRating);
            userRatingText.innerText = `You rated this ${savedRating} out of 5.`;
        }
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = star.dataset.value;
                localStorage.setItem(`movie_${movieId}_rating`, rating);
                updateStars(rating);
                userRatingText.innerText = `You rated this ${rating} out of 5.`;
            });
        });

        // --- NEW: Comment Logic ---
        const commentInput = document.getElementById('comment-input');
        const saveCommentBtn = document.getElementById('save-comment-btn');
        const commentDisplay = document.getElementById('comment-display');

        // Load saved comment from localStorage
        const savedComment = localStorage.getItem(`movie_${movieId}_comment`);
        if (savedComment) {
            commentDisplay.innerText = savedComment;
        }

        // Save new comment to localStorage
        saveCommentBtn.addEventListener('click', () => {
            const commentText = commentInput.value.trim();
            if (commentText) {
                localStorage.setItem(`movie_${movieId}_comment`, commentText);
                commentDisplay.innerText = commentText;
                commentInput.value = ''; // Clear the textarea
            }
        });
    }

    function updateStars(rating) {
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            star.style.color = star.dataset.value <= rating ? 'gold' : 'gray';
        });
    }

    function closeModal() {
        modalContainer.style.display = 'none';
    }
});