import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { GameCard } from "@/components/games/GameCard";

export const Games = () => {
  const { games } = useApp();
  const [filters, setFilters] = useState({
    price: "all",
    tags: [],
    rating: 0,
    sort: "popular",
  });

  const ALL_TAGS = useMemo(
    () => [...new Set(games.flatMap((game) => game.tags))],
    [games],
  );

  const filteredGames = useMemo(() => {
    let result = [...games];

    if (filters.price === "free")
      result = result.filter((game) => game.price === 0);
    if (filters.price === "paid")
      result = result.filter((game) => game.price > 0);
    if (filters.rating > 0)
      result = result.filter((game) => game.rating >= filters.rating);
    if (filters.tags.length) {
      result = result.filter((game) =>
        filters.tags.every((tag) => game.tags.includes(tag)),
      );
    }

    const sorters = {
      newest: (a, b) => b.id - a.id,
      popular: (a, b) => (b.likes || 0) - (a.likes || 0),
      price: (a, b) => a.price - b.price,
    };

    return result.sort(sorters[filters.sort]);
  }, [games, filters]);

  const toggleTag = (tag) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
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
        <aside className="bg-card border-border top-[120px] h-fit w-full rounded-lg border p-6 lg:w-[280px]">
          <div className="mb-6">
            <h3 className="text-muted mb-4 text-[12px] font-bold tracking-wider uppercase">
              Price
            </h3>
            <div className="flex flex-col gap-2.5">
              {["all", "free", "paid"].map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-2.5"
                >
                  <input
                    type="radio"
                    name="price"
                    value={option}
                    checked={filters.price === option}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, price: e.target.value }))
                    }
                    className="accent-primary"
                  />
                  <span className="text-sm">
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-muted mb-4 text-[12px] font-bold tracking-wider uppercase">
              Tags
            </h3>
            <div className="flex max-h-[300px] scrollbar-thin flex-col gap-2.5 overflow-y-auto pr-2">
              {ALL_TAGS.map((tag: string) => (
                <label
                  key={tag}
                  className="flex cursor-pointer items-center gap-2.5"
                >
                  <input
                    type="checkbox"
                    checked={filters.tags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                    className="accent-primary rounded"
                  />
                  <span className="text-sm">{tag}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-muted mb-4 text-[12px] font-bold tracking-wider uppercase">
              Minimum Rating
            </h3>
            <select
              className="border-border w-full rounded-lg border bg-black/20 p-2.5 text-white outline-none"
              value={filters.rating}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  rating: Number(e.target.value),
                }))
              }
            >
              <option value="0">All ratings</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="4.5">4.5+</option>
            </select>
          </div>
          <div className="mb-6">
            <h3 className="text-muted mb-4 text-[12px] font-bold tracking-wider uppercase">
              Sort
            </h3>
            <select
              className="border-border w-full rounded-lg border bg-black/20 p-2.5 text-white outline-none"
              value={filters.sort}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sort: e.target.value }))
              }
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="price">Price</option>
            </select>
          </div>
        </aside>
        <div className="flex-1">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-bold">
              {filteredGames.length} games found
            </h2>
            <div className="flex flex-wrap gap-2">
              {filters.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-primary/10 text-primary border-primary/20 cursor-pointer rounded-full border px-3 py-1 text-[13px]"
                  onClick={() => toggleTag(tag)}
                >
                  {tag} ×
                </span>
              ))}
            </div>
          </div>
          {filteredGames.length ? (
            <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="bg-card border-border rounded-lg border p-12 text-center">
              <h3 className="mb-2 text-xl font-bold">
                Hiện chưa có trò chơi nào
              </h3>
              <p className="text-muted text-sm">
                Try clearing a few filters to see more releases.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
