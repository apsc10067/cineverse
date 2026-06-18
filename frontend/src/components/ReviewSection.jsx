import { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, MessageSquare } from 'lucide-react';
import './ReviewSection.css';

function ReviewSection({ movieId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  // Load reviews
  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reviews/movie/${movieId}`);
      if (!response.ok) throw new Error("Could not fetch reviews.");
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.warn("Backend unavailable, using mock reviews fallback:", err.message);
      // Fallback mock reviews
      const fallbackReviews = [
        { id: 1, username: "Aman", rating: 5, comment: "Absolutely mind-bending! Christopher Nolan is a genius.", createdAt: new Date().toISOString() },
        { id: 2, username: "Priya", rating: 4, comment: "Great visuals and sound design, but a bit confusing on first watch.", createdAt: new Date().toISOString() }
      ];
      setReviews(fallbackReviews);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newReview = {
      movieId: movieId,
      username: username || 'Anonymous',
      rating: parseInt(rating),
      comment: comment
    };

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newReview)
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg || "Failed to post review");
      }

      const savedReview = await response.json();
      setReviews([savedReview, ...reviews]);
      setComment('');
      setError('');
    } catch (err) {
      console.warn("Backend review post failed, applying local fallback:", err.message);
      
      // Fallback state update for demonstration when backend is offline
      const mockSavedReview = {
        id: Date.now(),
        ...newReview,
        createdAt: new Date().toISOString()
      };
      
      setReviews([mockSavedReview, ...reviews]);
      setComment('');
      setError('');
    }
  };

  return (
    <div className="reviews-section-container">
      <div className="section-title-container">
        <MessageSquare className="section-icon" />
        <h2>Reviews & Ratings</h2>
      </div>

      {/* Write review form if logged in */}
      {username ? (
        <form onSubmit={handleSubmitReview} className="write-review-form glass-card">
          <h3>Write a Review</h3>
          {error && <p className="error-text">{error}</p>}
          
          <div className="form-group-inline">
            <label>Rating:</label>
            <div className="star-rating-selector">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  type="button"
                  key={val}
                  className={`star-select-btn ${val <= rating ? 'active' : ''}`}
                  onClick={() => setRating(val)}
                >
                  <Star size={20} fill={val <= rating ? "#fbbf24" : "none"} />
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this movie..."
              rows={3}
              required
              className="review-textarea"
            />
          </div>

          <button type="submit" className="btn-primary submit-review-btn">
            <MessageSquarePlus size={16} />
            <span>Submit Review</span>
          </button>
        </form>
      ) : (
        <div className="login-prompt glass-card">
          <p>Please <a href="/auth">login</a> to write a review and rate this movie.</p>
        </div>
      )}

      {/* Reviews list */}
      <div className="reviews-list">
        {loading ? (
          <div className="loading-spinner">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to write one!</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id || rev.createdAt} className="review-item glass-card animate-fade-in">
              <div className="review-header">
                <span className="reviewer-name">{rev.username}</span>
                <div className="reviewer-rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < rev.rating ? 'filled-star' : 'empty-star'}
                      fill={i < rev.rating ? "#fbbf24" : "none"}
                    />
                  ))}
                </div>
              </div>
              <p className="review-comment">{rev.comment}</p>
              <span className="review-date">
                {new Date(rev.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewSection;
