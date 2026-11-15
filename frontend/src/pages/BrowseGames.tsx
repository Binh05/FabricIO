import { useEffect, useMemo, useState } from "react";
import { ChevronDown, SearchX } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import AppPagination from "@/components/common/AppPagination";
import { GameCard } from "@/components/games/GameCard";
import { GamePageSkeleton } from "@/components/skeletons/GamePageSkeleton";
import NotGame from "@/components/games/NotGame";
import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/useGame";
import type { GameTag } from "@/types/Game";

export interface Filter {
  price: string;
  tags: GameTag[];
  rating: number;
  sort: string;
}

type PriceFilter = "all" | "free" | "paid";
type SortOption = "rating" | "newest" | "price";

const PAGE_SIZE = 12;

export const BrowseGames = () => {
  const {
    loading,
    games,
    fetchGames,
    totalPages,
    totalElements,
    tags,
  } = useGame();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("rating");

  const pageParam = Number(searchParams.get("p"));
  const currentPage =
    Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const keyword = searchParams.get("q")?.trim() ?? "";

  useEffect(() => {
    void fetchGames(keyword, currentPage - 1, PAGE_SIZE);
  }, [currentPage, fetchGames, keyword]);

  const filteredGames = useMemo(() => {
    const filtered = games.filter((game) => {
      const matchesTag =
        selectedTag === null ||
        game.tags.some((tag) => tag.id === selectedTag);
      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "free" ? game.price === 0 : game.price > 0);

      return matchesTag && matchesPrice;
    });

    return filtered.sort((first, second) => {
      if (sortOption === "rating") {
        return second.avgRating - first.avgRating;
      }
      if (sortOption === "price") {
        return first.price - second.price;
      }
      return Date.parse(second.createdAt) - Date.parse(first.createdAt);
    });
  }, [games, priceFilter, selectedTag, sortOption]);

  const handlePageChange = (page: number) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      next.set("p", page.toString());
      return next;
    });
  };

  const resultCount = totalElements || games.length;

  if (loading) {
    return <GamePageSkeleton />;
  }

  return (
    <div className="mx-auto w-full px-4 pb-16 lg:px-8">
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
        ) : filteredGames.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-border-subtle bg-surface-container-low px-6 text-center">
            <SearchX aria-hidden="true" className="mb-3 text-muted-foreground" />
            <h3 className="font-semibold">No games match these filters</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different genre or price range.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSelectedTag(null);
                setPriceFilter("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {filteredGames.map((game) => (
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
