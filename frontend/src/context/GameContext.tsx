import { type GameTag, type Game } from "@/types/Game";
import React, { createContext, useState } from "react";

interface GameContext {
  games: Game[];
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  tags: GameTag[];
  setTags: React.Dispatch<React.SetStateAction<GameTag[]>>;
}

export const GameContext = createContext<GameContext | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<GameTag[]>([]);

  return (
    <GameContext.Provider
      value={{ games, setGames, loading, setLoading, tags, setTags }}
    >
      {children}
    </GameContext.Provider>
  );
};
