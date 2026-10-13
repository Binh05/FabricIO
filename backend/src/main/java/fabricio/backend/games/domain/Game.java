package fabricio.backend.games.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import fabricio.backend.shared.enums.ErrorCode;
import fabricio.backend.shared.exceptions.AppException;
import fabricio.backend.users.domain.User;
import fabricio.backend.shared.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Index;
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

    public boolean isOwnedBy(UUID userId) {
        return ownerId.equals(userId);
    }

    public void assertOwnedBy(UUID userId) {
        if (!isOwnedBy(userId)) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }
    }
}
