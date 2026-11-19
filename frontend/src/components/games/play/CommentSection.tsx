import { useEffect, useRef } from "react";
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
  const { commentsByGame, loading, fetchComments, createComment } =
    useComment();
  const page = commentsByGame[gameId];
  const sectionRef = useRef<HTMLElement>(null);
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    hasRequestedRef.current = false;
    const section = sectionRef.current;
    if (!section || page) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRequestedRef.current) {
          hasRequestedRef.current = true;
          void fetchComments(gameId, true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [fetchComments, gameId, page]);

  return (
    <section
      ref={sectionRef}
      aria-label="Bình luận trò chơi"
      className="space-y-4"
    >
      {token ? (
        <div className="border-border-subtle/50 bg-surface-container-low rounded-md border p-4 sm:p-5">
          <h2 className="text-foreground mb-3 text-sm font-bold sm:text-base">
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
        <div className="border-border-subtle/50 bg-surface-container-low rounded-md border p-4 text-center">
          <p className="text-muted-foreground text-xs sm:text-sm">
            Đăng nhập để tham gia bình luận và thảo luận cùng cộng đồng.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {loading && !page ? (
          <div className="bg-surface-container-low text-muted-foreground rounded-md p-6 text-center text-xs sm:text-sm">
            Đang tải bình luận...
          </div>
        ) : null}

        {!loading && page?.items.length === 0 ? (
          <div className="bg-surface-container-low text-muted-foreground rounded-md p-6 text-center text-xs sm:text-sm">
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
          className="border-border-subtle/50 bg-surface-container hover:bg-surface-container-high text-foreground flex w-full items-center justify-center gap-2 rounded-md border px-4 py-3 text-xs font-semibold transition-colors disabled:opacity-60 sm:text-sm"
        >
          <span>
            {loading ? "Đang tải bình luận..." : "Xem thêm bình luận"}
          </span>
          <ChevronDown size={16} />
        </button>
      )}
    </section>
  );
};
