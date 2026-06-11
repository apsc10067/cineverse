import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import './MovieCard.css';

function MovieCard({ movie }) {
  const movieLang = movie.language || (['1','2','3','4','5'].includes(movie.id) ? 'English' : 'Hindi');

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card glass-card animate-slide-up">
      <div className="card-image-container">
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="card-image"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60";
          }}
        />
        <div className="card-badges-row">
          <span className="card-genre-badge">{movie.genre}</span>
          <span className="card-lang-badge">{movieLang}</span>
        </div>
      </div>
      <div className="card-info">
        <h3 className="card-title">{movie.title}</h3>
        <div className="card-meta">
          <div className="card-rating">
            <Star className="rating-icon" size={16} />
            <span>{movie.rating ? movie.rating.toFixed(1) : 'N/A'}</span>
          </div>
          <div className="card-duration">
            <Clock size={14} />
            <span>{movie.durationMinutes} min</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
