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
  totalPages: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  totalElements: number;
  setTotalElements: React.Dispatch<React.SetStateAction<number>>;
}

export const GameContext = createContext<GameContext | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
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
        totalPages,
        setTotalPages,
        totalElements,
        setTotalElements,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
