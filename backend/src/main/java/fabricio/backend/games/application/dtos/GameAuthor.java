package fabricio.backend.games.application.dtos;

import java.util.UUID;

public record GameAuthor(
    UUID id,
    String fullName,
    String avatarUrl
) {}