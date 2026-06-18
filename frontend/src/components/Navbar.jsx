import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, User, LogOut, LogIn, MapPin } from 'lucide-react';
import './Navbar.css';

const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad'];

function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  
  // City selection state
  const [selectedCity, setSelectedCity] = useState(
    localStorage.getItem('selectedCity') || 'Mumbai'
  );

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    localStorage.setItem('selectedCity', city);
    // Dispatch a custom storage event to notify other components (like Home/Details)
    window.dispatchEvent(new Event('cityChanged'));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Film className="logo-icon" />
          <span>Cine<span className="logo-highlight">Verse</span></span>
        </Link>

        {/* City Selector */}
        <div className="city-selector-container glass-card">
          <MapPin size={16} className="city-icon" />
          <select 
            value={selectedCity} 
            onChange={handleCityChange} 
            className="city-selector-dropdown"
          >
            {CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        
        <div className="navbar-actions">
          {username ? (
            <>
              <Link to="/profile" className="nav-link">
                <User className="nav-icon" />
                <span>{username}</span>
                {role === 'ADMIN' && <span className="admin-badge">Admin</span>}
              </Link>
              <button onClick={handleLogout} className="logout-btn btn-secondary">
                <LogOut size={16} />
                <span className="logout-text">Logout</span>
              </button>
            </>
          ) : (
            <Link to="/auth" className="login-btn btn-primary">
              <LogIn size={16} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
