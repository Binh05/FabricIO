import { Link } from "react-router-dom";
import { GameCard } from "@/components/games/GameCard";
import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/useGame";
import React, { useEffect } from "react";
import GameFeaturedDrop from "@/components/games/GameFeaturedDrop";
import { HomeSkeleton } from "@/components/skeletons/HomeSkeleton";
import NotGame from "@/components/games/NotGame";

interface SectionHeadingProps {
  title: string;
  subtitle: string;
  action: React.ReactElement | null;
}

const SectionHeading = ({
  title,
  subtitle = "",
  action = null,
}: SectionHeadingProps) => (
  <div className="mb-8 flex items-end justify-between">
    <div>
      <h2 className="text-[32px] font-extrabold tracking-[-1px]">{title}</h2>
      {subtitle && <p className="text-muted">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const Home = () => {
  const { games, loading, fetchGames, fetchGameTags } = useGame();

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchGames("", 0, 10), fetchGameTags()]);
    };

    init();
  }, []);

  if (loading) {
    return <HomeSkeleton />;
  }

  if (games.length === 0) {
    return <NotGame />;
  }

  return (
    <>
      <GameFeaturedDrop game={games[0]} />

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
          {games.slice(0, 3).map((game) => (
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
