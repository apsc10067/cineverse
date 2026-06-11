package com.cineverse.movie.service;

import com.cineverse.movie.model.Movie;
import com.cineverse.movie.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class MovieService {

    @Autowired(required = false)
    private MovieRepository movieRepository;

    @Value("${dev.mode:true}")
    private boolean devMode;

    // In-memory store for fallback mode
    private final ConcurrentHashMap<String, Movie> inMemoryDb = new ConcurrentHashMap<>();

    @PostConstruct
    public void seedMockMovies() {
        List<Movie> mockMovies = Arrays.asList(
            new Movie("1", "Inception", "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.", "Sci-Fi", 8.8, 148, "2010-07-16", "English",
                      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60", 
                      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80", 
                      Arrays.asList("Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"), Arrays.asList("10:00 AM", "01:15 PM", "04:30 PM", "07:45 PM", "10:30 PM")),
            new Movie("2", "Interstellar", "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", "Sci-Fi", 8.6, 169, "2014-11-07", "English",
                      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60", 
                      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80", 
                      Arrays.asList("Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"), Arrays.asList("11:30 AM", "03:00 PM", "06:15 PM", "09:30 PM")),
            new Movie("3", "The Dark Knight", "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.", "Action", 9.0, 152, "2008-07-18", "English",
                      "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&auto=format&fit=crop&q=60", 
                      "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&auto=format&fit=crop&q=80", 
                      Arrays.asList("Christian Bale", "Heath Ledger", "Aaron Eckhart"), Arrays.asList("09:00 AM", "12:15 PM", "03:30 PM", "06:45 PM", "10:00 PM")),
            new Movie("4", "Avatar: The Way of Water", "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.", "Adventure", 7.6, 192, "2022-12-16", "English",
                      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60", 
                      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80", 
                      Arrays.asList("Sam Worthington", "Zoe Saldana", "Sigourney Weaver"), Arrays.asList("10:30 AM", "02:15 PM", "06:00 PM", "09:45 PM")),
            new Movie("5", "Spirited Away", "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.", "Animation", 8.6, 125, "2001-07-20", "English",
                      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=60", 
                      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80", 
                      Arrays.asList("Rumi Hiiragi", "Miyu Irino", "Mari Natsuki"), Arrays.asList("01:00 PM", "04:00 PM", "07:00 PM")),
            new Movie("6", "Jawan", "A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society.", "Action", 8.4, 169, "2023-09-07", "Hindi",
                      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&auto=format&fit=crop&q=60", 
                      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1200&auto=format&fit=crop&q=80", 
                      Arrays.asList("Shah Rukh Khan", "Nayanthara", "Vijay Sethupathi"), Arrays.asList("11:00 AM", "02:30 PM", "06:00 PM", "09:30 PM")),
            new Movie("7", "Pathaan", "An Indian agent can stop a mercenary group from releasing a deadly virus in the country.", "Action", 7.8, 146, "2023-01-25", "Hindi",
                      "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&auto=format&fit=crop&q=60", 
                      "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1200&auto=format&fit=crop&q=80", 
                      Arrays.asList("Shah Rukh Khan", "Deepika Padukone", "John Abraham"), Arrays.asList("12:00 PM", "03:15 PM", "07:30 PM", "10:45 PM")),
            new Movie("8", "3 Idiots", "Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently.", "Comedy", 8.8, 170, "2009-12-25", "Hindi",
                      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=60", 
                      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80", 
                      Arrays.asList("Aamir Khan", "R. Madhavan", "Sharman Joshi"), Arrays.asList("10:00 AM", "01:30 PM", "05:00 PM", "08:30 PM")),
            new Movie("9", "Brahmastra", "A young man on the brink of love and life has his world turned upside down when he discovers he has a superpower connection to fire and a great destiny.", "Fantasy", 7.2, 167, "2022-09-09", "Hindi",
                      "https://images.unsplash.com/photo-1460881680858-30d872d5b530?w=500&auto=format&fit=crop&q=60", 
                      "https://images.unsplash.com/photo-1460881680858-30d872d5b530?w=1200&auto=format&fit=crop&q=80", 
                      Arrays.asList("Ranbir Kapoor", "Alia Bhatt", "Amitabh Bachchan"), Arrays.asList("11:15 AM", "03:45 PM", "07:00 PM", "10:15 PM"))
        );

        mockMovies.forEach(m -> inMemoryDb.put(m.getId(), m));
        System.out.println("CineVerse Movie Service: Seeded " + inMemoryDb.size() + " mock movies in memory.");
    }

    @Cacheable(value = "movies")
    public List<Movie> getAllMovies() {
        System.out.println(">>> Cache Miss: Fetching all movies from database/in-memory...");
        if (devMode || movieRepository == null) {
            return new ArrayList<>(inMemoryDb.values());
        }
        try {
            return movieRepository.findAll();
        } catch (Exception e) {
            System.err.println("Failed to connect to MongoDB, using fallback list: " + e.getMessage());
            return new ArrayList<>(inMemoryDb.values());
        }
    }

    @Cacheable(value = "movies", key = "#id")
    public Movie getMovieById(String id) {
        System.out.println(">>> Cache Miss: Fetching movie detail for ID: " + id);
        if (devMode || movieRepository == null) {
            return inMemoryDb.get(id);
        }
        try {
            return movieRepository.findById(id).orElse(inMemoryDb.get(id));
        } catch (Exception e) {
            return inMemoryDb.get(id);
        }
    }

    public List<Movie> getMoviesByGenre(String genre) {
        if (devMode || movieRepository == null) {
            return inMemoryDb.values().stream()
                    .filter(m -> m.getGenre().equalsIgnoreCase(genre))
                    .collect(Collectors.toList());
        }
        try {
            return movieRepository.findByGenreContainingIgnoreCase(genre);
        } catch (Exception e) {
            return inMemoryDb.values().stream()
                    .filter(m -> m.getGenre().equalsIgnoreCase(genre))
                    .collect(Collectors.toList());
        }
    }

    @CacheEvict(value = "movies", allEntries = true)
    public Movie saveMovie(Movie movie) {
        if (movie.getId() == null) {
            movie.setId(String.valueOf(inMemoryDb.size() + 1));
        }
        inMemoryDb.put(movie.getId(), movie);
        
        if (!devMode && movieRepository != null) {
            try {
                return movieRepository.save(movie);
            } catch (Exception e) {
                System.err.println("MongoDB save failed, stored in-memory only: " + e.getMessage());
            }
        }
        return movie;
    }

    @CacheEvict(value = "movies", allEntries = true)
    public void deleteMovie(String id) {
        inMemoryDb.remove(id);
        if (!devMode && movieRepository != null) {
            try {
                movieRepository.deleteById(id);
            } catch (Exception e) {
                System.err.println("MongoDB delete failed: " + e.getMessage());
            }
        }
    }
}
