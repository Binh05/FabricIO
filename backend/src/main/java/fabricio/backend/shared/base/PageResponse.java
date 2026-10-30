package fabricio.backend.shared.base;

import java.util.List;
import java.util.function.Function;

import org.springframework.data.domain.Page;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {
    private List<T> content;
    private int pageNumber;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean isLast;

    public static <T> PageResponse<T> from(Page<T> page) {
        return PageResponse.<T>builder()
            .content(page.getContent())
            .pageNumber(page.getNumber())
            .pageSize(page.getSize())
            .totalElements(page.getTotalElements())
            .totalPages(page.getTotalPages())
            .isLast(page.isLast())
            .build();
    }

    public static <T, R> PageResponse<R> from(Page<T> page, List<R> content) {
        return PageResponse.<R>builder()
            .content(content)
            .pageNumber(page.getNumber())
            .pageSize(page.getSize())
            .totalElements(page.getTotalElements())
            .totalPages(page.getTotalPages())
            .isLast(page.isLast())
            .build();
    }

    public <R> PageResponse<R> map(Function<T, R> converter) {
        List<R> mappedContent = this.content.stream()
                .map(converter)
                .toList();

        return PageResponse.<R>builder()
                .content(mappedContent)
                .pageNumber(this.pageNumber)
                .pageSize(this.pageSize)
                .totalElements(this.totalElements)
                .totalPages(this.totalPages)
                .isLast(this.isLast)
                .build();
    }
}
