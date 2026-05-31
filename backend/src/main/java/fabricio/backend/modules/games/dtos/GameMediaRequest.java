package fabricio.backend.modules.games.dtos;

import fabricio.backend.shared.enums.MediaType;
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
