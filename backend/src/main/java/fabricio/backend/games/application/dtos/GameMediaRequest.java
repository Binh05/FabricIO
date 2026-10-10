package fabricio.backend.games.application.dtos;

import fabricio.backend.games.domain.MediaType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameMediaRequest {
    private String mediaUrl;
    private MediaType mediaType;
    private int sortOrder;
}
