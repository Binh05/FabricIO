interface CommentContentProps {
  content: string;
  targetCommentId?: string;
}

export const CommentContent = ({ content, targetCommentId }: CommentContentProps) => {
  // Regex tìm kiếm mention @username (đặc biệt ở đầu hoặc trong nội dung)
  const parts = content.split(/(@[a-zA-Z0-9_.-]+)/g);

  const handleScrollToTarget = (usernameWithoutAt: string) => {
    // 1. Tìm theo targetCommentId nếu có
    let targetEl: HTMLElement | null = targetCommentId
      ? document.getElementById(`comment-${targetCommentId}`)
      : null;

    // 2. Tìm theo data-comment-username
    if (!targetEl) {
      targetEl = document.querySelector(`[data-comment-username="${usernameWithoutAt}"]`);
    }

    // 3. Tìm theo id thẻ user
    if (!targetEl) {
      targetEl = document.getElementById(`comment-user-${usernameWithoutAt}`);
    }

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
      targetEl.classList.add("ring-2", "ring-secondary-foreground/70");
      setTimeout(() => {
        targetEl?.classList.remove("ring-2", "ring-secondary-foreground/70");
      }, 1500);
    }
  };

  return (
    <p className="mt-2.5 whitespace-pre-wrap text-sm sm:text-[15px] leading-relaxed text-foreground/90">
      {parts.map((part, index) => {
        if (part.startsWith("@")) {
          const username = part.slice(1);
          return (
            <button
              key={`${part}-${index}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleScrollToTarget(username);
              }}
              className="text-secondary-foreground font-semibold hover:underline inline cursor-pointer select-none transition-colors"
            >
              {part}
            </button>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </p>
  );
};
