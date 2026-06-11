package com.cineverse.review.service;

import com.cineverse.review.model.Review;
import com.cineverse.review.repository.ReviewRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired(required = false)
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @PostConstruct
    public void seedMockReviews() {
        if (reviewRepository.count() == 0) {
            List<Review> mockReviews = new ArrayList<>();
            mockReviews.add(new Review(null, "1", "Aman", 5, "Absolutely mind-bending! Christopher Nolan is a genius.", LocalDateTime.now()));
            mockReviews.add(new Review(null, "1", "Priya", 4, "Great visuals and sound design, but a bit confusing on first watch.", LocalDateTime.now()));
            mockReviews.add(new Review(null, "2", "Rahul", 5, "My favorite movie of all time. The soundtrack by Hans Zimmer is spectacular.", LocalDateTime.now()));
            mockReviews.add(new Review(null, "3", "Vikram", 5, "Heath Ledger's performance is legendary. A masterpiece.", LocalDateTime.now()));
            
            reviewRepository.saveAll(mockReviews);
            System.out.println("CineVerse Review Service: Seeded mock reviews.");
        }
    }

    public List<Review> getReviewsByMovieId(String movieId) {
        return reviewRepository.findByMovieId(movieId);
    }

    public Review saveReview(Review review) {
        Review savedReview = reviewRepository.save(review);
        
        // Asynchronous Notification Flow
        publishReviewEvent(savedReview);

        return savedReview;
    }

    private void publishReviewEvent(Review review) {
        // Send to RabbitMQ if template is active (production profile)
        if (rabbitTemplate != null) {
            try {
                rabbitTemplate.convertAndSend("review-exchange", "review.routing.key", review);
                System.out.println("[RabbitMQ] Successfully dispatched async review event: Movie ID " 
                        + review.getMovieId() + " rated " + review.getRating() + " stars by " + review.getUsername());
                return;
            } catch (Exception e) {
                System.err.println("[RabbitMQ] Failed to dispatch event, falling back to local handler: " + e.getMessage());
            }
        }
        
        // Local Fallback Event Publishing (Dev Mode)
        eventPublisher.publishEvent(new ReviewPostedEvent(this, review));
    }

    // Local Event class to mock RabbitMQ behavior
    public static class ReviewPostedEvent extends ApplicationEvent {
        private final Review review;
        
        public ReviewPostedEvent(Object source, Review review) {
            super(source);
            this.review = review;
        }

        public Review getReview() {
            return review;
        }
    }

    // Consumer mockup - listens to events and simulates background rating processing
    @EventListener
    public void handleReviewEvent(ReviewPostedEvent event) {
        Review review = event.getReview();
        System.out.println("[Async Consumer Mock] Received review event: User '" 
                + review.getUsername() + "' posted a review for Movie ID " + review.getMovieId() 
                + ". Updating aggregate rating metrics in background...");
    }
}
