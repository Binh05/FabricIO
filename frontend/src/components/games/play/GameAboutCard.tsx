import { Card } from "@/components/ui/card";
import type { Game } from "@/types/Game";

interface GameAboutCardProps {
  game: Game;
}

export function GameAboutCard({ game }: GameAboutCardProps) {
  return (
    <Card className="border-border-subtle bg-surface-container-low rounded-sm p-6 sm:p-7">
      <div className="flex items-center gap-2.5">
        <div aria-hidden="true" className="text-primary flex shrink-0 flex-col gap-1">
          <span className="bg-primary h-0.5 w-4 rounded-full" />
          <span className="bg-primary h-0.5 w-2.5 rounded-full" />
          <span className="bg-primary h-0.5 w-3.5 rounded-full" />
        </div>
        <h2 className="text-foreground text-lg font-bold tracking-tight sm:text-xl">About the Game</h2>
      </div>
      <p className="text-muted-foreground mt-3 text-xs leading-relaxed sm:text-sm">{game.description}</p>
    </Card>
  );
}
