import { useState } from "react";
import { CornerUpLeft, MoreVertical, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useComment } from "@/hooks/useComment";
import type { Comment } from "@/types/Comment";
import { CommentComposer } from "./CommentComposer";
import { CommentContent } from "./CommentContent";
import { CommentReplyItem } from "./CommentReplyItem";
import { formatTimeAgo, getAvatarBgColor, getAvatarInitials } from "./commentUtils";

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  const {
    repliesByComment,
    loadingReplies,
    fetchReplies,
    createReply,
  } = useComment();
  const [showReplies, setShowReplies] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [replyTargetUser, setReplyTargetUser] = useState<string>("");

  const replies = repliesByComment[comment.id];
  const authorName = comment.author.fullName || comment.author.username;
  const initials = getAvatarInitials(authorName);
  const avatarBg = getAvatarBgColor(authorName);

  const toggleReplies = async () => {
    if (!showReplies && !replies) {
      await fetchReplies(comment.id, true);
    }
    setShowReplies((prev) => !prev);
  };

  const handleStartReply = (username: string) => {
    setReplyTargetUser(username);
    setShowComposer(true);
  };

  return (
    <article
      id={`comment-${comment.id}`}
      data-comment-username={comment.author.username}
      className="rounded-md border border-border-subtle/50 bg-surface-container-low p-4 sm:p-5 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "size-10 sm:size-11 shrink-0 overflow-hidden rounded-md flex items-center justify-center font-bold text-sm sm:text-base select-none",
              avatarBg,
            )}
          >
            {comment.author.avatarUrl ? (
              <img
                src={comment.author.avatarUrl}
                alt={authorName}
                className="size-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-semibold leading-tight text-foreground">
              {authorName}
            </span>
            <span className="mt-1 text-xs text-muted-foreground">
              {formatTimeAgo(comment.createdAt)}
            </span>
          </div>
        </div>

        <button
          type="button"
          aria-label="Tùy chọn"
          className="rounded-sm p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      <CommentContent content={comment.content} />

      <div className="mt-3.5 flex flex-wrap items-center gap-4 text-xs sm:text-sm">
        <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground select-none">
          <ThumbsUp size={15} />
          <span>{comment.likeCount ?? 0}</span>
        </span>

        <button
          type="button"
          onClick={() => handleStartReply(comment.author.username)}
          className="inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <CornerUpLeft size={15} />
          <span>Trả lời</span>
        </button>

        {comment.replyCount > 0 && (
          <button
            type="button"
            onClick={() => void toggleReplies()}
            className="ml-auto font-medium text-secondary-foreground hover:underline transition-colors"
          >
            {comment.replyCount} phản hồi
          </button>
        )}
      </div>

      {showComposer && (
        <div className="mt-3.5 border-t border-border-subtle/50 pt-3">
          <CommentComposer
            key={replyTargetUser}
            placeholder={`Trả lời @${replyTargetUser}...`}
            initialValue={`@${replyTargetUser} `}
            submitLabel="Gửi phản hồi"
            onCancel={() => setShowComposer(false)}
            onSubmit={async (content) => {
              await createReply(comment.id, content);
              setShowReplies(true);
              setShowComposer(false);
            }}
          />
        </div>
      )}

      {showReplies && (
        <div className="mt-4 space-y-2.5 sm:pl-3">
          {loadingReplies[comment.id] && !replies ? (
            <p className="text-xs sm:text-sm text-muted-foreground">Đang tải phản hồi...</p>
          ) : null}
          {replies?.items.map((reply) => (
            <CommentReplyItem
              key={reply.id}
              reply={reply}
              parentCommentId={comment.id}
              onReply={handleStartReply}
            />
          ))}
          {replies?.hasMore && (
            <button
              type="button"
              onClick={() => void fetchReplies(comment.id)}
              disabled={loadingReplies[comment.id]}
              className="text-xs sm:text-sm font-medium text-secondary-foreground hover:underline disabled:opacity-60"
            >
              {loadingReplies[comment.id] ? "Đang tải..." : "Xem thêm phản hồi"}
            </button>
          )}
        </div>
      )}
    </article>
  );
};
