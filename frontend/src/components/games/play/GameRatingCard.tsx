import { useEffect, useRef, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { useGame } from "@/hooks/useGame";
import { useAuth } from "@/hooks/useAuth";

interface GameRatingCardProps {
  gameId: string;
}

const DEBOUNCE_DELAY = 500;

const GameRatingCard = ({ gameId }: GameRatingCardProps) => {
  const { fetchMyRating, upsertGameRating, deleteGameRating } = useGame();
  const { token } = useAuth();
  const [selectedRating, setSelectedRating] = useState(0);
  const [savedRating, setSavedRating] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const ratingRequestId = useRef(0);

  useEffect(() => {
    let isMounted = true;

    if (!token) {
      return;
    }

    void fetchMyRating(gameId)
      .then((rating) => {
        if (!isMounted) return;
        const stars = rating?.stars ?? 0;
        setSelectedRating(stars);
        setSavedRating(stars);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [fetchMyRating, gameId, token]);

  useEffect(() => {
    if (!token || selectedRating === 0 || selectedRating === savedRating) return;

    const requestId = ++ratingRequestId.current;
    const timeoutId = window.setTimeout(async () => {
      setIsSaving(true);
      try {
        const rating = await upsertGameRating(gameId, selectedRating);
        if (requestId === ratingRequestId.current) {
          setSavedRating(rating.stars);
        }
      } catch {
        if (requestId === ratingRequestId.current) {
          setSelectedRating(savedRating);
        }
      } finally {
        if (requestId === ratingRequestId.current) {
          setIsSaving(false);
        }
      }
    }, DEBOUNCE_DELAY);

    return () => window.clearTimeout(timeoutId);
  }, [gameId, savedRating, selectedRating, token, upsertGameRating]);

  const handleDelete = async () => {
    if (!token) {
      toast.error("Chưa đăng nhập");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteGameRating(gameId);
      setSelectedRating(0);
      setSavedRating(0);
      toast.success("Đã xóa đánh giá");
    } catch {
      // The hook displays the API error.
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRatingClick = (value: number) => {
    if (!token) {
      toast.error("Chưa đăng nhập");
      return;
    }

    setSelectedRating(value);
  };

  const displayedRating = token ? selectedRating : 0;

  return (
    <Card className="border-border-subtle bg-surface-container-low rounded-sm p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-foreground text-base font-bold sm:text-lg">
          Đánh giá của bạn:
        </span>
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Đánh giá game">
          {Array.from({ length: 5 }, (_, index) => {
            const value = index + 1;
            const isFilled = value <= displayedRating;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={displayedRating === value}
                aria-label={`${value} sao`}
                disabled={isSaving || isDeleting}
                onClick={() => handleRatingClick(value)}
                className="text-primary transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Star size={24} fill={isFilled ? "currentColor" : "none"} />
              </button>
            );
          })}
        </div>
        <span className="text-muted-foreground text-xs sm:text-sm">
          {isSaving ? "Đang lưu..." : "Nhấp để thêm sao"}
        </span>
        {token && savedRating > 0 && (
          <button
            type="button"
            onClick={() => void handleDelete()}
            disabled={isSaving || isDeleting}
            aria-label="Xóa đánh giá"
            title="Xóa đánh giá"
            className="text-muted-foreground hover:text-destructive ml-auto inline-flex items-center gap-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={16} />
            <span>Xóa</span>
          </button>
        )}
      </div>
    </Card>
  );
};

export default GameRatingCard;