import { Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";
import { GameCard } from "@/components/games/GameCard";
import type { Game } from "@/types/Game";

interface RelatedGamesProps {
  games: Game[];
}

export function RelatedGames({ games }: RelatedGamesProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 border-primary/40 text-primary flex size-6 items-center justify-center rounded-full border">
            <Gamepad2 className="fill-primary text-primary size-3.5" />
          </div>
          <h2 className="text-foreground text-lg font-bold tracking-tight">Related Games</h2>
        </div>
        <Link to="/games" className="text-primary text-xs font-semibold transition-all hover:underline sm:text-sm">
          View All
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {games.map((game) => <GameCard key={game.id} game={game} />)}
      </div>
    </div>
  );
}
