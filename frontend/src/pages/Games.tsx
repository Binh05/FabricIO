import { useState, useEffect } from "react";
import { GameCard } from "@/components/games/GameCard";
import { GamePageSkeleton } from "@/components/skeletons/GamePageSkeleton";
import NotGame from "@/components/games/NotGame";
import { useGame } from "@/hooks/useGame";
import type { GameTag } from "@/types/Game";
import { useSearchParams } from "react-router-dom";
import AppPagination from "@/components/common/AppPagination";
// import GameFilter from "@/components/games/GameFilter";

export interface Filter {
  price: string;
  tags: GameTag[];
  rating: number;
  sort: string;
}

export const Games = () => {
  const { loading, games, fetchGames, totalPages, totalElements } = useGame();
  const [filters, setFilters] = useState<Filter>({
    price: "all",
    tags: [],
    rating: 0,
    sort: "popular",
  });
  const [searchParams, setSearchParam] = useSearchParams();

  const currentPage = Number(searchParams.get("p")) || 1;

  useEffect(() => {
    fetchGames("", currentPage - 1, 9);
  }, [currentPage]);

  if (loading) {
    return <GamePageSkeleton />;
  }

  const toggleTag = (tag: GameTag) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.some((t) => t.id === tag.id)
        ? prev.tags.filter((t) => t.id !== tag.id)
        : [...prev.tags, tag],
    }));
  };

  const handlePageChange = (page: number) => {
    setSearchParam({ p: page.toString() });

    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section className="mb-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="text-primary mb-2 block text-[13px] font-bold tracking-[2px] uppercase">
            Game Library
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Browse curated releases
          </h1>
          <p className="text-muted">
            Filter by price, tag, rating, and sort order with instant updates.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-10 lg:flex-row">
        {/* <GameFilter
          filters={filters}
          setFilters={setFilters}
          tags={tags}
          toggleTag={toggleTag}
        /> */}

        {/* Danh sách GameCard */}
        {games.length === 0 ? (
          <NotGame />
        ) : (
          <div className="flex-1">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-2xl font-bold">
                {totalElements} games found
              </h2>
              <div className="flex flex-wrap gap-2">
                {filters.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="bg-primary/10 text-primary border-primary/20 cursor-pointer rounded-full border px-3 py-1 text-[13px]"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag.name} ×
                  </span>
                ))}
              </div>
            </div>
            {games.length ? (
              <>
                <div className="grid grid-cols-1 gap-7.5 md:grid-cols-3">
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
                <p className="text-muted text-sm">
                  Hãy thử loại bỏ vài bộ lọc để thấy thêm các sản phẩm.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
