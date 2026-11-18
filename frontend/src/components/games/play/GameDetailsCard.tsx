import { Card } from "@/components/ui/card";
import type { Game } from "@/types/Game";

interface GameDetailsCardProps {
  game: Game;
}

export function GameDetailsCard({ game }: GameDetailsCardProps) {
  const rating = game.avgRating ? game.avgRating.toFixed(1) : "0.0";
  const releasedDate = game.createdAt
    ? new Date(game.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <Card className="border-border-subtle bg-surface-container-low rounded-sm p-6 sm:p-7">
      <div className="min-w-0">
        <h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">{game.title}</h1>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed sm:text-sm">
          {game.description?.split("\n")[0] ?? ""}
        </p>
      </div>
      <div className="my-6 flex flex-col gap-3 text-sm">
        {[
          ["Rating:", rating, "text-primary text-base leading-none font-bold sm:text-lg"],
          ["Votes:", `${game.ratingCount ?? 0} ratings`, "text-foreground text-xs font-medium sm:text-sm"],
          ["Released:", releasedDate, "text-foreground text-xs font-medium sm:text-sm"],
          ["Platforms:", "Browser (desktop, mobile, tablet)", "text-foreground text-xs font-medium sm:text-sm"],
          ["Orientation:", "Landscape", "text-foreground text-xs font-medium sm:text-sm"],
        ].map(([label, value, valueClass]) => (
          <div key={label} className="flex items-baseline">
            <span className="text-muted-foreground w-28 shrink-0 text-xs sm:w-32 sm:text-sm">{label}</span>
            <span className={valueClass}>{value}</span>
          </div>
        ))}
      </div>
      <div className="border-border-subtle/40 flex flex-wrap items-center gap-2 border-t pt-2">
        {game.tags.map((tag) => (
          <span
            key={tag.id}
            className="bg-surface-container-high/50 hover:bg-surface-container-highest border-border-subtle text-foreground inline-flex cursor-default items-center rounded-md border px-3 py-1.5 text-xs font-medium transition-colors"
          >
            {tag.name}
          </span>
        ))}
      </div>
    </Card>
  );
}
