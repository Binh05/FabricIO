package fabricio.backend.comment.application.query;

import fabricio.backend.comment.application.query.dto.CommentAuthor;
import fabricio.backend.comment.application.query.dto.CommentView;
import fabricio.backend.comment.domain.Comment;
import fabricio.backend.comment.domain.CommentRepository;
import fabricio.backend.shared.base.CursorResponse;
import fabricio.backend.shared.common.CursorCodec;
import fabricio.backend.shared.common.CursorPayload;
import fabricio.backend.users.UserApi;
import fabricio.backend.users.UserSummary;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class CommentQueryService {
    private final CommentRepository commentRepository;
    private final UserApi userApi;
    private final CursorCodec cursorCodec;

    public CommentQueryService(
            CommentRepository commentRepository,
            UserApi userApi,
            CursorCodec cursorCodec
    ) {
        this.commentRepository = commentRepository;
        this.userApi = userApi;
        this.cursorCodec = cursorCodec;
    }

    public CursorResponse<CommentView> getRootComments(UUID gameId, int size, String cursor) {
        return getPage(size, cursor, limit -> commentRepository.findFirstPage(gameId, page(limit)),
                (payload, limit) -> commentRepository.findNextPage(gameId, payload.createdAt(), payload.id(), page(limit)));
    }

    public CursorResponse<CommentView> getReplies(UUID commentId, int size, String cursor) {
        return getPage(size, cursor, limit -> commentRepository.findReplies(commentId, page(limit)),
                (payload, limit) -> commentRepository.findNextReplies(commentId, payload.createdAt(), payload.id(), page(limit)));
    }

    private CursorResponse<CommentView> getPage(
            int requestedSize,
            String cursor,
            PageSupplier firstPage,
            NextPageSupplier nextPage
    ) {
        int size = Math.max(1, Math.min(requestedSize, 50));
        List<Comment> fetched;
        if (cursor == null || cursor.isBlank()) {
            fetched = firstPage.get(size);
        } else {
            fetched = nextPage.get(cursorCodec.decode(cursor), size);
        }

        boolean hasMore = fetched.size() > size;
        List<Comment> comments = hasMore ? fetched.subList(0, size) : fetched;
        String nextCursor = null;
        if (hasMore && !comments.isEmpty()) {
            Comment last = comments.get(comments.size() - 1);
            nextCursor = cursorCodec.encode(new CursorPayload(last.getCreatedAt(), last.getId()));
        }

        Map<UUID, UserSummary> authors = userApi.getAuthorsByIds(
                comments.stream().map(Comment::getUserId).toList()
        );
        List<CommentView> result = comments.stream()
                .map(comment -> CommentView.from(
                        comment,
                        CommentAuthor.fromSummary(authors.get(comment.getUserId()))
                ))
                .toList();
        return CursorResponse.from(result, hasMore, nextCursor);
    }

    private Pageable page(int size) {
        return PageRequest.of(0, size + 1);
    }

    @FunctionalInterface
    private interface PageSupplier {
        List<Comment> get(int size);
    }

    @FunctionalInterface
    private interface NextPageSupplier {
        List<Comment> get(CursorPayload payload, int size);
    }
}
