import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Play as PlayIcon,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Gamepad2,
} from "lucide-react";
import { toast } from "sonner";
import { useGame } from "@/hooks/useGame";
import { useAuth } from "@/hooks/useAuth";
import { PlayPageSkeleton } from "@/components/skeletons/PlayPageSkeleton";
import type { Game } from "@/types/Game";
import { GameCard } from "@/components/games/GameCard";

interface TagItem {
  id: string;
  name: string;
  count?: string | number;
  countColorClass?: string;
}

export const Play = () => {
  const { id } = useParams<{ id: string }>();
  const { games, fetchGameById, fetchGames } = useGame();
  const { loading: authLoading } = useAuth();

  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const platforms = "Browser (desktop, mobile, tablet)";
  const orientation = "Landscape";

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      if (!id) {
        setIsFetching(false);
        return;
      }

      setIsFetching(true);
      try {
        const [detailRes] = await Promise.all([
          fetchGameById(id).catch(() => null),
          games.length === 0 ? fetchGames("", 0, 10).catch(() => null) : Promise.resolve(),
        ]);

        if (!isMounted) return;

        if (detailRes) setCurrentGame(detailRes);
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

  if (isFetching || authLoading) {
    return <PlayPageSkeleton />;
  }

  // Ưu tiên lấy từ chi tiết game vừa fetch, fallback sang danh sách games
  const game = currentGame || games.find((g) => g.id === id);
  if (!game) return;

  // Lọc ra các game liên quan (loại trừ game hiện tại)
  const relatedGames = games.filter((g) => g.id !== id).slice(0, 5);

  // Map dữ liệu trực tiếp từ `game`
  const title = game.title;
  const gameUrl = game.gameUrl;
  const subtitle = game?.description?.split("\n")[0] ?? "";
  const rating = game?.avgRating ? game.avgRating.toFixed(1) : "0.0";
  const votes = `${game?.ratingCount ?? 0} ratings`;
  const releasedDate = game?.createdAt
    ? new Date(game.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  const tags: TagItem[] =
    game?.tags?.map((t) => ({
      id: t.id,
      name: t.name,
    })) ?? [];

  const aboutBody = game?.description ?? "";
  const thumbnailUrl = game?.thumbnailUrl ?? "";

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleReload = () => {
    if (iframeRef.current) {
      if (gameUrl) {
        iframeRef.current.src = gameUrl;
      }
      toast.success("Game reloaded");
    } else {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 50);
    }
  };

  const toggleSound = () => {
    setIsMuted((prev) => {
      const next = !prev;
      toast.info(next ? "Audio muted" : "Audio unmuted");
      return next;
    });
  };

  const handleFullscreen = () => {
    const target = playerContainerRef.current;
    if (!target) return;

    if (document.fullscreenElement) {
      void document.exitFullscreen?.();
    } else {
      void target.requestFullscreen?.();
    }
  };

  return (
    <div className="w-full pb-16 mt-4">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex items-center gap-2 text-md"
      >
        <Link
          to="/games"
          className="text-muted-foreground transition-colors hover:text-foreground font-medium"
        >
          Games
        </Link>
        <span className="text-muted-foreground/60">/</span>
        <span className="text-foreground font-semibold">{title}</span>
      </nav>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Player + Metadata Card + About Card */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          {/* Game Player Box */}
          <div
            ref={playerContainerRef}
            className="rounded-md border border-border-subtle bg-surface-container-lowest overflow-hidden shadow-xl flex flex-col"
          >
            {/* Aspect Video Game Viewport */}
            <div className="relative aspect-video w-full bg-surface-container-lowest flex items-center justify-center">
              {isPlaying ? (
                <iframe
                  ref={iframeRef}
                  id="webgl-iframe"
                  src={gameUrl}
                  className="h-full w-full border-none"
                  title={`${title} WebGL`}
                  allow="fullscreen; autoplay; gamepad; clipboard-read; clipboard-write"
                  sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-popups"
                />
              ) : (
                <div
                  onClick={handlePlay}
                  className="group relative size-full cursor-pointer overflow-hidden flex flex-col items-center justify-center"
                >
                  {/* Artwork / Preview background */}
                  <img
                    src={thumbnailUrl}
                    alt={`${title} preview`}
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Atmospheric overlay */}
                  <div className="absolute inset-0 bg-surface-container-lowest/50 backdrop-blur-[2px] transition-colors group-hover:bg-surface-container-lowest/40" />

                  {/* Centered Play Button & Title */}
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <button
                      type="button"
                      aria-label={`Play ${title}`}
                      className="size-16 sm:size-20 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 active:scale-95"
                    >
                      <PlayIcon className="size-8 fill-current translate-x-0.5" />
                    </button>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight drop-shadow-md">
                      Play {title}
                    </h2>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Controls Bar */}
            <div className="bg-surface-container-lowest border-t border-border-subtle px-4 py-3 flex items-center justify-between gap-3">
              {/* Left action buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReload}
                  aria-label="Reload Game"
                  title="Reload Game"
                  className="size-9 rounded-lg bg-surface-container-high/60 hover:bg-surface-container-highest border border-border-subtle flex items-center justify-center text-foreground transition-colors"
                >
                  <RotateCcw className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={toggleSound}
                  aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
                  title={isMuted ? "Unmute Audio" : "Mute Audio"}
                  className="size-9 rounded-lg bg-surface-container-high/60 hover:bg-surface-container-highest border border-border-subtle flex items-center justify-center text-foreground transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="size-4" />
                  ) : (
                    <Volume2 className="size-4" />
                  )}
                </button>
                
              </div>

              {/* Right action button: Fullscreen */}
              <div>
                <button
                  type="button"
                  onClick={handleFullscreen}
                  className="h-9 px-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-all active:scale-95"
                >
                  <Maximize2 className="size-3.5" />
                  <span>Fullscreen</span>
                </button>
              </div>
            </div>
          </div>

          {/* Game Details Card */}
          <div className="rounded-2xl border border-border-subtle bg-surface-container-low p-6 sm:p-7 shadow-sm">
            {/* Header: Title, Subtitle & Share Button */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {title}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {subtitle}
                </p>
              </div>
            </div>

            {/* Metadata Rows */}
            <div className="my-6 flex flex-col gap-3 text-sm">
              <div className="flex items-baseline">
                <span className="w-28 sm:w-32 text-muted-foreground text-xs sm:text-sm shrink-0">
                  Rating:
                </span>
                <span className="text-primary font-bold text-base sm:text-lg leading-none">
                  {rating}
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="w-28 sm:w-32 text-muted-foreground text-xs sm:text-sm shrink-0">
                  Votes:
                </span>
                <span className="text-foreground font-medium text-xs sm:text-sm">
                  {votes}
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="w-28 sm:w-32 text-muted-foreground text-xs sm:text-sm shrink-0">
                  Released:
                </span>
                <span className="text-foreground font-medium text-xs sm:text-sm">
                  {releasedDate}
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="w-28 sm:w-32 text-muted-foreground text-xs sm:text-sm shrink-0">
                  Platforms:
                </span>
                <span className="text-foreground font-medium text-xs sm:text-sm">
                  {platforms}
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="w-28 sm:w-32 text-muted-foreground text-xs sm:text-sm shrink-0">
                  Orientation:
                </span>
                <span className="text-foreground font-medium text-xs sm:text-sm">
                  {orientation}
                </span>
              </div>
            </div>

            {/* Tags Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border-subtle/40">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-md bg-surface-container-high/50 hover:bg-surface-container-highest border border-border-subtle px-3 py-1.5 text-xs font-medium text-foreground transition-colors inline-flex items-center gap-1.5 cursor-default"
                >
                  <span>{tag.name}</span>
                  {tag.count !== undefined && (
                    <span
                      className={`font-semibold ${tag.countColorClass ?? "text-muted-foreground"}`}
                    >
                      {tag.count}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* About the Game Card */}
          <div className="rounded-2xl border border-border-subtle bg-surface-container-low p-6 sm:p-7 shadow-sm space-y-4">
            {/* Header with 3 red horizontal lines */}
            <div className="flex items-center gap-2.5">
              <div
                aria-hidden="true"
                className="flex flex-col gap-1 text-primary shrink-0"
              >
                <span className="w-4 h-0.5 bg-primary rounded-full" />
                <span className="w-2.5 h-0.5 bg-primary rounded-full" />
                <span className="w-3.5 h-0.5 bg-primary rounded-full" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                About the Game
              </h2>
            </div>

            {/* Content description */}
            <div className="space-y-3">
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                {aboutBody}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Related Games */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                <Gamepad2 className="size-3.5 fill-primary text-primary" />
              </div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Related Games
              </h2>
            </div>
            <Link
              to="/games"
              className="text-primary text-xs sm:text-sm font-semibold hover:underline transition-all"
            >
              View All
            </Link>
          </div>

          {/* List of 5 Related Game Cards */}
          <div className="flex flex-col gap-3">
            {relatedGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
