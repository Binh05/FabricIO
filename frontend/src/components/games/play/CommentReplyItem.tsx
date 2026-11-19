import { CornerUpLeft } from "lucide-react";
import type { Comment } from "@/types/Comment";
import { CommentContent } from "./CommentContent";
import { formatTimeAgo } from "./commentUtils";
import UserAvatar from "@/components/layouts/UserAvatar";

interface CommentReplyItemProps {
  reply: Comment;
  parentCommentId?: string;
  onReply?: (username: string) => void;
}

export const CommentReplyItem = ({
  reply,
  parentCommentId,
  onReply,
}: CommentReplyItemProps) => {
  const authorName = reply.author.fullName || reply.author.username;

  return (
    <div
      id={`reply-${reply.id}`}
      data-comment-username={reply.author.username}
      className="rounded-md border-l-2 border-rose-500 bg-surface-container/70 p-3 sm:p-3.5 transition-all"
    >
      <div className="flex items-start gap-2.5 sm:gap-3">
        
            <UserAvatar
              type="header"
              avatarUrl={reply?.author?.avatarUrl}
              name={authorName}
            />

        {/* Thông tin phản hồi */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-x-2 text-xs sm:text-sm">
            <span className="font-semibold text-rose-400">
              {authorName}
            </span>
            <span className="text-muted-foreground text-xs">
              {formatTimeAgo(reply.createdAt)}
            </span>
          </div>

          {/* Nội dung tô màu @username và scroll tới id của tag */}
          <CommentContent
            content={reply.content}
            targetCommentId={parentCommentId}
          />

          {onReply && (
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => onReply(reply.author.username)}
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <CornerUpLeft size={13} />
                <span>Trả lời</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
