import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
        className="min-h-20 resize-none rounded-md bg-surface-container border-border-subtle/60 text-sm focus-visible:ring-1"
      />
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium"
          >
            Hủy
          </Button>
        )}
        <Button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={disabled || submitting || !content.trim()}
          className="rounded-md px-4 py-2 text-xs sm:text-sm font-semibold"
        >
          {submitting ? "Đang gửi..." : submitLabel}
        </Button>
      </div>
    </div>
  );
};
