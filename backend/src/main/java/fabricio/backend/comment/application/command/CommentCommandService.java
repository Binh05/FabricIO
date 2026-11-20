package fabricio.backend.comment.application.command;

import fabricio.backend.comment.application.command.dto.CreateCommentCommand;
import fabricio.backend.comment.application.command.dto.CommentAuthor;
import fabricio.backend.comment.application.command.dto.CreateCommentResult;
import fabricio.backend.comment.application.command.dto.DeleteReplyResult;
import fabricio.backend.comment.domain.Comment;
import fabricio.backend.comment.domain.CommentRepository;
import fabricio.backend.comment.domain.exception.CommentErrorCode;
import fabricio.backend.comment.domain.exception.CommentException;
import fabricio.backend.games.GameApi;
import fabricio.backend.users.UserApi;
import fabricio.backend.users.UserSummary;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class CommentCommandService {
    private final CommentRepository commentRepository;
    private final GameApi gameApi;
    private final UserApi userApi;

    public CommentCommandService(CommentRepository commentRepository, GameApi gameApi, UserApi userApi) {
        this.commentRepository = commentRepository;
        this.gameApi = gameApi;
        this.userApi = userApi;
    }

    public CreateCommentResult createComment(CreateCommentCommand command) {
        if (command.parentId() == null) {
            gameApi.requireExists(command.gameId());
            Comment comment = Comment.createRoot(command.userId(), command.gameId(), command.content());
            commentRepository.save(comment);
            return resultWithAuthor(comment);
        }

        Comment parent = commentRepository.findById(command.parentId())
                .orElseThrow(() -> new CommentException(CommentErrorCode.COMMENT_NOT_FOUND));
        Comment target = commentRepository.findById(command.replyToCommentId())
                .orElseThrow(() -> new CommentException(CommentErrorCode.COMMENT_NOT_FOUND));
        Comment reply = Comment.createReply(
                command.userId(),
                parent.getGameId(),
                parent.getId(),
                target.getId(),
                command.content()
        );
        commentRepository.save(reply);
        commentRepository.incrementReplyCount(reply.getParentId());
        return resultWithAuthor(reply);
    }

    @Nullable
    @Transactional
    public DeleteReplyResult deleteReply(UUID replyId, UUID userId) {
        Comment reply = commentRepository.findById(replyId)
                .orElse(null);
        if (reply == null) return null;

        if (reply.getParentId() == null) throw new CommentException(CommentErrorCode.REPLY_INVALID_ID);
        if (!reply.getUserId().equals(userId)) throw new CommentException(CommentErrorCode.ACCESS_DENIED);

        int deletedRows = commentRepository.deleteReplyById(replyId, userId);
        if (deletedRows > 0) {
            Integer updatedCount = commentRepository.decrementReplyCount(reply.getParentId());
            int replyCount = updatedCount != null ? updatedCount : 0;
            return new DeleteReplyResult(reply.getParentId(), replyCount);
        }

        int replyCount = commentRepository.findReplyCountById(reply.getParentId()).orElse(0);
        return new DeleteReplyResult(reply.getParentId(), replyCount);
    }

    @Transactional
    public void deleteComments(UUID commentId, UUID userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseGet(() -> null);
        if (comment == null ) return;

        if (comment.getParentId() != null) {
            throw new CommentException(CommentErrorCode.COMMENT_INVALID_ID);
        }
        if (!comment.getUserId().equals(userId)) {
            throw new CommentException(CommentErrorCode.ACCESS_DENIED);
        }

        commentRepository.deleteRootCommentById(commentId, userId);
    }

    private CreateCommentResult resultWithAuthor(Comment comment) {
        UserSummary author = userApi.getAuthorsByIds(java.util.List.of(comment.getUserId())).get(comment.getUserId());
        return CreateCommentResult.fromComment(comment, CommentAuthor.fromSummary(author));
    }
}
