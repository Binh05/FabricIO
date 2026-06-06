import { createContext, useContext, useState, useEffect } from 'react';
import { initialGames, users } from '../data/mockData';

const STORAGE_KEYS = {
  draft: "gamestore-submit-draft",
  games: "gamestore-custom-games",
  favorites: "gamestore-favorites",
  ratings: "gamestore-ratings",
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user] = useState(users[0]);
  const [games, setGames] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.games) || "[]");
    return [...saved, ...initialGames];
  });
  const [favorites, setFavorites] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || "[2, 4]");
    return new Set(saved);
  });
  const [ratings, setRatings] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.ratings) || '{"1":5, "2":4, "4":5}');
    return saved;
  });
  const [toasts, setToasts] = useState([]);
  const [draft, setDraft] = useState(() => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.draft) || "null");
  });

  useEffect(() => {
    const customGames = games.filter(g => g.isCustom);
    localStorage.setItem(STORAGE_KEYS.games, JSON.stringify(customGames));
  }, [games]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([...favorites]));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ratings, JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(draft));
  }, [draft]);

  const showToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast("Removed from favorites");
      } else {
        next.add(id);
        showToast("Added to favorites");
      }
      return next;
    });
  };

  const addGame = (gameData) => {
    setGames((prev) => [gameData, ...prev]);
    setDraft(null);
  };

  const updateGame = (id, gameData) => {
    setGames((prev) => prev.map(g => g.id === id ? { ...g, ...gameData } : g));
    setDraft(null);
  };

  const rateGame = (gameId, rating) => {
    setRatings(prev => ({ ...prev, [gameId]: rating }));
    showToast(`Rated ${rating} stars`);
  };

  return (
    <AppContext.Provider value={{
      user,
      games,
      favorites,
      ratings,
      toasts,
      draft,
      setDraft,
      showToast,
      toggleFavorite,
      addGame,
      updateGame,
      rateGame
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
