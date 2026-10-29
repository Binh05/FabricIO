package fabricio.backend.games.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import fabricio.backend.shared.exceptions.ErrorCode;
import fabricio.backend.shared.exceptions.AppException;
import fabricio.backend.shared.base.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@SuperBuilder
@Table(
    name = "games",
    indexes = {
        @Index(name = "idx_games_owner_id",  columnList = "owner_id"),
        @Index(name = "idx_games_is_deleted", columnList = "is_deleted")
    }
)
@NoArgsConstructor
@AllArgsConstructor
public class Game extends BaseEntity {

    @JoinColumn(name = "owner_id", nullable = false)
    private UUID ownerId;
    
    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;
    private String thumbnailUrl;
    private String gameUrl;

    @Column
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private GameStatus status = GameStatus.Draft;

    @Builder.Default
    private BigDecimal price = BigDecimal.ZERO;

    @Column()
    private int avgRating;

    @Column()
    private int ratingCount;

    @Builder.Default
    @Column(nullable = false)
    private boolean isDeleted = false;

    private Instant deletedAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name= "game_tag_map",
            joinColumns = @JoinColumn(name="game_id"),
            inverseJoinColumns = @JoinColumn(name="tag_id")
    )
    private Set<GameTag> tags = new HashSet<>();

    public boolean isOwnedBy(UUID userId) {
        return ownerId.equals(userId);
    }

    public void assertOwnedBy(UUID userId) {
        if (!isOwnedBy(userId)) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }
    }

    public static Game createDraft(
            UUID ownerId,
            String title,
            String description,
            BigDecimal price,
            Set<GameTag> tags
    ) {
        Game game = new Game();
        game.setOwnerId(ownerId);
        game.setTitle(title);
        game.setDescription(description);
        game.setPrice(price);
        game.setStatus(GameStatus.Draft);
        if (tags != null && !tags.isEmpty()) {
            game.tags.addAll(tags);
        }
        return game;
    }
}
