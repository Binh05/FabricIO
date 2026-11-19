import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface CommentComposerProps {
  placeholder: string;
  submitLabel: string;
  initialValue?: string;
  disabled?: boolean;
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
}

export const CommentComposer = ({
  placeholder,
  submitLabel,
  initialValue = "",
  disabled = false,
  onSubmit,
  onCancel,
}: CommentComposerProps) => {
  const { token } = useAuth();
  const [content, setContent] = useState(initialValue);
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialValue && textareaRef.current) {
      textareaRef.current.focus();
      const length = initialValue.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [initialValue]);

  const handleSubmit = async () => {
    if (!token) {
      toast.warning("Hãy đăng nhập để bình luận về trò chơi này");
      return;
    }
    const value = content.trim();
    if (!value || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(value);
      setContent("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder={placeholder}
        maxLength={1024}
        rows={3}
        disabled={disabled || submitting}
        className="bg-surface-container border-border-subtle/60 min-h-20 resize-none rounded-md text-sm focus-visible:ring-1"
      />
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-md px-3 py-1.5 text-xs font-medium sm:text-sm"
          >
            Hủy
          </Button>
        )}
        <Button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={disabled || submitting || !content.trim()}
          className="rounded-md px-4 py-2 text-xs font-semibold sm:text-sm"
        >
          {submitting ? "Đang gửi..." : submitLabel}
        </Button>
      </div>
    </div>
  );
};
