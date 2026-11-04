import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useGame } from "@/hooks/useGame";
import { Play as PlayGame } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { PlayPageSkeleton } from "@/components/skeletons/PlayPageSkeleton";
import { GameCard } from "@/components/games/GameCard";

export const Play = () => {
  const { id } = useParams<{ id: string }>();
  const { games, fetchGamePlayUrl, fetchGameById, fetchGames } = useGame();
  const { loading } = useAuth();
  const [gamePlayUrl, setGamePlayUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    const init = async (): Promise<void> => {
      try {
        if (!id) return;
        if (!games.some((game) => game.id === id)) {
          setIsFetching(true);
          await fetchGameById(id);
          await fetchGames("", 0, 66);
        }

        const url = await fetchGamePlayUrl(id);
        setGamePlayUrl(url);
      } finally {
        setIsFetching(false);
      }
    };

    init();
  }, []);

  if (isFetching) return <PlayPageSkeleton />;
  const game = games.find((game) => game.id === id);

  if (!game || loading) return <PlayPageSkeleton />;

  const handleAction = (action: "reload" | "fullscreen") => {
    const frame = document.getElementById("webgl-iframe") as HTMLIFrameElement;
    if (!frame) return;
    if (action === "reload" && gamePlayUrl) {
      frame.src = gamePlayUrl;
    }
    if (action === "fullscreen") {
      frame.requestFullscreen?.();
    }
  };

  const onPlay = () => {
    setIsPlaying(true);
  };

  return (
    <section className="mb-16"> 
      <div className="mb-8 flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight">
            {game.title}
          </h1>
          <p className="text-muted">
            Trải nghiệm bản WebGL trực tiếp trong trình duyệt.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 items-start">
      <div className="flex-1 col-span-12 xl:col-span-9">
        {gamePlayUrl ? (
          <>
            <div className="border-border bg-background relative aspect-video overflow-hidden rounded-lg border">
              {isPlaying ? (
                <iframe
                  id="webgl-iframe"
                  src={gamePlayUrl}
                  className="h-full w-full border-none"
                  title={`${game.title} WebGL`}
                  allow="fullscreen; autoplay; gamepad; clipboard-read; clipboard-write"
                  sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-popups"
                />
              ) : (
                <Button
                  onClick={onPlay}
                  variant="ghost"
                  className="bg-muted/20 absolute top-6/12 left-6/12 z-50 size-20 -translate-6/12 rounded-full brightness-110"
                >
                  <PlayGame className="text-muted size-8 stroke-1" />
                </Button>
              )}
            </div>
            <div className="bg-card border-border mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleAction("reload")}
                >
                  Reload
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAction("fullscreen")}
                >
                  Fullscreen
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-card border-border rounded-lg border p-12 text-center">
            <h2 className="mb-4 text-2xl font-bold">
              Game này chưa có link GamePlay để chơi
            </h2>
            <div className="flex justify-center gap-4">
              <Button variant="gradient" asChild>
                <Link to={`/upload-game?edit=${game.id}`}>Thêm link WebGL</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to={`/game-detail/${game.id}`}>Về trang game</Link>
              </Button>
            </div>
          </div>
        )}
        <div className="border-border mt-4 rounded-xl border bg-white/3 p-4">
          <div className="text-muted mb-2 text-[12px] font-bold tracking-wider uppercase">
            Mô tả
          </div>
          <div className="text-muted text-sm leading-7">{game.description}</div>
        </div>
      </div>
      
        <div className="xl:col-span-3 hidden xl:block">
          <h2 className="mb-2 font-bold text-xl">Chơi tiếp</h2>
          <div className="md:grid gap-1.5 2xl:gap-2 xl:grid-cols-2">
            {games.length > 0 && (
              games.map(g => (
                <GameCard key={g.id} game={g} className="flex-1"/>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
