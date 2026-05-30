package fabricio.backend.modules.games.entities;

import fabricio.backend.shared.base.BaseEntity;
import fabricio.backend.shared.enums.MediaType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "game_media",
    indexes = {
        @Index(name = "idx_game_media_game_id", columnList = "game_id")
    }
)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GameMedia extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @Column(name = "game_id", nullable = false)
    private Game gameId;

    @Column(name = "media_url", nullable = false)
    private String mediaUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "media_type", nullable = false)
    private MediaType mediaType = MediaType.Image;

    @Column(nullable = false)
    @Builder.Default
    private int sortOrder = 0;
}
