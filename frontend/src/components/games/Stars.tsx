import { Star } from "lucide-react";

interface StarsProps {
  rating?: number;
  interactive?: boolean;
  onRate?: (gameId: string, value: number) => void;
  gameId?: string;
}

export const Stars = ({
  rating = 0,
  interactive = false,
  onRate,
  gameId,
}: StarsProps) => {
  const rounded = Math.round(rating);

  return (
    <div
      className="flex items-center gap-2"
      role={interactive ? undefined : "img"}
      aria-label={interactive ? undefined : `Rated ${rating.toFixed(1)} out of 5`}
    >
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => {
          const value = index + 1;
          const filled = value <= rounded;
          return (
            <button
              key={index}
              type="button"
              aria-label={interactive ? `Rate ${value} stars` : undefined}
              aria-hidden={!interactive}
              tabIndex={interactive ? 0 : -1}
              disabled={!interactive || !onRate || !gameId}
              className={`${filled ? "text-cyan" : "text-white/20"} transition-colors duration-200 disabled:cursor-default`}
              onClick={() => {
                if (interactive && gameId) onRate?.(gameId, value);
              }}
            >
              <Star size={18} fill={filled ? "currentColor" : "none"} />
            </button>
          );
        })}
      </div>
      <span className="text-muted-foreground text-sm font-medium">
        {interactive ? `${rounded || 0}/5` : rating.toFixed(1)}
      </span>
    </div>
  );
};
