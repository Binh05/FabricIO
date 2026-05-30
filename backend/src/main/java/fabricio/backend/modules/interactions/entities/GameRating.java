package fabricio.backend.modules.interactions.entities;

import fabricio.backend.modules.games.entities.Game;
import fabricio.backend.modules.users.entities.User;
import fabricio.backend.shared.base.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

@Entity
@Table(
    name = "game_ratings",
    uniqueConstraints = {
        // Mỗi user chỉ rating một game 1 lần
        @UniqueConstraint(name = "uq_game_ratings_game_user", columnNames = {"game_id", "user_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameRating extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Min(1)
    @Max(5)
    @Column(nullable = false)
    private int stars;

    // Nhận xét tùy chọn kèm theo rating
    @Column(columnDefinition = "TEXT")
    private String review;
}
