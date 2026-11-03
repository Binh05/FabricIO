import { Link } from "react-router-dom";
import { cn, getYearFromISOString } from "@/lib/utils";
import type { Game } from "@/types/Game";

interface GameCardProps {
  game: Game;
  className?: string;
}

export const GameCard = ({ game, className }: GameCardProps) => {

  return (
    <Link
      to={`/play/${game.id}`}
      className={cn(
        className,
        "group bg-card border-border aspect-video hover:border-primary/30 relative overflow-hidden rounded-lg border transition-all duration-300 ease-in-out hover:scale-120 hover:z-100",
      )}
    >
      <div className="h-35 overflow-hidden">
        <img
          className={cn("h-full w-full object-cover", game?.videoUrl ? "hidden" : "")}
          src={game.thumbnailUrl}
          alt={game.title}
        />
        {game.videoUrl && (
          <video
            className="h-full w-full object-cover"
            src={game.videoUrl}
            autoPlay
            loop
            muted
          />
        )}
        <div className="absolute opacity-0 group-hover:opacity-100 bottom-0 inset-x-0 h-[50%] bg-linear-to-t from-primary/60 via-primary/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 px-3 py-1.5 truncate w-full text-xs opacity-0 group-hover:opacity-100 
          translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <h1 className="font-bold text-sm">{game.title}</h1>
          <div className="flex gap-3 items-center">
            <span className="bg-primary/60 rounded-full px-2 py-1">{game.tags[0]?.name}</span>
            <span>{getYearFromISOString(game.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
