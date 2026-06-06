import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { GameCard } from '@/components/games/GameCard';

export const Games = () => {
  const { games } = useApp();
  const [filters, setFilters] = useState({
    price: "all",
    tags: [],
    rating: 0,
    sort: "popular"
  });

  const ALL_TAGS = useMemo(() => [...new Set(games.flatMap((game) => game.tags))], [games]);

  const filteredGames = useMemo(() => {
    let result = [...games];

    if (filters.price === "free") result = result.filter((game) => game.price === 0);
    if (filters.price === "paid") result = result.filter((game) => game.price > 0);
    if (filters.rating > 0) result = result.filter((game) => game.rating >= filters.rating);
    if (filters.tags.length) {
      result = result.filter((game) => filters.tags.every((tag) => game.tags.includes(tag)));
    }

    const sorters = {
      newest: (a, b) => b.id - a.id,
      popular: (a, b) => (b.likes || 0) - (a.likes || 0),
      price: (a, b) => a.price - b.price
    };

    return result.sort(sorters[filters.sort]);
  }, [games, filters]);

  const toggleTag = (tag) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <span className="eyebrow">Game Library</span>
          <h1 className="page-title">Browse curated releases</h1>
          <p>Filter by price, tag, rating, and sort order with instant updates.</p>
        </div>
      </div>
      <div className="filter-layout">
        <aside className="panel filter-panel">
          <div className="filter-block">
            <h3 className="sidebar-title">Price</h3>
            <div className="radio-list">
              {["all", "free", "paid"].map((option) => (
                <label key={option} className="control">
                  <input 
                    type="radio" 
                    name="price" 
                    value={option} 
                    checked={filters.price === option} 
                    onChange={(e) => setFilters(prev => ({ ...prev, price: e.target.value }))}
                  />
                  <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="filter-block">
            <h3 className="sidebar-title">Tags</h3>
            <div className="checkbox-list">
              {ALL_TAGS.map((tag: string) => (
                <label key={tag} className="control">
                  <input 
                    type="checkbox" 
                    checked={filters.tags.includes(tag)} 
                    onChange={() => toggleTag(tag)}
                  />
                  <span>{tag}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="filter-block">
            <h3 className="sidebar-title">Minimum Rating</h3>
            <select 
              className="select" 
              value={filters.rating} 
              onChange={(e) => setFilters(prev => ({ ...prev, rating: Number(e.target.value) }))}
            >
              <option value="0">All ratings</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="4.5">4.5+</option>
            </select>
          </div>
          <div className="filter-block">
            <h3 className="sidebar-title">Sort</h3>
            <select 
              className="select" 
              value={filters.sort} 
              onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="price">Price</option>
            </select>
          </div>
        </aside>
        <div style={{ flex: 1 }}>
          <div className="section-head">
            <h2>{filteredGames.length} games found</h2>
            <div className="chip-row">
              {filters.tags.map((tag) => (
                <span key={tag} className="filter-chip active" onClick={() => toggleTag(tag)}>{tag}</span>
              ))}
            </div>
          </div>
          {filteredGames.length ? (
            <div className="grid game-grid">
              {filteredGames.map((game) => <GameCard key={game.id} game={game} />)}
            </div>
          ) : (
            <div className="panel empty-state">
              <h3>Hiện chưa có trò chơi nào</h3>
              <p className="muted-text">Try clearing a few filters to see more releases.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
