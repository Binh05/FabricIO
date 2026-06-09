import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useApp } from "@/context/AppContext";
import { Stars } from "./Stars";
import type { Game } from "@/types/Game";

interface GameDetailPanelProps {
  game: Game;
}

const GameDetailPanel = ({ game }: GameDetailPanelProps) => {
  const { toggleFavorite, favorites, showToast } = useApp();

  const isFavorite = favorites.has(game.id);

  const formatCompact = (value) =>
    Intl.NumberFormat("en", { notation: "compact" }).format(value);

  return (
    <aside className="detail-sidebar">
      <div className="bg-card border-border flex flex-col gap-6 rounded-lg border p-6">
        <div className="bg-primary/10 text-primary border-primary/20 self-start rounded-full border px-3 py-1 text-[13px] font-bold tracking-wider uppercase">
          {"trending"}
        </div>
        <h1 className="text-foreground text-3xl font-extrabold tracking-tight first-letter:uppercase">
          {game.title}
        </h1>
        <div className="text-muted">
          by{" "}
          <span className="text-foreground font-medium capitalize">
            {game.ownerName}
          </span>
        </div>
        <div className="border-border flex items-center justify-between border-y py-2">
          <span
            className={`text-2xl font-extrabold ${game.price === 0 ? "text-success" : "text-warning"}`}
          >
            {game.price === 0 ? "Free" : `$${game.price}`}
          </span>
          <div className="text-muted flex flex-col items-end text-[12px]">
            <span>{formatCompact(90000)} views</span>
            <span>{formatCompact(12000)} downloads</span>
          </div>
        </div>
        <Stars rating={game.ratingAvg} />
        <div className="flex flex-wrap gap-2">
          {game.tags.map((tag) => (
            <span
              key={tag.id}
              className="text-muted border-border rounded-full border bg-white/5 px-3 py-1 text-[13px]"
            >
              {tag.name}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <Button variant="gradient" onClick={() => showToast("Added to cart")}>
            {game.price === 0 ? "Download" : "Buy Now"}
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/play/${game.id}`}>Play</Link>
          </Button>
          <Button
            variant="outline"
            className={
              isFavorite ? "bg-primary/10 border-primary/30 text-primary" : ""
            }
            onClick={() => toggleFavorite(game.id)}
          >
            {isFavorite ? "Favorited" : "Add to Favorite"}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default GameDetailPanel;
