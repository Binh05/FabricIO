import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import { PlayPageSkeleton } from "@/components/skeletons/PlayPageSkeleton";
import type { Game } from "@/types/Game";
import GamePlayerBox from "@/components/games/play/GamePlayerBox";
import { GameAboutCard } from "@/components/games/play/GameAboutCard";
import { GameAuthorCard } from "@/components/games/play/GameAuthorCard";
import { GameDetailsCard } from "@/components/games/play/GameDetailsCard";
import { RelatedGames } from "@/components/games/play/RelatedGames";
import GameRatingCard from "@/components/games/play/GameRatingCard";
import { CommentSection } from "@/components/games/play/CommentSection";

export const Play = () => {
  const { id } = useParams<{ id: string }>();
  const { games, fetchGameById, fetchGames } = useGame();
  const { loading: authLoading } = useAuth();
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      if (!id) {
        setIsFetching(false);
        return;
      }

      setIsFetching(true);
      try {
        const [gameRes] = await Promise.all([
          fetchGameById(id).catch(() => null),
          games.length === 0 ? fetchGames("", 0, 10).catch(() => null) : Promise.resolve(),
        ]);

        if (!isMounted) return;
        if (gameRes) setCurrentGame(gameRes);
        window.scrollTo({ top: 30, behavior: "smooth" });
      } finally {
        if (isMounted) setIsFetching(false);
      }
    };

    void init();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isFetching || authLoading) return <PlayPageSkeleton />;

  const game = games.find((item) => item.id === id) || currentGame;
  if (!game) return null;

  return (
    <div className="mt-4 w-full pb-16 sm:px-3">
      <nav aria-label="Breadcrumb" className="text-md mb-4 flex items-center gap-2">
        <Link to="/games" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
          Games
        </Link>
        <span className="text-muted-foreground/60">/</span>
        <span className="text-foreground font-semibold">{game.title}</span>
      </nav>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-9">
          <GamePlayerBox game={game} />
          <GameAuthorCard game={game} />
          <GameDetailsCard game={game} />
          <GameAboutCard game={game} />
          <GameRatingCard gameId={game.id} />
          <CommentSection gameId={game.id} />
        </div>
        <div className="lg:col-span-3">
          <RelatedGames games={games.filter((item) => item.id !== id).slice(0, 5)} />
        </div>
      </div>
    </div>
  );
};
