import { useRef } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Game } from "@/types/Game";

export interface GameCardProps {
  game: Game;
  className?: string;
}

export const GameCard = ({
  game,
  className,
}: GameCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = 0;
    void videoRef.current.play().catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        return;
      }
      console.error("Could not preview game video", error);
    });
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const authorName =
    game.author?.fullName?.trim() ||
    (game as unknown as { studio?: string }).studio ||
    "Indie Creator";

  const rating = game.avgRating > 0 ? game.avgRating : 5;
  const count =
    game.ratingCount ? game.ratingCount : 0;
  const formattedRatingCount = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  })
    .format(count)
    .toLowerCase();

  const isFree = game.price === 0;
  const formattedPrice = isFree
    ? "Free"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(game.price);

  return (
    <Link
      to={`/play/${game.id}`}
      aria-label={`Play ${game.title}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-sm bg-surface-container-low transition-all duration-300 hover:-translate-y-1 hover:border-border-chip hover:shadow-xl hover:shadow-black/50",
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative mb-0 aspect-16/10 overflow-hidden rounded-t-sm bg-surface-container-lowest">
        {/* Badges in top-left */}
        <div>
          {game.tags?.length > 0 && (
            <div className="absolute top-2 left-2 rounded-xs bg-background/80 px-2 py-1 text-xs font-semibold text-muted-foreground shadow-md shadow-black/20">
              {game.tags[0].name}
            </div>
          )}
        </div>

        {/* Thumbnail artwork */}
        <img
          className={cn(
            "size-full object-cover transition-transform duration-500 group-hover:scale-105",
            game.videoUrl && "group-hover:opacity-0",
          )}
          src={game.thumbnailUrl}
          alt={`${game.title} artwork`}
          loading="lazy"
        />

        {/* Hover preview video */}
        {game.videoUrl && (
          <video
            ref={videoRef}
            className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            src={game.videoUrl}
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-2 md:py-6 md:px-4">
        <h3 className="truncate text-sm sm:text-xl font-bold text-foreground transition-colors group-hover:text-primary">
          {game.title}
        </h3>
        <p className="mt-0.5 font-mono truncate text-xs sm:text-sm text-muted-foreground">{authorName}</p>

        <div className="mt-3 p-2 rounded-xs font-mono flex items-center bg-background justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-1">
            <Star
              aria-hidden="true"
              size={13}
              className="fill-secondary-foreground text-secondary-foreground"
            />
            <span className="font-semibold text-secondary-foreground">
              {rating.toFixed(1)}
            </span>
            <span className="text-muted-foreground">({formattedRatingCount})</span>
          </div>

          <span
            className={cn(
              "font-semibold",
              isFree ? "text-secondary-foreground" : "text-foreground",
            )}
          >
            {formattedPrice}
          </span>
        </div>
      </div>
    </Link>
  );
};
