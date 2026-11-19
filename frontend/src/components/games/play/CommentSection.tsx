import { useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useComment } from "@/hooks/useComment";
import { CommentComposer } from "./CommentComposer";
import { CommentItem } from "./CommentItem";

interface CommentSectionProps {
  gameId: string;
}

export const CommentSection = ({ gameId }: CommentSectionProps) => {
  const { token } = useAuth();
  const { commentsByGame, loading, fetchComments, createComment } = useComment();
  const page = commentsByGame[gameId];

  useEffect(() => {
    void fetchComments(gameId, true);
  }, [fetchComments, gameId]);

  return (
    <section aria-label="Bình luận trò chơi" className="space-y-4">
      {token ? (
        <div className="rounded-md border border-border-subtle/50 bg-surface-container-low p-4 sm:p-5">
          <h2 className="mb-3 text-sm sm:text-base font-bold text-foreground">
            Bình luận ({page?.items.length ?? 0})
          </h2>
          <CommentComposer
            placeholder="Chia sẻ cảm nhận, mẹo chơi hoặc phản hồi của bạn..."
            submitLabel="Đăng bình luận"
            onSubmit={async (content) => {
              await createComment(gameId, content);
            }}
          />
        </div>
      ) : (
        <div className="rounded-md border border-border-subtle/50 bg-surface-container-low p-4 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Đăng nhập để tham gia bình luận và thảo luận cùng cộng đồng.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {loading && !page ? (
          <div className="rounded-md bg-surface-container-low p-6 text-center text-xs sm:text-sm text-muted-foreground">
            Đang tải bình luận...
          </div>
        ) : null}

        {!loading && page?.items.length === 0 ? (
          <div className="rounded-md bg-surface-container-low p-6 text-center text-xs sm:text-sm text-muted-foreground">
            Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nhận!
          </div>
        ) : null}

        {page?.items.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {page?.hasMore && (
        <button
          type="button"
          onClick={() => void fetchComments(gameId)}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border-subtle/50 bg-surface-container hover:bg-surface-container-high py-3 px-4 text-xs sm:text-sm font-semibold text-foreground transition-colors disabled:opacity-60"
        >
          <span>{loading ? "Đang tải bình luận..." : "Xem thêm bình luận"}</span>
          <ChevronDown size={16} />
        </button>
      )}
    </section>
  );
};
