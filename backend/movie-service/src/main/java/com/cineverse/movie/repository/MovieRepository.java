package com.cineverse.movie.repository;

import com.cineverse.movie.model.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends MongoRepository<Movie, String> {
    List<Movie> findByGenreContainingIgnoreCase(String genre);
    List<Movie> findByTitleContainingIgnoreCase(String title);
}
