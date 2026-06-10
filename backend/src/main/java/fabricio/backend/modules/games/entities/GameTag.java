package fabricio.backend.modules.games.entities;

import jakarta.persistence.*;
import lombok.*;

import fabricio.backend.shared.base.BaseEntity;

@Entity
@Table(
    name = "game_tags",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_game_tags_name", columnNames = "name")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameTag extends BaseEntity {

    @Column(nullable = false, unique = true, length = 100)
    private String name;
}
