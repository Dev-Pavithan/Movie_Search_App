import { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import movie from './movie.jpeg';

import './App.css';
import SearchIcon from './search.svg';

// Updated API URL to use HTTPS
const API_URL = 'https://www.omdbapi.com/?apikey=56100d74';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFullScreenImage, setShowFullScreenImage] = useState(true); 
  const [fadeOut, setFadeOut] = useState(false); 

  const searchMovies = async (title) => {
    try {
      // Construct the full URL with the search term.
      const fullURL = `${API_URL}&s=${title}`;
      console.log(`Fetching movies from: ${fullURL}`);

      const response = await fetch(fullURL);

      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('API did not return JSON');
      }

      const data = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        console.error('OMDB API Error:', data.Error);
        setMovies([]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true); 
    }, 2500);

    // Default search term on load
    searchMovies('Avengers');

    return () => clearTimeout(timer); 
  }, []);

  useEffect(() => {
    if (fadeOut) {
      const hideTimer = setTimeout(() => {
        setShowFullScreenImage(false); 
      }, 1000); 
      return () => clearTimeout(hideTimer);
    }
  }, [fadeOut]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchMovies(searchTerm);
    }
  };

  return (
    <div className="app">
      {showFullScreenImage && (
        <div className={`full-screen-image ${fadeOut ? 'fade-out' : ''}`}>
          <img src={movie} alt="Welcome Screen" />
        </div>
      )}
      <h1>Pavi's MovieLand</h1>
      <div className="search">
        <input
          placeholder="Search for movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <img
          src={SearchIcon}
          alt="search"
          onClick={() => searchMovies(searchTerm)}
        />
      </div>

      {movies?.length > 0 ? (
        <div className="container">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>{searchTerm ? "No Movies Found!" : "Start by searching for a movie!"}</h2>
        </div>
      )}
    </div>
  );
};

export default App;
