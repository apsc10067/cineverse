import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar, Armchair } from 'lucide-react';
import SeatLayout from '../components/SeatLayout';
import ReviewSection from '../components/ReviewSection';
import './MovieDetails.css';

const FALLBACK_MOVIES = [
  { id: "1", title: "Inception", description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.", genre: "Sci-Fi", rating: 8.8, durationMinutes: 148, posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60", bannerUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80", cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"], showtimes: ["10:00 AM", "01:15 PM", "04:30 PM", "07:45 PM", "10:30 PM"] },
  { id: "2", title: "Interstellar", description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", genre: "Sci-Fi", rating: 8.6, durationMinutes: 169, posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60", bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80", cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"], showtimes: ["11:30 AM", "03:00 PM", "06:15 PM", "09:30 PM"] },
  { id: "3", title: "The Dark Knight", description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.", genre: "Action", rating: 9.0, durationMinutes: 152, posterUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&auto=format&fit=crop&q=60", bannerUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&auto=format&fit=crop&q=80", cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"], showtimes: ["09:00 AM", "12:15 PM", "03:30 PM", "06:45 PM", "10:00 PM"] },
  { id: "4", title: "Avatar: The Way of Water", description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.", genre: "Adventure", rating: 7.6, durationMinutes: 192, posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60", bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80", cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"], showtimes: ["10:30 AM", "02:15 PM", "06:00 PM", "09:45 PM"] },
  { id: "5", title: "Spirited Away", description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.", genre: "Animation", rating: 8.6, durationMinutes: 125, posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=60", bannerUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80", cast: ["Rumi Hiiragi", "Miyu Irino", "Mari Natsuki"], showtimes: ["01:00 PM", "04:00 PM", "07:00 PM"] }
];

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/movies/${id}`);
      if (!response.ok) throw new Error("Backend offline");
      const data = await response.json();
      setMovie(data);
    } catch (err) {
      console.warn("Backend unavailable, fetching fallback movie detail.");
      const fallbackMovie = FALLBACK_MOVIES.find(m => m.id === id);
      setMovie(fallbackMovie);
    } finally {
      setLoading(false);
    }
  };

  const handleShowtimeSelect = (time) => {
    setSelectedShowtime(time);
    setIsBooking(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="shimmer-details glass-panel"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="error-container home-container glass-panel">
        <h2>Movie Not Found</h2>
        <p>The movie with ID {id} does not exist in our catalog.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Back to Home</button>
      </div>
    );
  }

  // If user has selected showtime and is booking, display SeatLayout
  if (isBooking && selectedShowtime) {
    return (
      <div className="home-container">
        <SeatLayout 
          movie={movie} 
          selectedShowtime={selectedShowtime} 
          onBack={() => setIsBooking(false)} 
        />
      </div>
    );
  }

  return (
    <div className="details-page-container animate-fade-in">
      {/* Backdrop Banner */}
      <div className="details-banner">
        <img 
          src={movie.bannerUrl} 
          alt={movie.title} 
          className="details-backdrop"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80";
          }}
        />
        <div className="details-banner-overlay"></div>
      </div>

      <div className="details-content-wrapper">
        <div className="details-columns">
          
          {/* Left Column: Poster */}
          <div className="details-poster-col">
            <div className="poster-container glass-panel animate-slide-up">
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                className="details-poster" 
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60";
                }}
              />
            </div>
          </div>

          {/* Right Column: Metadata & Showtimes */}
          <div className="details-info-col animate-slide-up">
            <span className="movie-detail-genre">{movie.genre}</span>
            <h1 className="movie-detail-title">{movie.title}</h1>
            
            <div className="movie-stats-row">
              <div className="stat-badge rating-badge">
                <Star className="stat-icon-yellow" size={16} />
                <span>{movie.rating ? movie.rating.toFixed(1) : 'N/A'} / 10</span>
              </div>
              <div className="stat-badge">
                <Clock size={16} />
                <span>{movie.durationMinutes} minutes</span>
              </div>
              <div className="stat-badge">
                <Calendar size={16} />
                <span>{movie.releaseDate}</span>
              </div>
            </div>

            <div className="info-section">
              <h3>Synopsis</h3>
              <p className="movie-detail-desc">{movie.description}</p>
            </div>

            {movie.cast && movie.cast.length > 0 && (
              <div className="info-section">
                <h3>Cast</h3>
                <div className="cast-tags">
                  {movie.cast.map(actor => (
                    <span key={actor} className="cast-tag glass-panel">{actor}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Showtime Selection Box */}
            <div className="showtimes-box glass-panel">
              <div className="showtimes-header">
                <Armchair size={20} className="showtime-icon" />
                <h3>Select Showtime & Book</h3>
              </div>
              <p className="showtimes-desc">Select a showtime below to open the interactive seat reservation layout.</p>
              <div className="showtimes-grid">
                {movie.showtimes && movie.showtimes.map(time => (
                  <button 
                    key={time} 
                    className="showtime-btn btn-secondary"
                    onClick={() => handleShowtimeSelect(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Reviews Section */}
        <ReviewSection movieId={movie.id} />
      </div>
    </div>
  );
}

export default MovieDetails;
