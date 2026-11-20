import { CornerUpLeft, MoreVertical, ThumbsUp, Trash2 } from "lucide-react";
import { useState } from "react";
import { useComment } from "@/hooks/useComment";
import { useAuth } from "@/hooks/useAuth";
import type { Comment } from "@/types/Comment";
import { CommentComposer } from "./CommentComposer";
import { CommentContent } from "./CommentContent";
import { formatTimeAgo } from "@/lib/commentUtils.ts";
import UserAvatar from "@/components/layouts/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CommentReplyItemProps {
  reply: Comment;
  parentCommentId: string;
}

export const CommentReplyItem = ({
  reply,
  parentCommentId,
}: CommentReplyItemProps) => {
  const { user } = useAuth();
  const { createReply, deleteReply, toggleLike, togglingLikes } = useComment();
  const [showComposer, setShowComposer] = useState(false);
  const authorName = reply.author.fullName || reply.author.username;

  return (
    <div
      id={`reply-${reply.id}`}
      data-comment-username={reply.author.username}
      className="border-primary/70 bg-surface-container/70 rounded-sm border-l-2 p-3 transition-all sm:p-3.5"
    >
      <div className="flex items-start gap-2.5 sm:gap-3">
        <UserAvatar
          type="header"
          avatarUrl={reply?.author?.avatarUrl}
          name={authorName}
        />

        {/* Thông tin phản hồi */}
        <div className="-mt-1 min-w-0 flex-1">
          <div className="flex w-full items-start justify-between gap-2">
            <div className="flex flex-col gap-x-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-primary font-semibold">{authorName}</span>
                <span className="text-muted-foreground text-xs">
                  {formatTimeAgo(reply.createdAt)}
                </span>
              </div>
              <span className="text-muted-foreground text-xs sm:text-sm">
                @{reply.author.username}
              </span>
            </div>
            {user?.id === reply.author.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Tùy chọn phản hồi"
                    className="text-muted-foreground hover:text-foreground cursor-pointer rounded-sm p-1 transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-36">
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => void deleteReply(reply.id, parentCommentId)}
                  >
                    <Trash2 />
                    Xóa phản hồi
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Nội dung tô màu @username và scroll tới id của tag */}
          <CommentContent
            content={reply.content}
            targetCommentId={reply.replyToCommentId ?? parentCommentId}
          />

          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => void toggleLike(reply.id)}
              disabled={togglingLikes[reply.id]}
              className={`inline-flex cursor-pointer items-center gap-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                reply.likedByMe
                  ? "text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label={reply.likedByMe ? "Bỏ thích phản hồi" : "Thích phản hồi"}
            >
              <ThumbsUp size={13} />
              <span>{reply.likeCount ?? 0}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowComposer(true)}
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-medium transition-colors"
            >
              <CornerUpLeft size={13} />
              <span>Trả lời</span>
            </button>
          </div>

          {showComposer && (
            <div className="border-border-subtle/50 mt-2.5 border-t pt-2.5">
              <CommentComposer
                placeholder={`Trả lời @${reply.author.username}...`}
                initialValue={`@${reply.author.username} `}
                submitLabel="Gửi phản hồi"
                onCancel={() => setShowComposer(false)}
                onSubmit={async (content) => {
                  await createReply(reply.id, parentCommentId, content);
                  setShowComposer(false);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
