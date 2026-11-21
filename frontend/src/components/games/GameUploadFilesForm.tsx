import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  ImagePlus,
  Video,
  FileArchive,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/useGame";
import { useUpload } from "@/hooks/useUpload";
import type { Game } from "@/types/Game";
import { formatFileSize, UPLOAD_LIMITS } from "@/lib/uploadUtils";
import { cn } from "@/lib/utils";

interface GameUploadFilesFormProps {
  draft: Game;
  onBack: () => void;
  onSuccess: (game: Game) => void;
  className?: string;
}

export const GameUploadFilesForm: React.FC<GameUploadFilesFormProps> = ({
  draft,
  onBack,
  onSuccess,
  className,
}) => {
  const navigate = useNavigate();
  const { deleteGameDraft, publishGame } = useGame();
  const {
    user,
    isUploading,
    currentStepText,
    thumbnailProgress,
    videoProgress,
    sourceProgress,
    validateThumbnailFile,
    validateVideoFile,
    validateSourceFile,
    uploadGameFiles,
    setStepText,
  } = useUpload();

  // Selected files
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);

  // Errors for each file
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [sourceError, setSourceError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  // Hidden inputs refs
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const sourceInputRef = useRef<HTMLInputElement>(null);

  /* ── File selection handlers ── */
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const error = validateThumbnailFile(file);
    if (error) {
      setThumbnailError(error);
      return;
    }
    setThumbnailError(null);
    setThumbnailFile(file);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const error = validateVideoFile(file);
    if (error) {
      setVideoError(error);
      return;
    }
    setVideoError(null);
    setVideoFile(file);
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const error = validateSourceFile(file);
    if (error) {
      setSourceError(error);
      return;
    }
    setSourceError(null);
    setSourceFile(file);
  };

  /* ── Cancel / Delete draft ── */
  const handleCancelDraft = async () => {
    if (!draft.id) {
      navigate("/");
      return;
    }

    try {
      setIsCanceling(true);
      await deleteGameDraft(draft.id);
      toast.success("Đã hủy và xóa bản nháp game thành công!");
      navigate("/");
    } catch {
      // toast in hook
    } finally {
      setIsCanceling(false);
    }
  };

  /* ── Submit & Upload sequence ── */
  const handleUploadAndPublish = async () => {
    if (user?.role !== "Admin") {
      toast.warning(
        "Hiện đã khóa chức năng upload game. Liên hệ Admin để được hỗ trợ.",
      );
      return;
    }

    const hasThumbnail =
      thumbnailFile !== null ||
      Boolean(draft.thumbnailUrl && draft.thumbnailUrl.trim() !== "");
    if (!hasThumbnail) {
      setThumbnailError("Ảnh đại diện là bắt buộc");
      toast.error("Vui lòng chọn ảnh đại diện cho game (bắt buộc)");
      return;
    }

    const hasSource =
      sourceFile !== null ||
      Boolean(draft.gameUrl && draft.gameUrl.trim() !== "");
    if (!hasSource) {
      setSourceError("File ZIP source game là bắt buộc");
      toast.error("Vui lòng chọn file build ZIP của game (bắt buộc)");
      return;
    }

    try {
      setIsPublishing(true);
      await uploadGameFiles(draft.id, {
        thumbnailFile,
        videoFile,
        sourceFile,
      });

      setStepText("Đang xuất bản game lên cửa hàng...");
      const published = await publishGame(draft.id);

      toast.success("Chúc mừng! Game đã được đăng tải và xuất bản thành công!");
      onSuccess(published);
    } catch {
      // Upload and publish errors are already handled in their hooks.
    } finally {
      setIsPublishing(false);
      setStepText("");
    }
  };

  const hasExistingThumbnail = Boolean(
    draft.thumbnailUrl && draft.thumbnailUrl.trim() !== "",
  );
  const hasExistingSource = Boolean(
    draft.gameUrl && draft.gameUrl.trim() !== "",
  );

  return (
    <div
      className={cn(
        "glass-strong flex flex-col gap-6 rounded-xl p-6 md:p-8",
        className,
      )}
    >
      <div className="border-border flex flex-col gap-1 border-b pb-4">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <UploadCloud className="text-primary size-5" />
          Tải lên tệp đa phương tiện & Source game
        </h2>
        <p className="text-muted-foreground text-sm">
          Bản nháp:{" "}
          <span className="text-foreground font-semibold">"{draft.title}"</span>
          . Vui lòng tải lên ảnh đại diện và file build game của bạn.
        </p>
      </div>

      {/* ── 1. THUMBNAIL (Required) ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-sm font-semibold">
            <ImagePlus size={16} className="text-primary" />
            Ảnh đại diện (Thumbnail) <span className="text-primary">*</span>
          </label>
          <span className="text-muted-foreground text-xs">
            {UPLOAD_LIMITS.GAME_THUMBNAIL.label}
          </span>
        </div>

        <input
          type="file"
          ref={thumbInputRef}
          accept={UPLOAD_LIMITS.GAME_THUMBNAIL.accept}
          className="hidden"
          onChange={handleThumbnailChange}
          disabled={isUploading || isPublishing}
        />

        <div
          onClick={() =>
            !(isUploading || isPublishing) && thumbInputRef.current?.click()
          }
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-5 transition-all",
            thumbnailError
              ? "border-destructive bg-destructive/5"
              : "border-border hover:border-primary/70 bg-input/40",
            (isUploading || isPublishing) && "cursor-not-allowed opacity-70",
          )}
        >
          {thumbnailFile ? (
            <div className="flex flex-col items-center gap-2">
              <img
                src={URL.createObjectURL(thumbnailFile)}
                alt="Thumbnail preview"
                className="max-h-36 rounded-lg object-contain shadow-md"
              />
              <div className="text-foreground flex items-center gap-2 text-xs font-medium">
                <CheckCircle2 size={14} className="text-success" />
                {thumbnailFile.name} ({formatFileSize(thumbnailFile.size)})
              </div>
              <span className="text-muted-foreground text-[11px] underline">
                Nhấp để đổi ảnh khác
              </span>
            </div>
          ) : hasExistingThumbnail ? (
            <div className="flex flex-col items-center gap-2">
              <img
                src={draft.thumbnailUrl}
                alt="Current thumbnail"
                className="max-h-36 rounded-lg object-contain shadow-md"
              />
              <span className="text-success flex items-center gap-1 text-xs">
                <CheckCircle2 size={14} /> Đã có ảnh đại diện từ trước. Nhấp để
                thay ảnh mới.
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="bg-primary/10 text-primary mb-1 rounded-full p-3">
                <ImagePlus size={24} />
              </div>
              <p className="text-sm font-medium">
                Kéo thả hoặc nhấp để chọn ảnh đại diện
              </p>
              <p className="text-muted-foreground text-xs">
                PNG, JPG, JPEG (tối đa 2MB)
              </p>
            </div>
          )}
        </div>

        {thumbnailProgress > 0 && thumbnailProgress < 100 && (
          <div className="bg-secondary/50 mt-1 h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${thumbnailProgress}%` }}
            />
          </div>
        )}

        {thumbnailError && (
          <p className="text-destructive mt-1 flex items-center gap-1 text-xs">
            <AlertCircle size={13} /> {thumbnailError}
          </p>
        )}
      </div>

      {/* ── 2. VIDEO (Optional) ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-sm font-semibold">
            <Video size={16} className="text-muted-foreground" />
            Video giới thiệu (Trailer / Gameplay demo)
          </label>
          <span className="text-muted-foreground text-xs">
            {UPLOAD_LIMITS.GAME_VIDEO.label} - Không bắt buộc
          </span>
        </div>

        <input
          type="file"
          ref={videoInputRef}
          accept={UPLOAD_LIMITS.GAME_VIDEO.accept}
          className="hidden"
          onChange={handleVideoChange}
          disabled={isUploading || isPublishing}
        />

        <div
          onClick={() =>
            !(isUploading || isPublishing) && videoInputRef.current?.click()
          }
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 transition-all",
            videoError
              ? "border-destructive bg-destructive/5"
              : "border-border hover:border-primary/70 bg-input/40",
            (isUploading || isPublishing) && "cursor-not-allowed opacity-70",
          )}
        >
          {videoFile ? (
            <div className="bg-card border-border flex w-full max-w-md items-center justify-between rounded-lg border px-4 py-2">
              <div className="flex items-center gap-3 truncate">
                <Video size={20} className="text-primary shrink-0" />
                <div className="truncate text-left">
                  <p className="text-foreground truncate text-xs font-semibold">
                    {videoFile.name}
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    {formatFileSize(videoFile.size)}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive size-8 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setVideoFile(null);
                  setVideoError(null);
                }}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="bg-secondary/50 text-muted-foreground mb-1 rounded-full p-2.5">
                <Video size={22} />
              </div>
              <p className="text-sm font-medium">
                Kéo thả hoặc nhấp để tải video lên
              </p>
              <p className="text-muted-foreground text-xs">
                MP4 hoặc WebM (tối đa 20MB)
              </p>
            </div>
          )}
        </div>

        {videoProgress > 0 && videoProgress < 100 && (
          <div className="bg-secondary/50 mt-1 h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${videoProgress}%` }}
            />
          </div>
        )}

        {videoError && (
          <p className="text-destructive mt-1 flex items-center gap-1 text-xs">
            <AlertCircle size={13} /> {videoError}
          </p>
        )}
      </div>

      {/* ── 3. SOURCE ZIP (Required) ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-sm font-semibold">
            <FileArchive size={16} className="text-primary" />
            File source build game (.zip){" "}
            <span className="text-primary">*</span>
          </label>
          <span className="text-muted-foreground text-xs">
            {UPLOAD_LIMITS.GAME_SOURCE.label}
          </span>
        </div>

        <input
          type="file"
          ref={sourceInputRef}
          accept={UPLOAD_LIMITS.GAME_SOURCE.accept}
          className="hidden"
          onChange={handleSourceChange}
          disabled={isUploading || isPublishing}
        />

        <div
          onClick={() =>
            !(isUploading || isPublishing) && sourceInputRef.current?.click()
          }
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 transition-all",
            sourceError
              ? "border-destructive bg-destructive/5"
              : "border-border hover:border-primary/70 bg-input/40",
            (isUploading || isPublishing) && "cursor-not-allowed opacity-70",
          )}
        >
          {sourceFile ? (
            <div className="bg-card border-border flex w-full max-w-md items-center justify-between rounded-lg border px-4 py-2">
              <div className="flex items-center gap-3 truncate">
                <FileArchive size={20} className="text-primary shrink-0" />
                <div className="truncate text-left">
                  <p className="text-foreground truncate text-xs font-semibold">
                    {sourceFile.name}
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    {formatFileSize(sourceFile.size)}
                  </p>
                </div>
              </div>

              <span className="text-success flex shrink-0 items-center gap-1 text-xs font-medium">
                <CheckCircle2 size={14} /> Sẵn sàng
              </span>
            </div>
          ) : hasExistingSource ? (
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-success flex items-center gap-1 text-xs">
                <CheckCircle2 size={14} /> Đã có build WebGL từ trước. Nhấp để
                thay bằng file zip mới.
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="bg-primary/10 text-primary mb-1 rounded-full p-3">
                <FileArchive size={24} />
              </div>
              <p className="text-sm font-medium">
                Kéo thả hoặc nhấp để chọn file nén .zip
              </p>
              <p className="text-muted-foreground text-xs">
                Tệp .zip cần chứa file index.html ở thư mục gốc (tối đa 100MB)
              </p>
            </div>
          )}
        </div>

        {sourceProgress > 0 && sourceProgress < 100 && (
          <div className="bg-secondary/50 mt-1 h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${sourceProgress}%` }}
            />
          </div>
        )}

        {sourceError && (
          <p className="text-destructive mt-1 flex items-center gap-1 text-xs">
            <AlertCircle size={13} /> {sourceError}
          </p>
        )}
      </div>

      {/* Progress Status Message */}
      {(isUploading || isPublishing) && currentStepText && (
        <div className="bg-primary/10 border-primary/20 text-primary flex animate-pulse items-center gap-3 rounded-lg border p-3.5 text-sm font-medium">
          <Loader2 size={18} className="shrink-0 animate-spin" />
          <span>{currentStepText}</span>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="border-border mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            type="button"
            disabled={isUploading || isPublishing || isCanceling}
            onClick={onBack}
            className="flex items-center gap-1.5"
          >
            <ArrowLeft size={16} />
            Quay lại thông tin cơ bản
          </Button>

          <Button
            variant="ghost"
            type="button"
            disabled={isUploading || isPublishing || isCanceling}
            onClick={handleCancelDraft}
            className="text-muted-foreground hover:text-destructive text-xs"
          >
            {isCanceling ? (
              <>
                <Loader2 size={14} className="mr-1.5 animate-spin" />
                Đang hủy draft...
              </>
            ) : (
              "Hủy bỏ draft này"
            )}
          </Button>
        </div>

        <Button
          variant="gradient"
          type="button"
          disabled={isUploading || isPublishing || isCanceling}
          onClick={handleUploadAndPublish}
          className={cn(
            "min-w-44",
            (isUploading || isPublishing) && "opacity-75",
          )}
        >
          {isUploading || isPublishing ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Đang tải lên & Xuất bản...
            </>
          ) : (
            <>
              <UploadCloud size={16} className="mr-2" />
              Upload & Xuất bản game
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default GameUploadFilesForm;
