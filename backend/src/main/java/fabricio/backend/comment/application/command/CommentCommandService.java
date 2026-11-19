package fabricio.backend.comment.application.command;

import fabricio.backend.comment.application.command.dto.CreateCommentCommand;
import fabricio.backend.comment.application.command.dto.CommentAuthor;
import fabricio.backend.comment.application.command.dto.CreateCommentResult;
import fabricio.backend.comment.domain.Comment;
import fabricio.backend.comment.domain.CommentRepository;
import fabricio.backend.comment.domain.exception.CommentErrorCode;
import fabricio.backend.comment.domain.exception.CommentException;
import fabricio.backend.games.GameApi;
import fabricio.backend.users.UserApi;
import fabricio.backend.users.UserSummary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    private CreateCommentResult resultWithAuthor(Comment comment) {
        UserSummary author = userApi.getAuthorsByIds(java.util.List.of(comment.getUserId())).get(comment.getUserId());
        return CreateCommentResult.fromComment(comment, CommentAuthor.fromSummary(author));
    }
}
