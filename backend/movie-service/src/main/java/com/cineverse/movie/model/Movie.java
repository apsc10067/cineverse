package com.cineverse.movie.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.List;

@Document(collection = "movies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Movie implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    private String id;
    private String title;
    private String description;
    private String genre;
    private Double rating;
    private Integer durationMinutes;
    private String releaseDate;
    private String language; // e.g. "English", "Hindi"
    private String posterUrl;
    private String bannerUrl;
    private List<String> cast;
    private List<String> showtimes;
}
