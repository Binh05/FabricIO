import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Loader2, Tag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/useGame";
import {
  postGameSchema,
  type PostGameFormInput,
  type PostGameFormOutput,
} from "@/lib/schemas/gameSchema";
import type { Game, PostGameRequest } from "@/types/Game";
import { cn } from "@/lib/utils";
import { FieldError } from "./FieldError";

const inputClass =
  "w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors outline-none focus:border-primary focus:ring-4 focus:ring-primary/20";

const textareaClass =
  "min-h-32 w-full resize-none rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors outline-none focus:border-primary focus:ring-4 focus:ring-primary/20";

interface GameDraftFormProps {
  draft?: Game | null;
  onSuccess: (draft: Game) => void;
  className?: string;
}

const GameDraftForm = ({
  draft,
  onSuccess,
  className,
}: GameDraftFormProps) => {
  const { tags, fetchGameTags, createDraft, updateGameInfo, deleteGameDraft } =
    useGame();
  const navigate = useNavigate();
  const [isCanceling, setIsCanceling] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostGameFormInput, unknown, PostGameFormOutput>({
    resolver: zodResolver(postGameSchema),
    defaultValues: {
      title: draft?.title ?? "",
      description: draft?.description ?? "",
      price: draft?.price ?? 0,
      tagIds: draft?.tags?.map((t) => t.id) ?? [],
    },
  });

  useEffect(() => {
    if (tags.length === 0) {
      fetchGameTags();
    }
  }, [tags.length, fetchGameTags]);

  useEffect(() => {
    if (draft) {
      reset({
        title: draft.title ?? "",
        description: draft.description ?? "",
        price: draft.price ?? 0,
        tagIds: draft.tags?.map((t) => t.id) ?? [],
      });
    }
  }, [draft, reset]);

  /* ── Submit ── */
  const onSubmit = async (values: PostGameFormOutput) => {
    const request: PostGameRequest = {
      title: values.title.trim(),
      description: values.description ? values.description.trim() : null,
      price: values.price,
      tagIds: values.tagIds && values.tagIds.length > 0 ? values.tagIds : null,
    };

    try {
      if (draft?.id) {
        const updated = await updateGameInfo(draft.id, request);
        toast.success("Đã cập nhật thông tin bản nháp thành công!");
        onSuccess(updated);
      } else {
        const created = await createDraft(request);
        toast.success("Đã tạo bản nháp game thành công!");
        onSuccess(created);
      }
    } catch {
      // errors already toasted inside hook
    }
  };

  /* ── Cancel / Delete Draft ── */
  const handleCancel = async () => {
    if (!draft?.id) {
      navigate("/");
      return;
    }

    try {
      setIsCanceling(true);
      await deleteGameDraft(draft.id);
      toast.success("Đã hủy bỏ bản nháp game thành công!");
      navigate("/");
    } catch {
      // error handled in hook
    } finally {
      setIsCanceling(false);
    }
  };

  const watchedTagIds = watch("tagIds") ?? [];

  /* ── Tag toggle ── */
  const toggleTag = (id: string) => {
    const current = watchedTagIds ?? [];
    const next = current.includes(id)
      ? current.filter((t) => t !== id)
      : [...current, id];
    setValue("tagIds", next, { shouldValidate: true });
  };

  return (
    <div className={cn("flex flex-1 flex-col gap-10", className)}>
      {/* FORM */}
      <form
        className="glass-strong flex-1 rounded-xl p-6 md:p-8 flex flex-col"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold">
              Tên game <span className="text-primary">*</span>
            </label>

            <input
              className={cn(inputClass, errors.title && "border-destructive")}
              placeholder="Super Platformer 3000"
              {...register("title")}
            />

            <FieldError message={errors.title?.message} />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold">
              Giá (USD) <span className="text-primary">*</span>
            </label>

            <input
              className={cn(inputClass, "read-only:bg-muted/20 read-only:text-muted-foreground cursor-default opacity-80", errors.price && "border-destructive")}
              type="number"
              min={0}
              step={0.01}
              placeholder="0"
              readOnly
              {...register("price")}
            />

            <FieldError message={errors.price?.message} />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-semibold">Mô tả game</label>

            <textarea
              className={cn(
                textareaClass,
                errors.description && "border-destructive",
              )}
              placeholder="Mô tả ngắn về game của bạn..."
              {...register("description")}
            />

            <FieldError message={errors.description?.message} />
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <Tag size={14} />
                Thể loại / Tags
              </label>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const active = watchedTagIds.includes(tag.id);

                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                        active
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                      )}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 self-end flex flex-wrap gap-3">
          <Button
            variant="outline"
            type="button"
            disabled={isSubmitting || isCanceling}
            onClick={handleCancel}
          >
            {isCanceling ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Đang hủy draft...
              </>
            ) : (
              "Hủy"
            )}
          </Button>

          <Button
            variant="gradient"
            type="submit"
            disabled={isSubmitting || isCanceling}
            className={isSubmitting ? "opacity-75" : ""}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Đang xử lý...
              </>
            ) : (
              "Tiếp tục"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GameDraftForm;
