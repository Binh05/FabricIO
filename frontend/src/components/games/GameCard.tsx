import { Link } from "react-router-dom";
// import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
// import { Button } from "../ui/button";
import type { Game } from "@/types/Game";

interface GameCardProps {
  game: Game;
  className?: string;
}

export const GameCard = ({ game, className }: GameCardProps) => {
  // const isFavorite = false;

  // const isMyGame = () => {
  //   const dev = String(game.ownerName || "")
  //     .trim()
  //     .toLowerCase();
  //   return (
  //     dev === String(user.name).toLowerCase() ||
  //     dev === String(user.username).toLowerCase()
  //   );
  // };

  const formatPrice = (price: number) =>
    price === 0 ? "Free" : `$${price.toFixed(2)}`;

  return (
    <Link
      to={`/game-detail/${game.id}`}
      className={cn(
        className,
        "bg-card border-border hover:border-primary/30 relative overflow-hidden rounded-lg border transition-all duration-300 ease-in-out hover:-translate-y-2",
      )}
    >
      <div className="h-50 overflow-hidden">
        <img
          className="h-full w-full object-cover"
          src={game.thumbnailUrl}
          alt={game.title}
        />
      </div>
      {/* <Button
        className={cn(
          "border-border hover:bg-primary/10 hover:border-primary/30 hover:text-primary bg-muted/30 absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200",
          isFavorite
            ? "bg-primary/10 border-primary/30 text-primary"
            : "text-muted",
        )}
        onClick={() => {}}
      >
        <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
      </Button> */}
      <div className="flex flex-col gap-4 px-6 py-4">
        <div className="flex justify-between">
          <div>
            <h3 className="block text-lg font-bold capitalize">{game.title}</h3>
            <p className="text-muted line-clamp-2 text-sm first-letter:uppercase">
              {game.description}
            </p>
          </div>
          <div
            className={cn(
              "text-lg font-extrabold",
              game.price === 0 ? "text-success" : "text-warning",
            )}
          >
            {formatPrice(game.price)}
          </div>
        </div>
      </div>
    </Link>
  );
};
