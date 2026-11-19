package fabricio.backend.shared.base;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CursorResponse<T> {
    private boolean hasMore;
    private String cursor;
    private List<T> content;

    public static <T> CursorResponse<T> from(List<T> content, boolean hasMore, String cursor) {
        return CursorResponse.<T>builder()
                .hasMore(hasMore)
                .cursor(cursor)
                .content(content)
                .build();
    }
}
