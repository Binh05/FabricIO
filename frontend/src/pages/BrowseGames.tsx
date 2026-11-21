import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AppPagination from "@/components/common/AppPagination";
import { GameCard } from "@/components/games/GameCard";
import { GamePageSkeleton } from "@/components/skeletons/GamePageSkeleton";
import NotGame from "@/components/games/NotGame";
import { useGame } from "@/hooks/useGame";

const PAGE_SIZE = 12;

export const BrowseGames = () => {
  const { loading, games, fetchGames, totalPages } = useGame();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = Number(searchParams.get("p"));
  const currentPage =
    Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const keyword = searchParams.get("q")?.trim() ?? "";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    void fetchGames(keyword, currentPage - 1, PAGE_SIZE);
  }, [currentPage, fetchGames, keyword]);

  const handlePageChange = (page: number) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      next.set("p", page.toString());
      return next;
    });
  };

  if (loading) {
    return <GamePageSkeleton />;
  }

  return (
    <div className="mx-auto w-full pb-16 sm:px-3 lg:px-8">
      <section aria-labelledby="games-heading" className="mt-4">
        <div className="mb-6 flex lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1
              id="games-heading"
              className="text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Hot games
            </h1>
          </div>
        </div>

        {games.length === 0 ? (
          <NotGame />
        ) : (
          <div className="grid grid-cols-2 gap-1.5 md:grid-cols-4 md:gap-3">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}

        {games.length > 0 && (
          <div className="mt-8">
            <AppPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </section>
    </div>
  );
};
