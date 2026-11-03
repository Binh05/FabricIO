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
import axios from "axios";

import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/useGame";
import { uploadService } from "@/services/uploadService";
import type { Game } from "@/types/Game";
import {
  formatFileSize,
  normalizeContentType,
  UPLOAD_LIMITS,
} from "@/lib/uploadUtils";
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

  // Selected files
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);

  // Errors for each file
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [sourceError, setSourceError] = useState<string | null>(null);

  // Upload status and progress
  const [isUploading, setIsUploading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [currentStepText, setCurrentStepText] = useState<string>("");
  const [thumbnailProgress, setThumbnailProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [sourceProgress, setSourceProgress] = useState(0);

  // Hidden inputs refs
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const sourceInputRef = useRef<HTMLInputElement>(null);

  /* ── File selection handlers ── */
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > UPLOAD_LIMITS.GAME_THUMBNAIL.maxBytes) {
      setThumbnailError("Ảnh đại diện không được vượt quá 2MB");
      return;
    }

    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!UPLOAD_LIMITS.GAME_THUMBNAIL.allowedExtensions.includes(ext)) {
      setThumbnailError("Chỉ chấp nhận định dạng ảnh .png, .jpg, .jpeg");
      return;
    }

    setThumbnailError(null);
    setThumbnailFile(file);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > UPLOAD_LIMITS.GAME_VIDEO.maxBytes) {
      setVideoError("Video giới thiệu không được vượt quá 20MB");
      return;
    }

    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!UPLOAD_LIMITS.GAME_VIDEO.allowedExtensions.includes(ext)) {
      setVideoError("Chỉ chấp nhận định dạng video .mp4, .webm");
      return;
    }

    setVideoError(null);
    setVideoFile(file);
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > UPLOAD_LIMITS.GAME_SOURCE.maxBytes) {
      setSourceError("File ZIP source game không được vượt quá 100MB");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".zip")) {
      setSourceError("Vui lòng tải lên tệp nén định dạng .zip");
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
    const hasThumbnail =
      thumbnailFile !== null || Boolean(draft.thumbnailUrl && draft.thumbnailUrl.trim() !== "");
    if (!hasThumbnail) {
      setThumbnailError("Ảnh đại diện là bắt buộc");
      toast.error("Vui lòng chọn ảnh đại diện cho game (bắt buộc)");
      return;
    }

    const hasSource =
      sourceFile !== null || Boolean(draft.gameUrl && draft.gameUrl.trim() !== "");
    if (!hasSource) {
      setSourceError("File ZIP source game là bắt buộc");
      toast.error("Vui lòng chọn file build ZIP của game (bắt buộc)");
      return;
    }

    try {
      setIsUploading(true);

      // 1. Upload Thumbnail (if new file selected)
      if (thumbnailFile) {
        setCurrentStepText("Đang tải ảnh đại diện lên...");
        setThumbnailProgress(10);

        const contentType = normalizeContentType(thumbnailFile, "GAME_THUMBNAIL");
        const presignRes = await uploadService.presign({
          objectId: draft.id,
          purpose: "GAME_THUMBNAIL",
          contentType,
          size: thumbnailFile.size,
        });

        await uploadService.uploadToStorage(
          presignRes.data.presignedUpload.url,
          thumbnailFile,
          contentType,
          presignRes.data.presignedUpload.headers,
          (percent) => setThumbnailProgress(percent),
        );

        await uploadService.complete({
          objectId: draft.id,
          key: presignRes.data.key,
          purpose: "GAME_THUMBNAIL",
        });

        setThumbnailProgress(100);
      }

      // 2. Upload Video (if selected)
      if (videoFile) {
        setCurrentStepText("Đang tải video giới thiệu...");
        setVideoProgress(10);

        const contentType = normalizeContentType(videoFile, "GAME_VIDEO");
        const presignRes = await uploadService.presign({
          objectId: draft.id,
          purpose: "GAME_VIDEO",
          contentType,
          size: videoFile.size,
        });

        await uploadService.uploadToStorage(
          presignRes.data.presignedUpload.url,
          videoFile,
          contentType,
          presignRes.data.presignedUpload.headers,
          (percent) => setVideoProgress(percent),
        );

        await uploadService.complete({
          objectId: draft.id,
          key: presignRes.data.key,
          purpose: "GAME_VIDEO",
        });

        setVideoProgress(100);
      }

      // 3. Upload Source ZIP (if new file selected)
      if (sourceFile) {
        setCurrentStepText("Đang tải file build ZIP...");
        setSourceProgress(10);

        const contentType = normalizeContentType(sourceFile, "GAME_SOURCE");
        const presignRes = await uploadService.presign({
          objectId: draft.id,
          purpose: "GAME_SOURCE",
          contentType,
          size: sourceFile.size,
        });

        await uploadService.uploadToStorage(
          presignRes.data.presignedUpload.url,
          sourceFile,
          contentType,
          presignRes.data.presignedUpload.headers,
          (percent) => setSourceProgress(percent),
        );

        await uploadService.complete({
          objectId: draft.id,
          key: presignRes.data.key,
          purpose: "GAME_SOURCE",
        });

        setSourceProgress(100);
      }

      // 4. Publish Game
      setCurrentStepText("Đang xuất bản game lên cửa hàng...");
      const published = await publishGame(draft.id);

      toast.success("Chúc mừng! Game đã được đăng tải và xuất bản thành công!");
      onSuccess(published);
    } catch (error) {
      console.error("Lỗi khi upload tệp hoặc publish game:", error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Đã xảy ra lỗi trong quá trình tải tệp hoặc xuất bản game. Vui lòng thử lại!";
      toast.error(message);
    } finally {
      setIsUploading(false);
      setCurrentStepText("");
    }
  };

  const hasExistingThumbnail = Boolean(draft.thumbnailUrl && draft.thumbnailUrl.trim() !== "");
  const hasExistingSource = Boolean(draft.gameUrl && draft.gameUrl.trim() !== "");

  return (
    <div className={cn("glass-strong rounded-xl p-6 md:p-8 flex flex-col gap-6", className)}>
      <div className="flex flex-col gap-1 border-b border-border pb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <UploadCloud className="text-primary size-5" />
          Tải lên tệp đa phương tiện & Source game
        </h2>
        <p className="text-sm text-muted-foreground">
          Bản nháp: <span className="text-foreground font-semibold">"{draft.title}"</span>. Vui lòng tải lên ảnh đại diện và file build game của bạn.
        </p>
      </div>

      {/* ── 1. THUMBNAIL (Required) ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold flex items-center gap-1.5">
            <ImagePlus size={16} className="text-primary" />
            Ảnh đại diện (Thumbnail) <span className="text-primary">*</span>
          </label>
          <span className="text-xs text-muted-foreground">
            {UPLOAD_LIMITS.GAME_THUMBNAIL.label}
          </span>
        </div>

        <input
          type="file"
          ref={thumbInputRef}
          accept={UPLOAD_LIMITS.GAME_THUMBNAIL.accept}
          className="hidden"
          onChange={handleThumbnailChange}
          disabled={isUploading}
        />

        <div
          onClick={() => !isUploading && thumbInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all",
            thumbnailError
              ? "border-destructive bg-destructive/5"
              : "border-border hover:border-primary/70 bg-input/40",
            isUploading && "cursor-not-allowed opacity-70",
          )}
        >
          {thumbnailFile ? (
            <div className="flex flex-col items-center gap-2">
              <img
                src={URL.createObjectURL(thumbnailFile)}
                alt="Thumbnail preview"
                className="max-h-36 rounded-lg object-contain shadow-md"
              />
              <div className="flex items-center gap-2 text-xs text-foreground font-medium">
                <CheckCircle2 size={14} className="text-emerald-500" />
                {thumbnailFile.name} ({formatFileSize(thumbnailFile.size)})
              </div>
              <span className="text-[11px] text-muted-foreground underline">
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
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={14} /> Đã có ảnh đại diện từ trước. Nhấp để thay ảnh mới.
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="p-3 rounded-full bg-primary/10 text-primary mb-1">
                <ImagePlus size={24} />
              </div>
              <p className="text-sm font-medium">Kéo thả hoặc nhấp để chọn ảnh đại diện</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, JPEG (tối đa 2MB)</p>
            </div>
          )}
        </div>

        {thumbnailProgress > 0 && thumbnailProgress < 100 && (
          <div className="w-full bg-secondary/50 rounded-full h-1.5 overflow-hidden mt-1">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${thumbnailProgress}%` }}
            />
          </div>
        )}

        {thumbnailError && (
          <p className="text-xs text-destructive flex items-center gap-1 mt-1">
            <AlertCircle size={13} /> {thumbnailError}
          </p>
        )}
      </div>

      {/* ── 2. VIDEO (Optional) ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold flex items-center gap-1.5">
            <Video size={16} className="text-muted-foreground" />
            Video giới thiệu (Trailer / Gameplay demo)
          </label>
          <span className="text-xs text-muted-foreground">
            {UPLOAD_LIMITS.GAME_VIDEO.label} - Không bắt buộc
          </span>
        </div>

        <input
          type="file"
          ref={videoInputRef}
          accept={UPLOAD_LIMITS.GAME_VIDEO.accept}
          className="hidden"
          onChange={handleVideoChange}
          disabled={isUploading}
        />

        <div
          onClick={() => !isUploading && videoInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all",
            videoError
              ? "border-destructive bg-destructive/5"
              : "border-border hover:border-primary/70 bg-input/40",
            isUploading && "cursor-not-allowed opacity-70",
          )}
        >
          {videoFile ? (
            <div className="flex items-center justify-between w-full max-w-md px-4 py-2 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-3 truncate">
                <Video size={20} className="text-primary shrink-0" />
                <div className="truncate text-left">
                  <p className="text-xs font-semibold truncate text-foreground">
                    {videoFile.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {formatFileSize(videoFile.size)}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-destructive shrink-0"
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
              <div className="p-2.5 rounded-full bg-secondary/50 text-muted-foreground mb-1">
                <Video size={22} />
              </div>
              <p className="text-sm font-medium">Kéo thả hoặc nhấp để tải video lên</p>
              <p className="text-xs text-muted-foreground">MP4 hoặc WebM (tối đa 20MB)</p>
            </div>
          )}
        </div>

        {videoProgress > 0 && videoProgress < 100 && (
          <div className="w-full bg-secondary/50 rounded-full h-1.5 overflow-hidden mt-1">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${videoProgress}%` }}
            />
          </div>
        )}

        {videoError && (
          <p className="text-xs text-destructive flex items-center gap-1 mt-1">
            <AlertCircle size={13} /> {videoError}
          </p>
        )}
      </div>

      {/* ── 3. SOURCE ZIP (Required) ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold flex items-center gap-1.5">
            <FileArchive size={16} className="text-primary" />
            File source build game (.zip) <span className="text-primary">*</span>
          </label>
          <span className="text-xs text-muted-foreground">
            {UPLOAD_LIMITS.GAME_SOURCE.label}
          </span>
        </div>

        <input
          type="file"
          ref={sourceInputRef}
          accept={UPLOAD_LIMITS.GAME_SOURCE.accept}
          className="hidden"
          onChange={handleSourceChange}
          disabled={isUploading}
        />

        <div
          onClick={() => !isUploading && sourceInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all",
            sourceError
              ? "border-destructive bg-destructive/5"
              : "border-border hover:border-primary/70 bg-input/40",
            isUploading && "cursor-not-allowed opacity-70",
          )}
        >
          {sourceFile ? (
            <div className="flex items-center justify-between w-full max-w-md px-4 py-2 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-3 truncate">
                <FileArchive size={20} className="text-primary shrink-0" />
                <div className="truncate text-left">
                  <p className="text-xs font-semibold truncate text-foreground">
                    {sourceFile.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {formatFileSize(sourceFile.size)}
                  </p>
                </div>
              </div>

              <span className="text-xs text-emerald-400 font-medium shrink-0 flex items-center gap-1">
                <CheckCircle2 size={14} /> Sẵn sàng
              </span>
            </div>
          ) : hasExistingSource ? (
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={14} /> Đã có build WebGL từ trước. Nhấp để thay bằng file zip mới.
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="p-3 rounded-full bg-primary/10 text-primary mb-1">
                <FileArchive size={24} />
              </div>
              <p className="text-sm font-medium">Kéo thả hoặc nhấp để chọn file nén .zip</p>
              <p className="text-xs text-muted-foreground">
                Tệp .zip cần chứa file index.html ở thư mục gốc (tối đa 100MB)
              </p>
            </div>
          )}
        </div>

        {sourceProgress > 0 && sourceProgress < 100 && (
          <div className="w-full bg-secondary/50 rounded-full h-1.5 overflow-hidden mt-1">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${sourceProgress}%` }}
            />
          </div>
        )}

        {sourceError && (
          <p className="text-xs text-destructive flex items-center gap-1 mt-1">
            <AlertCircle size={13} /> {sourceError}
          </p>
        )}
      </div>

      {/* Progress Status Message */}
      {isUploading && currentStepText && (
        <div className="flex items-center gap-3 p-3.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-pulse">
          <Loader2 size={18} className="animate-spin shrink-0" />
          <span>{currentStepText}</span>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            type="button"
            disabled={isUploading || isCanceling}
            onClick={onBack}
            className="flex items-center gap-1.5"
          >
            <ArrowLeft size={16} />
            Quay lại thông tin cơ bản
          </Button>

          <Button
            variant="ghost"
            type="button"
            disabled={isUploading || isCanceling}
            onClick={handleCancelDraft}
            className="text-muted-foreground hover:text-destructive text-xs"
          >
            {isCanceling ? (
              <>
                <Loader2 size={14} className="animate-spin mr-1.5" />
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
          disabled={isUploading || isCanceling}
          onClick={handleUploadAndPublish}
          className={cn("min-w-44", isUploading && "opacity-75")}
        >
          {isUploading ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2" />
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

