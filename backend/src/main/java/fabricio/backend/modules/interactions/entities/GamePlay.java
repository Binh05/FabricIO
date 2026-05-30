package fabricio.backend.modules.interactions.entities;

import fabricio.backend.modules.games.entities.Game;
import fabricio.backend.modules.users.entities.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "game_plays",
    indexes = {
        // "user đã chơi game nào"
        @Index(name = "idx_game_plays_user_game", columnList = "user_id, game_id"),
        // "game được chơi nhiều nhất theo thời gian"
        @Index(name = "idx_game_plays_game_time", columnList = "game_id, played_at")
    }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GamePlay {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    // Thời gian chơi trong session (giây), nullable nếu chưa kết thúc session
    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @CreatedDate
    @Column(name = "played_at", nullable = false, updatable = false)
    private Instant playedAt;
}
