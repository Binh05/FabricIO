import type { Game } from "@/types/Game";
import React, { createContext, useState } from "react";

interface GameContext {
  games: Game[];
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GameContext = createContext<GameContext | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <GameContext.Provider value={{ games, setGames, loading, setLoading }}>
      {children}
    </GameContext.Provider>
  );
};
