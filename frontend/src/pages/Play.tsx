import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useGame } from "@/hooks/useGame";
import { Play as PlayGame } from "lucide-react";

export const Play = () => {
  const { id } = useParams();
  const { games, fetchGamePlayUrl, fetchGameById } = useGame();
  const [gamePlayUrl, setGamePlayUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      try {
        if (!games.some((game) => game.id === id)) {
          await fetchGameById(id);
        }
        const url = await fetchGamePlayUrl(id);

        setGamePlayUrl(url);
      } finally {
        setIsFetching(false);
      }
    };

    init();
  }, [fetchGamePlayUrl]);

  if (isFetching) return;
  const game = games.find((game) => game.id === id);

  if (!game) return;

  const formatCompact = (value) =>
    Intl.NumberFormat("en", { notation: "compact" }).format(value);

  const handleAction = (action) => {
    const frame = document.getElementById("webgl-iframe") as HTMLIFrameElement;
    if (!frame) return;
    if (action === "reload") {
      frame.src = frame.src;
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
        <div>
          <span className="text-primary mb-2 block text-[13px] font-bold tracking-[2px] uppercase">
            Play
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight">
            {game.title}
          </h1>
          <p className="text-muted">
            Trải nghiệm bản WebGL trực tiếp trong trình duyệt.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to={`/game-detail/${game.id}`}>Game details</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_340px]">
        <div className="flex-1">
          {gamePlayUrl ? (
            <>
              <div className="border-border relative aspect-video overflow-hidden rounded-lg border bg-black">
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
                    <PlayGame className="text-muted z-50 size-8 stroke-1" />
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
                  <Link to={`/submit-game?edit=${game.id}`}>
                    Thêm link WebGL
                  </Link>
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
            <div className="text-muted text-sm leading-7">
              {game.description}
            </div>
          </div>
        </div>
        <aside className="bg-card border-border sticky top-30 flex h-fit w-full flex-col gap-6 rounded-lg border p-6 lg:w-85">
          <div className="bg-primary/10 text-primary border-primary/20 self-start rounded-full border px-3 py-1 text-[13px] font-bold tracking-wider uppercase">
            Trending
          </div>
          <h2 className="mt-2 text-2xl font-bold">Thông tin</h2>
          <div className="text-muted text-sm">
            by <span className="font-medium text-white">{game.ownerName}</span>
          </div>
          <div className="border-border flex items-center justify-between border-y py-2">
            <span
              className={`text-xl font-extrabold ${game.price === 0 ? "text-success" : "text-warning"}`}
            >
              {game.price === 0 ? "Free" : `$${game.price}`}
            </span>
            <div className="text-muted flex flex-col items-end text-[12px]">
              <span>{formatCompact(90000)} views</span>
              <span>{formatCompact(12000)} downloads</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(game.tags || []).map((tag) => (
              <span
                key={tag.id}
                className="text-muted border-border rounded-full border bg-white/5 px-3 py-1 text-sm text-[13px]"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
};
