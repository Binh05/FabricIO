package fabricio.backend.modules.games.entities;

import java.math.BigDecimal;
import java.time.Instant;

import fabricio.backend.modules.users.entities.User;
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

@Entity
@Getter
@Setter
@Builder
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
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User ownerId;
    
    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;
    private String thumbnailUrl;
    private String gameUrl;

    @Builder.Default
    private BigDecimal price = BigDecimal.ZERO;

    @Builder.Default
    @Column(nullable = false)
    private boolean isDeleted = false;

    private Instant deletedAt;
}
