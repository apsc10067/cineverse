import React, { useState, useEffect } from 'react';
import { Search, Film, AlertCircle, MapPin, Globe } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import './Home.css';

// Fallback seed movies including Bollywood blockbusters
const FALLBACK_MOVIES = [
  { id: "1", title: "Inception", description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.", genre: "Sci-Fi", rating: 8.8, durationMinutes: 148, language: "English", posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60", bannerUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80" },
  { id: "2", title: "Interstellar", description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", genre: "Sci-Fi", rating: 8.6, durationMinutes: 169, language: "English", posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60", bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80" },
  { id: "3", title: "The Dark Knight", description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.", genre: "Action", rating: 9.0, durationMinutes: 152, language: "English", posterUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&auto=format&fit=crop&q=60", bannerUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&auto=format&fit=crop&q=80" },
  { id: "4", title: "Avatar: The Way of Water", description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.", genre: "Adventure", rating: 7.6, durationMinutes: 192, language: "English", posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60", bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80" },
  { id: "5", title: "Spirited Away", description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.", genre: "Animation", rating: 8.6, durationMinutes: 125, language: "English", posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=60", bannerUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80" },
  { id: "6", title: "Jawan", description: "A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society.", genre: "Action", rating: 8.4, durationMinutes: 169, language: "Hindi", posterUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&auto=format&fit=crop&q=60", bannerUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1200&auto=format&fit=crop&q=80" },
  { id: "7", title: "Pathaan", description: "An Indian agent can stop a mercenary group from releasing a deadly virus in the country.", genre: "Action", rating: 7.8, durationMinutes: 146, language: "Hindi", posterUrl: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&auto=format&fit=crop&q=60", bannerUrl: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1200&auto=format&fit=crop&q=80" },
  { id: "8", title: "3 Idiots", description: "Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently.", genre: "Comedy", rating: 8.8, durationMinutes: 170, language: "Hindi", posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=60", bannerUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80" },
  { id: "9", title: "Brahmastra", description: "A young man on the brink of love and life has his world turned upside down when he discovers he has a superpower connection to fire and a great destiny.", genre: "Fantasy", rating: 7.2, durationMinutes: 167, language: "Hindi", posterUrl: "https://images.unsplash.com/photo-1460881680858-30d872d5b530?w=500&auto=format&fit=crop&q=60", bannerUrl: "https://images.unsplash.com/photo-1460881680858-30d872d5b530?w=1200&auto=format&fit=crop&q=80" }
];

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All'); // 'All', 'English' (Hollywood), 'Hindi' (Bollywood)
  const [currentCity, setCurrentCity] = useState(localStorage.getItem('selectedCity') || 'Mumbai');
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    fetchMovies();

    // Listen for city change events from Navbar
    const handleCityChange = () => {
      setCurrentCity(localStorage.getItem('selectedCity') || 'Mumbai');
    };

    window.addEventListener('cityChanged', handleCityChange);
    return () => {
      window.removeEventListener('cityChanged', handleCityChange);
    };
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/movies');
      if (!response.ok) throw new Error("Backend offline");
      const data = await response.json();
      setMovies(data);
      setIsDemoMode(false);
    } catch (err) {
      console.warn("Backend unavailable, loading local catalog data fallback.");
      setMovies(FALLBACK_MOVIES);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  const genres = ['All', 'Action', 'Sci-Fi', 'Adventure', 'Animation', 'Comedy', 'Fantasy'];
  const languages = [
    { label: 'All Languages', value: 'All' },
    { label: 'Hollywood (English)', value: 'English' },
    { label: 'Bollywood (Hindi)', value: 'Hindi' }
  ];

  // Filtering Logic
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          movie.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || movie.genre.toLowerCase() === selectedGenre.toLowerCase();
    
    // Fallback support if language property isn't seeded from API yet
    const movieLang = movie.language || (['1','2','3','4','5'].includes(movie.id) ? 'English' : 'Hindi');
    const matchesLang = selectedLanguage === 'All' || movieLang.toLowerCase() === selectedLanguage.toLowerCase();
    
    return matchesSearch && matchesGenre && matchesLang;
  });

  // Featured Movie: Pick Jawan (ID 6) as Bollywood star or Fallback
  const featuredMovie = movies.find(m => m.id === "6") || movies.find(m => m.id === "1") || movies[0];

  return (
    <div className="home-container animate-fade-in">
      {/* Demo notification banner */}
      {isDemoMode && (
        <div className="demo-banner glass-panel">
          <AlertCircle size={16} />
          <span>Local Offline Mode: Running client-side simulation. Start Gateway (8080) and Movie Service (8082) to run with API integrations.</span>
        </div>
      )}

      {/* Hero Movie Banner */}
      {featuredMovie && (
        <div className="hero-banner animate-slide-up">
          <div className="hero-backdrop-container">
            <img 
              src={featuredMovie.bannerUrl} 
              alt={featuredMovie.title} 
              className="hero-backdrop" 
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80";
              }}
            />
            <div className="hero-overlay"></div>
          </div>
          <div className="hero-content">
            <span className="hero-badge">Featured Blockbuster</span>
            <h1 className="hero-title">{featuredMovie.title}</h1>
            <p className="hero-description">{featuredMovie.description}</p>
            <div className="hero-actions">
              <a href={`/movie/${featuredMovie.id}`} className="btn-primary">
                <Film size={18} />
                <span>Book Tickets Now</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Discovery Section */}
      <div className="discovery-section">
        <div className="discovery-header">
          <div className="title-area">
            <h2 className="discovery-title">Now Showing</h2>
            <div className="city-info-badge glass-panel">
              <MapPin size={14} className="pin-icon" />
              <span>in {currentCity}</span>
            </div>
          </div>
          
          <div className="filter-controls">
            {/* Search */}
            <div className="search-bar glass-panel">
              <Search className="search-icon" size={18} />
              <input 
                type="text" 
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Language & Genre Selection Controls */}
        <div className="filters-row">
          {/* Language Selector */}
          <div className="language-selector glass-panel">
            <Globe size={16} className="filter-icon" />
            <div className="lang-buttons">
              {languages.map(lang => (
                <button
                  key={lang.value}
                  className={`lang-btn ${selectedLanguage === lang.value ? 'active' : ''}`}
                  onClick={() => setSelectedLanguage(lang.value)}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Genre Tags */}
          <div className="genre-container">
            {genres.map(genre => (
              <button 
                key={genre}
                className={`genre-tag ${selectedGenre === genre ? 'active' : ''}`}
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="loading-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shimmer-card glass-panel"></div>
            ))}
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="empty-results glass-panel">
            <p>No movies match your search query or filters. Try adjusting your selections!</p>
          </div>
        ) : (
          <div className="movies-grid animate-slide-up">
            {filteredMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
