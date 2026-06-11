import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Ticket, Calendar, Armchair, Trash2, ArrowLeft, MapPin } from 'lucide-react';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const email = localStorage.getItem('email');

  useEffect(() => {
    if (!username) {
      navigate('/auth');
      return;
    }

    const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(savedBookings);
  }, [username, navigate]);

  const handleClearBookings = () => {
    if (window.confirm("Are you sure you want to clear your booking history?")) {
      localStorage.removeItem('bookings');
      setBookings([]);
    }
  };

  return (
    <div className="profile-page-container home-container animate-fade-in">
      
      <button onClick={() => navigate('/')} className="back-catalog-btn btn-secondary">
        <ArrowLeft size={16} />
        <span>Back to Movies</span>
      </button>

      <div className="profile-grid">
        
        {/* Left Column: User details */}
        <div className="user-details-card glass-panel animate-slide-up">
          <div className="avatar-large">
            <User size={48} className="avatar-icon" />
          </div>
          <h2 className="profile-username">{username}</h2>
          <span className="profile-role-badge">{role}</span>
          
          <div className="profile-meta-info">
            <div className="meta-item">
              <span className="meta-label">Email</span>
              <span className="meta-value">{email || 'Not Provided'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Member Since</span>
              <span className="meta-value">{new Date().toLocaleDateString(undefined, {year: 'numeric', month: 'long'})}</span>
            </div>
          </div>
          
          {bookings.length > 0 && (
            <button onClick={handleClearBookings} className="clear-history-btn btn-secondary">
              <Trash2 size={16} />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Right Column: Bookings list */}
        <div className="bookings-history-section animate-slide-up">
          <div className="history-title-row">
            <Ticket className="history-icon" />
            <h2>My Bookings ({bookings.length})</h2>
          </div>

          {bookings.length === 0 ? (
            <div className="empty-bookings-card glass-panel">
              <p>You haven't booked any tickets yet. Browse our catalog and book your seats!</p>
              <button onClick={() => navigate('/')} className="btn-primary start-booking-btn">Book Tickets Now</button>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-ticket-item glass-panel">
                  <div className="ticket-poster-container">
                    <img 
                      src={booking.posterUrl} 
                      alt={booking.movieTitle} 
                      className="ticket-movie-poster"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60";
                      }}
                    />
                  </div>
                  <div className="ticket-details-info">
                    <div className="ticket-id-row">
                      <span className="ticket-id-label">ID: {booking.id}</span>
                      <span className="ticket-date-badge">{booking.bookingDate}</span>
                    </div>
                    <h3 className="ticket-movie-title">{booking.movieTitle}</h3>
                    
                    <div className="ticket-meta-grid">
                      <div className="ticket-meta-block">
                        <MapPin size={14} className="block-icon" />
                        <span>{booking.city || 'Mumbai'}</span>
                      </div>
                      <div className="ticket-meta-block">
                        <Calendar size={14} className="block-icon" />
                        <span>{booking.showtime}</span>
                      </div>
                      <div className="ticket-meta-block">
                        <Armchair size={14} className="block-icon" />
                        <span>Seats: {booking.seats.join(', ')}</span>
                      </div>
                    </div>

                    {/* Snacks summary in ticket history if present */}
                    {booking.snacks && booking.snacks.length > 0 && (
                      <div className="profile-ticket-snacks-list">
                        <span className="snacks-small-header">F&B Add-ons:</span>
                        <div className="snacks-small-tags">
                          {booking.snacks.map((snack, idx) => (
                            <span key={idx} className="snack-small-tag">
                              {snack.name} x {snack.qty}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="ticket-footer-price">
                      <span>Paid: <strong>₹{booking.totalAmount}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Profile;
