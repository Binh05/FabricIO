import type { Game } from "@/types/Game";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const GameFeaturedDrop = ({ game }: { game: Game }) => {
  return (
    <section className="from-primary/10 border-border mb-16 hidden grid-cols-1 items-center gap-15 rounded-[40px] border bg-linear-to-br to-transparent p-10 md:grid md:p-15 xl:grid-cols-2">
      <div className="hero-copy">
        <span className="text-primary mb-2 block text-[13px] font-bold tracking-[2px] uppercase">
          Featured Drop
        </span>
        <h1 className="mb-6 text-[32px] leading-[1.1] font-extrabold tracking-[-2px] md:text-[48px]">
          Discover indie games and creator updates in one dark, modern hub.
        </h1>
        <p className="text-muted mb-8 text-lg">
          GameStore blends dense discovery with a modern interface designed for
          player interaction and creator storytelling.
        </p>
        <div className="flex flex-col gap-4 md:flex-row">
          <Button variant="gradient" asChild className="p-6 text-xl">
            <Link to={`/game-detail/${game.id}`}>Play Now</Link>
          </Button>
          <Button variant="outline" asChild className="p-6 text-xl">
            <Link to="/games">View Games</Link>
          </Button>
        </div>
      </div>
      <div className="relative">
        <img
          className="w-full rounded-lg shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
          src={game.thumbnailUrl}
          alt={game.title}
        />
        <div className="border-border absolute -bottom-5 -left-5 hidden rounded-[20px] border bg-[#1a1a1a]/80 p-5 shadow-[0_15px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl md:block">
          <div className="text-muted mb-1 text-sm">Trending tonight</div>
          <h3 className="text-lg font-bold">{game.title}</h3>
          <div className="mt-2 flex items-center justify-between gap-4">
            <span className="text-warning font-extrabold">${game.price}</span>
            <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-1 text-[13px] font-bold">
              {game?.tags[0]?.name ?? ""}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameFeaturedDrop;
