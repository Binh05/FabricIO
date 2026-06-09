import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, UploadCloud, ImagePlus, Images, Tag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/useGame";
import {
  postGameSchema,
  type PostGameFormValues,
} from "@/lib/schemas/gameSchema";
import type { PostGameRequest } from "@/types/Game";

/* ────────────────────────────────────────────────────────── */
/*  Sub-components                                            */
/* ────────────────────────────────────────────────────────── */

interface FieldErrorProps {
  message?: string;
}
const FieldError = ({ message }: FieldErrorProps) =>
  message ? <p className="mt-1 text-xs text-red-400">{message}</p> : null;

interface FileDropZoneProps {
  label: string;
  hint: string;
  icon: React.ReactNode;
  accept?: string;
  multiple?: boolean;
  fileName?: string;
  error?: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}
const FileDropZone = ({
  label,
  hint,
  icon,
  accept,
  multiple,
  fileName,
  error,
  inputProps,
}: FileDropZoneProps) => (
  <div className="flex flex-col gap-1.5">
    <label className="block text-sm font-semibold">{label}</label>
    <label
      className={`border-border hover:border-primary flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
        error ? "border-red-500/60" : ""
      }`}
    >
      <span className="text-muted">{icon}</span>
      <span className="text-muted text-xs">{fileName ?? hint}</span>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        {...inputProps}
      />
    </label>
    <FieldError message={error} />
  </div>
);

/* ────────────────────────────────────────────────────────── */
/*  Main Form                                                 */
/* ────────────────────────────────────────────────────────── */

const SubmitGameForm = () => {
  const { games, uploadGame } = useGame();
  const navigate = useNavigate();

  // Unique tags derived from all games in context
  const ALL_TAGS = [
    ...new Map(
      games.flatMap((g) => g.tags).map((tag) => [tag.id, tag]),
    ).values(),
  ];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostGameFormValues>({
    resolver: zodResolver(postGameSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      tagIds: [],
    },
  });

  // Watch for preview sidebar
  const watchedPrice = watch("price");
  const watchedTagIds = watch("tagIds") ?? [];
  const watchedSourceGame = watch("sourceGame") as FileList | undefined;
  const watchedThumbnail = watch("thumbnail") as FileList | undefined;
  const watchedMedia = watch("media") as FileList | undefined;

  /* ── Submit ── */
  const onSubmit = async (values: PostGameFormValues) => {
    const sourceFiles = values.sourceGame as FileList;
    const thumbFiles = values.thumbnail as FileList;
    const mediaFiles = values.media as FileList | undefined | null;

    const request: PostGameRequest = {
      title: values.title,
      description: values.description ?? null,
      price: values.price,
      sourceGame: sourceFiles[0],
      thumbnail: thumbFiles[0],
      media:
        mediaFiles && mediaFiles.length > 0 ? Array.from(mediaFiles) : null,
      tagIds: values.tagIds && values.tagIds.length > 0 ? values.tagIds : null,
    };

    try {
      await uploadGame(request);
      toast.success("Upload game thành công!");
      navigate("/games");
    } catch {
      // errors already toasted inside uploadGame
    }
  };

  /* ── Tag toggle ── */
  const toggleTag = (id: string) => {
    const current = watchedTagIds ?? [];
    const next = current.includes(id)
      ? current.filter((t) => t !== id)
      : [...current, id];
    setValue("tagIds", next, { shouldValidate: true });
  };

  return (
    <div className="flex flex-1 flex-col gap-10 lg:flex-row">
      {/* ── Form ── */}
      <form
        className="bg-card border-border flex-1 rounded-xl border p-6 md:p-8"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="block text-sm font-semibold">
              Tên game <span className="text-red-400">*</span>
            </label>
            <input
              className={`border-border focus:border-primary w-full rounded-xl border bg-black/20 px-4 py-3 text-white transition-colors outline-none ${
                errors.title ? "border-red-500/60" : ""
              }`}
              placeholder="Super Platformer 3000"
              {...register("title")}
            />
            <FieldError message={errors.title?.message} />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1.5">
            <label className="block text-sm font-semibold">
              Giá (USD) <span className="text-red-400">*</span>
            </label>
            <input
              className={`border-border focus:border-primary w-full rounded-xl border bg-black/20 px-4 py-3 text-white transition-colors outline-none ${
                errors.price ? "border-red-500/60" : ""
              }`}
              type="number"
              min={0}
              step={0.01}
              placeholder="0"
              {...register("price")}
            />
            <FieldError message={errors.price?.message} />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="block text-sm font-semibold">Mô tả game</label>
            <textarea
              className={`border-border focus:border-primary min-h-32 w-full resize-none rounded-xl border bg-black/20 px-4 py-3 text-white transition-colors outline-none ${
                errors.description ? "border-red-500/60" : ""
              }`}
              placeholder="Mô tả ngắn về game của bạn..."
              {...register("description")}
            />
            <FieldError message={errors.description?.message} />
          </div>

          {/* Source Game File */}
          <div className="md:col-span-2">
            <FileDropZone
              label="File game (.zip / .apk) *"
              hint="Kéo thả hoặc click để chọn file — tối đa 500 MB"
              icon={<UploadCloud size={32} />}
              accept=".zip,.apk"
              fileName={watchedSourceGame?.[0]?.name}
              error={errors.sourceGame?.message as string | undefined}
              inputProps={register("sourceGame")}
            />
          </div>

          {/* Thumbnail */}
          <FileDropZone
            label="Ảnh đại diện *"
            hint="JPG / PNG / WEBP — tối đa 10 MB"
            icon={<ImagePlus size={28} />}
            accept="image/jpeg,image/png,image/webp"
            fileName={watchedThumbnail?.[0]?.name}
            error={errors.thumbnail?.message as string | undefined}
            inputProps={register("thumbnail")}
          />

          {/* Media Gallery */}
          <FileDropZone
            label="Ảnh gallery (tuỳ chọn)"
            hint="Nhiều ảnh — JPG / PNG / WEBP, mỗi ảnh tối đa 10 MB"
            icon={<Images size={28} />}
            accept="image/jpeg,image/png,image/webp"
            multiple
            fileName={
              watchedMedia && watchedMedia.length > 0
                ? `${watchedMedia.length} ảnh đã chọn`
                : undefined
            }
            error={errors.media?.message as string | undefined}
            inputProps={register("media")}
          />

          {/* Tags */}
          {ALL_TAGS.length > 0 && (
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <Tag size={14} /> Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_TAGS.map((tag) => {
                  const active = watchedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                        active
                          ? "border-primary bg-primary/20 text-white"
                          : "border-border text-muted hover:border-white/40 hover:text-white"
                      }`}
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
        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="gradient" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Đang upload...
              </>
            ) : (
              "Đăng game lên cửa hàng"
            )}
          </Button>
          <Button variant="outline" asChild>
            <Link to="/games">Quay lại thư viện</Link>
          </Button>
        </div>
      </form>

      {/* ── Preview Sidebar ── */}
      <aside className="bg-card border-border sticky top-30 h-fit w-full rounded-xl border p-6 lg:w-75">
        <h2 className="mb-4 text-lg font-bold">Preview</h2>

        {/* Thumbnail preview */}
        {watchedThumbnail?.[0] ? (
          <img
            src={URL.createObjectURL(watchedThumbnail[0])}
            alt="Thumbnail preview"
            className="mb-4 aspect-video w-full rounded-lg object-cover"
          />
        ) : (
          <div className="border-border mb-4 flex aspect-video w-full items-center justify-center rounded-lg border bg-white/5">
            <ImagePlus size={32} className="text-muted" />
          </div>
        )}

        <ul className="text-muted flex flex-col gap-2 text-sm">
          <li className="flex justify-between">
            <span>Giá</span>
            <span className="font-semibold text-white">
              {!watchedPrice || watchedPrice === 0
                ? "Miễn phí"
                : `$${Number(watchedPrice).toFixed(2)}`}
            </span>
          </li>
          <li className="flex justify-between">
            <span>File game</span>
            <span className="max-w-35 truncate text-right font-semibold text-white">
              {watchedSourceGame?.[0]?.name ?? "—"}
            </span>
          </li>
          <li className="flex justify-between">
            <span>Ảnh gallery</span>
            <span className="font-semibold text-white">
              {watchedMedia && watchedMedia.length > 0
                ? `${watchedMedia.length} ảnh`
                : "—"}
            </span>
          </li>
          <li className="flex flex-col gap-1 pt-1">
            <span>Tags</span>
            <div className="flex flex-wrap gap-1 pt-1">
              {watchedTagIds.length > 0 ? (
                watchedTagIds.map((id) => {
                  const tag = ALL_TAGS.find((t) => t.id === id);
                  return tag ? (
                    <span
                      key={id}
                      className="bg-primary/20 text-primary rounded-full px-2 py-0.5 text-xs"
                    >
                      {tag.name}
                    </span>
                  ) : null;
                })
              ) : (
                <span className="text-xs">—</span>
              )}
            </div>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default SubmitGameForm;
