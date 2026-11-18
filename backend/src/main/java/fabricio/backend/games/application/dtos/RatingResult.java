package fabricio.backend.games.application.dtos;

public record RatingResult(
    int stars,
    double avgRating,
    int ratingCount
) { }
