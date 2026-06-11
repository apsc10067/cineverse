package com.cineverse.review.controller;

import com.cineverse.review.model.Review;
import com.cineverse.review.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Review>> getReviewsByMovieId(@PathVariable String movieId) {
        return ResponseEntity.ok(reviewService.getReviewsByMovieId(movieId));
    }

    @PostMapping
    public ResponseEntity<?> createReview(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Review review) {
        
        // Simulating Gateway JWT check or local verification
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Error: Unauthorized! Missing or invalid JWT authorization header.");
        }
        
        // Extracting username (simple demo parsing)
        String token = authHeader.substring(7);
        if (token.isEmpty() || token.equals("null")) {
            return ResponseEntity.status(401).body("Error: Invalid Token");
        }

        try {
            Review savedReview = reviewService.saveReview(review);
            return ResponseEntity.ok(savedReview);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
