import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Edit3 } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import SubmitGamePageSkeleton from "@/components/skeletons/SubmitGamePageSkeleton";
import GameDraftForm from "@/components/games/GameDraftForm";
import GameUploadFilesForm from "@/components/games/GameUploadFilesForm";
import type { Game } from "@/types/Game";
import { cn } from "@/lib/utils";

export const UploadGame = () => {
  const { user } = useAuth();
  const { fetchDraftGame, tags, fetchGameTags } = useGame();
  const navigate = useNavigate();

  const [loadingDraft, setLoadingDraft] = useState(true);
  const [draft, setDraft] = useState<Game | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (tags.length === 0) {
      fetchGameTags();
    }
  }, [tags.length, fetchGameTags]);

  useEffect(() => {
    let isMounted = true;

    const loadDraft = async () => {
      try {
        setLoadingDraft(true);
        const existingDraft = await fetchDraftGame();
        if (isMounted) {
          if (existingDraft && existingDraft.id) {
            setDraft(existingDraft);
            // Khi tạo draft mà chưa upload xong, quay lại sẽ chuyển thẳng sang bước upload file
            setStep(2);
          } else {
            setDraft(null);
            setStep(1);
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải bản nháp:", err);
      } finally {
        if (isMounted) {
          setLoadingDraft(false);
        }
      }
    };

    loadDraft();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!user || loadingDraft) return <SubmitGamePageSkeleton />;

  return (
    <section className="mb-16 w-full flex flex-col items-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <span className="text-primary mb-2 block text-[13px] font-bold tracking-[2px] uppercase">
            Creator Dashboard
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Đăng game mới lên FabricIO
          </h1>
          <p className="text-muted-foreground mt-2">
            Điền thông tin giới thiệu, đặt giá bán và tải lên file build WebGL kèm hình ảnh / video demo.
          </p>
        </div>

        {/* Multi-step progress indicator */}
        <div className="mb-8 grid grid-cols-2 gap-4">
          <div
            onClick={() => {
              if (draft) setStep(1);
            }}
            className={cn(
              "p-4 rounded-xl border flex items-center gap-3 transition-all",
              step === 1
                ? "border-primary bg-primary/10 text-foreground"
                : draft
                  ? "border-border bg-card/50 text-muted-foreground hover:border-primary/40 cursor-pointer"
                  : "border-border/50 opacity-60",
            )}
          >
            <div
              className={cn(
                "size-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                step === 1
                  ? "bg-primary text-black"
                  : draft
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {draft && step === 2 ? <Check size={16} /> : "1"}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Bước 1
              </p>
              <p className="text-sm font-bold flex items-center gap-1.5 truncate">
                Thông tin cơ bản
                {draft && step === 2 && (
                  <span className="text-xs font-normal text-muted-foreground">
                    (Nhấp để chỉnh sửa)
                  </span>
                )}
              </p>
            </div>
          </div>

          <div
            className={cn(
              "p-4 rounded-xl border flex items-center gap-3 transition-all",
              step === 2
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-card/30 text-muted-foreground",
            )}
          >
            <div
              className={cn(
                "size-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                step === 2
                  ? "bg-primary text-black"
                  : "bg-muted text-muted-foreground",
              )}
            >
              2
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Bước 2
              </p>
              <p className="text-sm font-bold truncate">Tải lên tệp đa phương tiện & build</p>
            </div>
          </div>
        </div>

        {/* Existing draft notification if on step 2 */}
        {step === 2 && draft && (
          <div className="mb-6 p-4 rounded-xl border border-primary/30 bg-primary/5 flex items-center justify-between gap-4">
            <div className="text-sm">
              <span className="font-semibold text-primary">Bản nháp đang mở: </span>
              <span className="text-foreground">"{draft.title}"</span>. Bạn có thể tiếp tục tải file lên hoặc quay lại sửa thông tin cơ bản.
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 shrink-0"
            >
              <Edit3 size={13} /> Sửa thông tin
            </button>
          </div>
        )}

        {/* Step Forms */}
        {step === 1 ? (
          <GameDraftForm
            draft={draft}
            onSuccess={(savedDraft) => {
              setDraft(savedDraft);
              setStep(2);
            }}
          />
        ) : (
          draft && (
            <GameUploadFilesForm
              draft={draft}
              onBack={() => setStep(1)}
              onSuccess={(publishedGame) => {
                navigate(`/play/${publishedGame.id}`);
              }}
            />
          )
        )}
      </div>
    </section>
  );
};

export default UploadGame;
