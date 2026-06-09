import { Link } from "react-router-dom";
import { GameCard } from "@/components/games/GameCard";
import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/useGame";
import { useEffect } from "react";

const SectionHeading = ({ title, subtitle = "", action = null }) => (
  <div className="mb-8 flex items-end justify-between">
    <div>
      <h2 className="text-[32px] font-extrabold tracking-[-1px]">{title}</h2>
      {subtitle && <p className="text-muted">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const Home = () => {
  const { games, loading, fetchGames } = useGame();

  useEffect(() => {
    const init = async () => {
      await fetchGames();
    };

    init();
  }, []);

  if (loading || games.length < 1) return;

  return (
    <>
      <section className="from-primary/10 border-border mb-16 grid grid-cols-1 items-center gap-15 rounded-[40px] border bg-linear-to-br to-transparent p-10 md:p-15 xl:grid-cols-2">
        <div className="hero-copy">
          <span className="text-primary mb-2 block text-[13px] font-bold tracking-[2px] uppercase">
            Featured Drop
          </span>
          <h1 className="mb-6 text-[32px] leading-[1.1] font-extrabold tracking-[-2px] md:text-[48px]">
            Discover indie games and creator updates in one dark, modern hub.
          </h1>
          <p className="text-muted mb-8 text-lg">
            GameStore blends dense discovery with a modern interface designed
            for player interaction and creator storytelling.
          </p>
          <div className="flex gap-4">
            <Button variant="gradient" asChild className="p-6 text-xl">
              <Link to={`/game-detail/${games[0].id}`}>Play Now</Link>
            </Button>
            <Button variant="outline" asChild className="p-6 text-xl">
              <Link to="/games">View Games</Link>
            </Button>
          </div>
        </div>
        <div className="relative">
          <img
            className="w-full rounded-lg shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
            src={games[0].thumbnailUrl}
            alt={games[0].title}
          />
          <div className="border-border absolute -bottom-5 -left-5 hidden rounded-[20px] border bg-[#1a1a1a]/80 p-5 shadow-[0_15px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl md:block">
            <div className="text-muted mb-1 text-sm">Trending tonight</div>
            <h3 className="text-lg font-bold">{games[1].title}</h3>
            <div className="mt-2 flex items-center justify-between gap-4">
              <span className="text-warning font-extrabold">
                ${games[1].price}
              </span>
              <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-1 text-[13px] font-bold">
                {games[1]?.tags[0].name}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <SectionHeading
          title="Featured Games"
          subtitle="Curated highlights with strong cover art, ratings, and tags."
          action={
            <Button variant="outline" asChild>
              <Link to="/games">Browse all</Link>
            </Button>
          }
        />
        <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2 xl:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* <section className="mb-16">
        <SectionHeading
          title="Trending Now"
          subtitle="A horizontal discovery rail inspired by storefront browsing."
        />
        <div className="scrollbar-hide flex gap-5 overflow-x-auto pb-5">
          {trending.map((game) => (
            <GameCard game={game} compact={true} className="min-w-90" />
          ))}
        </div>
      </section> */}
    </>
  );
};
