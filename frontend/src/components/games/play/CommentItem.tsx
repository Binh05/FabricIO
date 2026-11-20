import { useState } from "react";
import { CornerUpLeft, MoreVertical, ThumbsUp, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useComment } from "@/hooks/useComment";
import { useAuth } from "@/hooks/useAuth";
import type { Comment } from "@/types/Comment";
import { CommentComposer } from "./CommentComposer";
import { CommentContent } from "./CommentContent";
import { CommentReplyItem } from "./CommentReplyItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  formatTimeAgo,
  getAvatarBgColor,
  getAvatarInitials,
} from "@/lib/commentUtils.ts";

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  const { user } = useAuth();
  const { repliesByComment, loadingReplies, fetchReplies, createReply, deleteComment, toggleLike, togglingLikes } =
    useComment();
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
      data-comment-username={comment.author.username}
      className="border-border-subtle/50 bg-surface-container-low rounded-md border transition-all"
    >
      <div id={`comment-${comment.id}`} className="rounded-md p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md text-sm font-bold select-none sm:size-11 sm:text-base",
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
              <div className="flex items-center gap-2">
                <span className="text-foreground text-sm leading-tight font-semibold sm:text-base">
                  {authorName}
                </span>
                <span className="text-muted-foreground mt-1 text-xs">
                  {formatTimeAgo(comment.createdAt)}
                </span>
              </div>
              <span className="text-muted-foreground text-xs font-semibold md:text-base">
                @{comment.author.username}
              </span>
            </div>
          </div>
          {user?.id === comment.author.id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Tùy chọn bình luận"
                  className="text-muted-foreground hover:text-foreground cursor-pointer rounded-sm p-1 transition-colors"
                >
                  <MoreVertical size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-36">
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => void deleteComment(comment.id)}
                >
                  <Trash2 />
                  Xóa bình luận
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <CommentContent content={comment.content} />
        <div className="mt-3.5 flex flex-wrap items-center gap-4 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => void toggleLike(comment.id)}
            disabled={togglingLikes[comment.id]}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
              comment.likedByMe
                ? "text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-label={comment.likedByMe ? "Bỏ thích bình luận" : "Thích bình luận"}
          >
            <ThumbsUp size={15} />
            <span>{comment.likeCount ?? 0}</span>
          </button>
          <button
            type="button"
            onClick={() => handleStartReply(comment.author.username)}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 font-medium transition-colors"
          >
            <CornerUpLeft size={15} />
            <span>Trả lời</span>
          </button>
          {comment.replyCount > 0 && (
            <button
              type="button"
              onClick={() => void toggleReplies()}
              aria-label={showReplies ? "Ẩn phản hồi" : "Hiện phản hồi"}
              className="text-secondary-foreground ml-auto cursor-pointer font-medium transition-colors hover:underline"
            >
              {showReplies ? "Ẩn phản hồi" : `${comment.replyCount} phản hồi`}
            </button>
          )}
        </div>
      </div>

      <div className="px-4 pt-0 pb-4 sm:px-5 sm:pb-5">
        {showComposer && (
          <div className="border-border-subtle/50 mt-3.5 border-t pt-3">
            <CommentComposer
              key={replyTargetUser}
              placeholder={`Trả lời @${replyTargetUser}...`}
              initialValue={`@${replyTargetUser} `}
              submitLabel="Gửi phản hồi"
              onCancel={() => setShowComposer(false)}
              onSubmit={async (content) => {
                await createReply(comment.id, comment.id, content);
                setShowReplies(true);
                setShowComposer(false);
              }}
            />
          </div>
        )}
        {showReplies && (
          <div
            className={cn(
              "mt-1 space-y-2.5 sm:pl-5",
              showReplies && replies?.items.length > 0 && "pb-4 sm:pb-5",
            )}
          >
            {loadingReplies[comment.id] && !replies ? (
              <p className="text-muted-foreground text-xs sm:text-sm">
                Đang tải phản hồi...
              </p>
            ) : null}
            {replies?.items.map((reply) => (
              <CommentReplyItem
                key={reply.id}
                reply={reply}
                parentCommentId={comment.id}
              />
            ))}
            {replies?.hasMore && (
              <button
                type="button"
                onClick={() => void fetchReplies(comment.id)}
                disabled={loadingReplies[comment.id]}
                className="text-secondary-foreground text-xs font-medium hover:underline disabled:opacity-60 sm:text-sm"
              >
                {loadingReplies[comment.id]
                  ? "Đang tải..."
                  : "Xem thêm phản hồi"}
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
