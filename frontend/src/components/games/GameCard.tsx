import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Stars } from "@/components/games/Stars";
import { Heart, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export const GameCard = ({
  game,
  compact = false,
  className,
}: {
  game: any;
  compact?: boolean;
  className?: string;
}) => {
  const { toggleFavorite, favorites, user, showToast } = useApp();
  const isFavorite = favorites.has(game.id);

  const isMyGame = () => {
    const dev = String(game.developer || "")
      .trim()
      .toLowerCase();
    return (
      dev === String(user.name).toLowerCase() ||
      dev === String(user.username).toLowerCase()
    );
  };

  const formatPrice = (price) =>
    price === 0 ? "Free" : `$${price.toFixed(2)}`;

  return (
    <div
      className={cn(
        className,
        "bg-card border-border hover:border-primary/30 overflow-hidden rounded-lg border transition-all duration-300 ease-in-out hover:-translate-y-2",
      )}
    >
      <div className="h-50 overflow-hidden">
        <img
          className="h-full w-full object-cover"
          src={game.heroImage}
          alt={game.title}
        />
      </div>
      <div className="flex flex-col gap-4 p-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-bold">{game.title}</h3>
            <div className="text-muted text-sm">{game.developer}</div>
          </div>
          <Button
            className={`border-border hover:bg-primary/10 hover:border-primary/30 hover:text-primary flex h-10 w-10 items-center justify-center rounded-xl border bg-white/5 transition-all duration-200 ${isFavorite ? "bg-primary/10 border-primary/30 text-primary" : "text-muted"}`}
            onClick={() => toggleFavorite(game.id)}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {game.tags.map((tag) => (
            <span
              key={tag}
              className="text-muted border-border rounded-full border bg-white/5 px-3 py-1 text-[13px]"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span
            className={`text-lg font-extrabold ${game.price === 0 ? "text-success" : "text-warning"}`}
          >
            {formatPrice(game.price)}
          </span>
          <span className="stat-badge">
            <Stars rating={game.rating} />
          </span>
        </div>
        {!compact && (
          <>
            <p className="text-muted line-clamp-2 text-sm">
              {game.description}
            </p>
            <div className="mt-auto flex items-center gap-2">
              {game.price === 0 ? (
                <Button variant="gradient" className="p-6" asChild>
                  <Link
                    to={`/play/${game.id}`}
                  >
                    Play
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="gradient"
                  className="p-6"
                  onClick={() => showToast("Buyed")}
                >
                  Buy
                </Button>
              )}
              {isMyGame() && (
                <Link
                  className="text-muted border-border inline-flex cursor-pointer items-center justify-center rounded-sm border bg-transparent px-5 py-2.5 font-semibold transition-all duration-200 hover:bg-white/5 hover:text-white"
                  to={`/submit-game?edit=${game.id}`}
                >
                  Edit
                </Link>
              )}
              <Button className="border-border text-muted hover:bg-primary/10 hover:border-primary/30 hover:text-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border bg-white/5 transition-all duration-200">
                <ThumbsUp size={16} />
              </Button>
              <Button className="border-border text-muted hover:bg-primary/10 hover:border-primary/30 hover:text-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border bg-white/5 transition-all duration-200">
                <ThumbsDown size={16} />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
