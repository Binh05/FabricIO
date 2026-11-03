import { useEffect, useRef } from "react";
import { GameCard } from "@/components/games/GameCard";
import { GamePageSkeleton } from "@/components/skeletons/GamePageSkeleton";
import NotGame from "@/components/games/NotGame";
import { useGame } from "@/hooks/useGame";
import type { GameTag } from "@/types/Game";
import { useSearchParams } from "react-router-dom";
import AppPagination from "@/components/common/AppPagination";

export interface Filter {
  price: string;
  tags: GameTag[];
  rating: number;
  sort: string;
}

export const Games = () => {
  const { loading, games, fetchGames, totalPages } = useGame();
  const [searchParams, setSearchParam] = useSearchParams();
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const currentPage = Number(searchParams.get("p")) || 1;
  const keyword = searchParams.get("q") || "";

  useEffect(() => {
    if (!loading) fetchGames(keyword, currentPage - 1, 70);

    if (!gameContainerRef?.current) return;
    window.scroll({
      top: gameContainerRef.current.offsetTop - 100,
      behavior: "smooth",
    });
  }, [currentPage]);

  if (loading) {
    return <GamePageSkeleton />;
  }

  const handlePageChange = (page: number) => {
    setSearchParam({ p: page.toString() });
  };

  return (
    <section className="mb-16">
      <div className="flex flex-col lg:flex-row">

        {/* Danh sách GameCard */}
        {games.length === 0 ? (
          <NotGame />
        ) : (
          <div className="flex-1" ref={gameContainerRef}>
            <div className="mb-8 flex items-end justify-between">
              <h1 className="text-4xl font-bold uppercase">
                Hot Games
              </h1>
            </div>
            {games.length ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-1.5 sm:gap-3">
                  {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
                <div className="mt-10">
                  <AppPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              <div className="bg-card border-border rounded-lg border p-12 text-center">
                <h3 className="mb-2 text-xl font-bold">
                  Hiện chưa có trò chơi nào
                </h3>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
