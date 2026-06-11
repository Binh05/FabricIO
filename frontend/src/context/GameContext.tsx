import { type GameTag, type Game } from "@/types/Game";
import React, { createContext, useState } from "react";

interface GameContext {
  games: Game[];
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  tags: GameTag[];
  setTags: React.Dispatch<React.SetStateAction<GameTag[]>>;
  tagLoading: boolean;
  setTagLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GameContext = createContext<GameContext | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [tags, setTags] = useState<GameTag[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tagLoading, setTagLoading] = useState<boolean>(false);

  return (
    <GameContext.Provider
      value={{
        games,
        setGames,
        loading,
        setLoading,
        tags,
        setTags,
        tagLoading,
        setTagLoading,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
