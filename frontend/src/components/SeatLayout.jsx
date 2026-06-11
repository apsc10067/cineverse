import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Armchair, CheckCircle, Ticket, Plus, Minus, ShoppingBag, CreditCard, ChevronRight } from 'lucide-react';
import './SeatLayout.css';

const SEAT_PRICE = 250; // In INR
const HANDLING_FEE = 30; // Handling fee per booking
const GST_RATE = 0.18; // 18% GST

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const COLS = Array.from({ length: 10 }, (_, i) => i + 1);

// Mock booked seats
const MOCK_BOOKED_SEATS = ['A3', 'A4', 'C7', 'C8', 'D5', 'E1', 'E2', 'F9', 'F10'];

const SNACK_ITEMS = [
  { id: 'popcorn', name: 'Caramel Popcorn', price: 180, desc: 'Crisp, sweet caramelized popcorn (Large).', image: '🍿' },
  { id: 'pepsi', name: 'Pepsi XL', price: 120, desc: 'Ice-cold refreshing cola (650ml).', image: '🥤' },
  { id: 'nachos', name: 'Cheese Nachos', price: 150, desc: 'Crunchy tortilla chips with warm cheese sauce.', image: '🌮' },
  { id: 'combo', name: 'Super Saver Combo', price: 280, desc: '1 Large Popcorn + 1 Pepsi XL.', image: '🎬' }
];

function SeatLayout({ movie, selectedShowtime, onBack }) {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingStep, setBookingStep] = useState('seats'); // 'seats', 'snacks'
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedSnacks, setSelectedSnacks] = useState({
    popcorn: 0,
    pepsi: 0,
    nachos: 0,
    combo: 0
  });

  const username = localStorage.getItem('username');

  // Calculations
  const seatsTotal = selectedSeats.length * SEAT_PRICE;
  const snacksTotal = SNACK_ITEMS.reduce((sum, item) => sum + (selectedSnacks[item.id] * item.price), 0);
  const subtotal = seatsTotal + snacksTotal;
  const gstAmount = Math.round(subtotal * GST_RATE);
  const grandTotal = subtotal + gstAmount + (selectedSeats.length > 0 ? HANDLING_FEE : 0);

  const handleSeatClick = (seatId) => {
    if (MOCK_BOOKED_SEATS.includes(seatId)) return;
    
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleSnackQtyChange = (itemId, change) => {
    const currentQty = selectedSnacks[itemId] || 0;
    const newQty = Math.max(0, currentQty + change);
    setSelectedSnacks({
      ...selectedSnacks,
      [itemId]: newQty
    });
  };

  const handleProceedToSnacks = () => {
    if (!username) {
      alert("Please login to book tickets!");
      navigate('/auth');
      return;
    }
    
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    
    setBookingStep('snacks');
  };

  const handleConfirmBooking = () => {
    // Collect selected snacks metadata
    const snacksList = SNACK_ITEMS.filter(item => selectedSnacks[item.id] > 0).map(item => ({
      name: item.name,
      qty: selectedSnacks[item.id],
      price: item.price,
      total: selectedSnacks[item.id] * item.price
    }));

    // Save booking payload to localStorage
    const bookingDetails = {
      id: 'BK-' + Math.floor(100000 + Math.random() * 900000),
      movieTitle: movie.title,
      posterUrl: movie.posterUrl,
      showtime: selectedShowtime,
      seats: selectedSeats,
      city: localStorage.getItem('selectedCity') || 'Mumbai',
      seatsTotal: seatsTotal,
      snacks: snacksList,
      snacksTotal: snacksTotal,
      handlingFee: HANDLING_FEE,
      gst: gstAmount,
      totalAmount: grandTotal,
      bookingDate: new Date().toLocaleDateString()
    };

    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([bookingDetails, ...existingBookings]));

    setBookingSuccess(true);
  };

  if (bookingSuccess) {
    const activeCity = localStorage.getItem('selectedCity') || 'Mumbai';
    const activeSnacks = SNACK_ITEMS.filter(item => selectedSnacks[item.id] > 0);

    return (
      <div className="booking-success-container glass-panel animate-fade-in">
        <CheckCircle size={64} className="success-icon animate-pulse" />
        <h2>Booking Confirmed!</h2>
        <p className="success-desc">Your e-tickets and snacks are booked for <strong>{movie.title}</strong>.</p>
        
        <div className="ticket-summary glass-card">
          <div className="ticket-header">
            <Ticket className="ticket-icon" />
            <div>
              <h3>CineVerse E-Ticket</h3>
              <span className="ticket-city-label">{activeCity}</span>
            </div>
          </div>
          
          <div className="ticket-body">
            <p><strong>Movie:</strong> {movie.title}</p>
            <p><strong>Showtime:</strong> {selectedShowtime}</p>
            <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
            
            {activeSnacks.length > 0 && (
              <div className="ticket-snacks-summary">
                <p><strong>Snacks Ordered:</strong></p>
                <ul>
                  {activeSnacks.map(item => (
                    <li key={item.id}>
                      {item.image} {item.name} x {selectedSnacks[item.id]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="receipt-separator"></div>
            
            <div className="receipt-cost-row">
              <span>Tickets Subtotal:</span>
              <span>₹{seatsTotal}</span>
            </div>
            {snacksTotal > 0 && (
              <div className="receipt-cost-row">
                <span>Food & Beverages:</span>
                <span>₹{snacksTotal}</span>
              </div>
            )}
            <div className="receipt-cost-row">
              <span>Handling Fee:</span>
              <span>₹{HANDLING_FEE}</span>
            </div>
            <div className="receipt-cost-row">
              <span>GST (18%):</span>
              <span>₹{gstAmount}</span>
            </div>
            
            <div className="receipt-separator"></div>
            
            <div className="receipt-cost-row grand-total-row">
              <span>Amount Paid:</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>
        </div>

        <div className="success-actions">
          <button onClick={() => navigate('/profile')} className="btn-primary">View My Bookings</button>
          <button onClick={onBack} className="btn-secondary">Back to Movie</button>
        </div>
      </div>
    );
  }

  return (
    <div className="seat-booking-container glass-panel animate-slide-up">
      
      {/* Header controls depending on booking step */}
      {bookingStep === 'seats' ? (
        <div className="seat-booking-header">
          <button onClick={onBack} className="back-btn btn-secondary">← Back</button>
          <div className="booking-title-info">
            <h2>Select Seats</h2>
            <p>{movie.title} • {selectedShowtime}</p>
          </div>
        </div>
      ) : (
        <div className="seat-booking-header">
          <button onClick={() => setBookingStep('seats')} className="back-btn btn-secondary">← Back to Seats</button>
          <div className="booking-title-info">
            <h2>Add Snacks & Drinks</h2>
            <p>Enhance your movie experience at CineVerse</p>
          </div>
        </div>
      )}

      {/* STEP 1: SEAT SELECTION LAYOUT */}
      {bookingStep === 'seats' && (
        <div className="step-content-container animate-fade-in">
          {/* Screen indicator */}
          <div className="screen-container">
            <div className="screen-curve"></div>
            <p className="screen-label">SCREEN THIS WAY</p>
          </div>

          {/* Seat grid */}
          <div className="seats-grid">
            {ROWS.map(row => (
              <div key={row} className="seat-row">
                <span className="row-letter">{row}</span>
                <div className="row-seats">
                  {COLS.map(col => {
                    const seatId = `${row}${col}`;
                    const isBooked = MOCK_BOOKED_SEATS.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);
                    
                    let seatClass = 'seat-icon';
                    if (isBooked) seatClass += ' seat-booked';
                    else if (isSelected) seatClass += ' seat-selected';
                    else seatClass += ' seat-available';

                    return (
                      <button 
                        key={seatId} 
                        className={seatClass}
                        onClick={() => handleSeatClick(seatId)}
                        disabled={isBooked}
                        title={isBooked ? `Seat ${seatId} Booked` : `Seat ${seatId}`}
                      >
                        <Armchair size={20} />
                        <span className="seat-number">{col}</span>
                      </button>
                    );
                  })}
                </div>
                <span className="row-letter">{row}</span>
              </div>
            ))}
          </div>

          {/* Seat Legend */}
          <div className="seat-legend">
            <div className="legend-item">
              <Armchair size={16} className="seat-icon seat-available" />
              <span>Available</span>
            </div>
            <div className="legend-item">
              <Armchair size={16} className="seat-icon seat-selected" />
              <span>Selected</span>
            </div>
            <div className="legend-item">
              <Armchair size={16} className="seat-icon seat-booked" />
              <span>Sold</span>
            </div>
          </div>

          {/* Seat Footer */}
          <div className="booking-footer">
            <div className="price-summary">
              <span className="seats-count">{selectedSeats.length} Seats Selected</span>
              <span className="total-amount">Ticket total: ₹{seatsTotal}</span>
            </div>
            <button 
              onClick={handleProceedToSnacks} 
              disabled={selectedSeats.length === 0}
              className="btn-primary confirm-booking-btn"
            >
              <span>Select Snacks</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SNACKS ORDERING MODULE */}
      {bookingStep === 'snacks' && (
        <div className="step-content-container animate-fade-in">
          
          <div className="snacks-split-layout">
            {/* Left side: Snacks items */}
            <div className="snacks-list-col">
              {SNACK_ITEMS.map(item => (
                <div key={item.id} className="snack-item-card glass-card">
                  <div className="snack-emoji">{item.image}</div>
                  <div className="snack-details">
                    <h4>{item.name}</h4>
                    <p>{item.desc}</p>
                    <span className="snack-price">₹{item.price}</span>
                  </div>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleSnackQtyChange(item.id, -1)}
                      className="qty-btn"
                      disabled={(selectedSnacks[item.id] || 0) === 0}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="qty-value">{selectedSnacks[item.id] || 0}</span>
                    <button 
                      onClick={() => handleSnackQtyChange(item.id, 1)}
                      className="qty-btn"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right side: Receipt invoice breakdown */}
            <div className="invoice-summary-col glass-card">
              <div className="invoice-header">
                <ShoppingBag size={18} className="invoice-icon" />
                <h3>Order Invoice</h3>
              </div>
              
              <div className="invoice-receipt-body">
                <div className="invoice-row">
                  <span>Tickets ({selectedSeats.length} seats):</span>
                  <span>₹{seatsTotal}</span>
                </div>
                
                {snacksTotal > 0 && (
                  <div className="invoice-snacks-items-list">
                    <span className="invoice-sub-label">Snacks:</span>
                    {SNACK_ITEMS.filter(i => selectedSnacks[i.id] > 0).map(i => (
                      <div key={i.id} className="invoice-row invoice-snack-subrow">
                        <span>• {i.name} (x{selectedSnacks[i.id]}):</span>
                        <span>₹{selectedSnacks[i.id] * i.price}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="invoice-row">
                  <span>Booking Fees:</span>
                  <span>₹{HANDLING_FEE}</span>
                </div>
                <div className="invoice-row">
                  <span>GST & State Tax (18%):</span>
                  <span>₹{gstAmount}</span>
                </div>
                
                <div className="invoice-divider"></div>
                
                <div className="invoice-row grand-total-row">
                  <span>Grand Total:</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <button 
                onClick={handleConfirmBooking}
                className="btn-primary pay-now-btn"
              >
                <CreditCard size={18} />
                <span>Confirm Payment & Book</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default SeatLayout;
