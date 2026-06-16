import type { Filter } from "@/pages/Games";
import type { GameTag } from "@/types/Game";
import type React from "react";

interface GameFilterProps {
  filters: Filter;
  setFilters: React.Dispatch<React.SetStateAction<Filter>>;
  tags: GameTag[];
  toggleTag: (tag: GameTag) => void;
}

const GameFilter = ({
  filters,
  setFilters,
  tags,
  toggleTag,
}: GameFilterProps) => {
  return (
    <aside className="bg-card border-border top-30 h-fit w-full rounded-lg border p-6 lg:w-70">
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
        <div className="flex max-h-75 scrollbar-thin flex-col gap-2.5 overflow-y-auto pr-2">
          {tags.map((tag: GameTag) => (
            <label
              key={tag.id}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <input
                type="checkbox"
                checked={filters.tags.some((t) => t.id === tag.id)}
                onChange={() => toggleTag(tag)}
                className="accent-primary rounded"
              />
              <span className="text-sm">{tag.name}</span>
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
  );
};

export default GameFilter;
