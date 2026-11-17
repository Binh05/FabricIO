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
import { Card } from "@/components/ui/card";
import UserAvatar from "@/components/layouts/UserAvatar";

interface TagItem {
  id: string;
  name: string;
  count?: string | number;
  countColorClass?: string;
}

interface LinkWrapperProps {
  to: string;
  children: React.ReactNode;
  username: string | null | undefined;
}

const LinkWrapper = ({ to, children, username }: LinkWrapperProps) => {
  return (
    <>
      {username ? (
        <Link to={to} aria-label={`View ${username}'s profile`}>
          {children}
        </Link>
      ) : (
        children
      )}
    </>
  );
};

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
          games.length === 0
            ? fetchGames("", 0, 10).catch(() => null)
            : Promise.resolve(),
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
  const authorName = game.author?.fullName?.trim() || "Indie Creator";
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
    <div className="mt-4 w-full pb-16 sm:px-3">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="text-md mb-4 flex items-center gap-2"
      >
        <Link
          to="/games"
          className="text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          Games
        </Link>
        <span className="text-muted-foreground/60">/</span>
        <span className="text-foreground font-semibold">{title}</span>
      </nav>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Player + Metadata Card + About Card */}
        <div className="flex flex-col gap-6 lg:col-span-9">
          {/* Game Player Box */}
          <div
            ref={playerContainerRef}
            className="border-border-subtle bg-surface-container-lowest flex flex-col overflow-hidden rounded-md border shadow-xl"
          >
            {/* Aspect Video Game Viewport */}
            <div className="bg-surface-container-lowest relative flex aspect-video w-full items-center justify-center">
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
                  className="group relative flex size-full cursor-pointer flex-col items-center justify-center overflow-hidden"
                >
                  {/* Artwork / Preview background */}
                  <img
                    src={thumbnailUrl}
                    alt={`${title} preview`}
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Atmospheric overlay */}
                  <div className="bg-surface-container-lowest/50 group-hover:bg-surface-container-lowest/40 absolute inset-0 backdrop-blur-[2px] transition-colors" />

                  {/* Centered Play Button & Title */}
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <button
                      type="button"
                      aria-label={`Play ${title}`}
                      className="bg-primary text-primary-foreground flex size-16 items-center justify-center rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 active:scale-95 sm:size-20"
                    >
                      <PlayIcon className="size-8 translate-x-0.5 fill-current" />
                    </button>
                    <h2 className="text-foreground text-xl font-extrabold tracking-tight drop-shadow-md sm:text-2xl">
                      Play {title}
                    </h2>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Controls Bar */}
            <div className="bg-surface-container-lowest border-border-subtle flex items-center justify-between gap-3 border-t px-4 py-3">
              {/* Left action buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReload}
                  aria-label="Reload Game"
                  title="Reload Game"
                  className="bg-surface-container-high/60 hover:bg-surface-container-highest border-border-subtle text-foreground flex size-9 items-center justify-center rounded-lg border transition-colors"
                >
                  <RotateCcw className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={toggleSound}
                  aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
                  title={isMuted ? "Unmute Audio" : "Mute Audio"}
                  className="bg-surface-container-high/60 hover:bg-surface-container-highest border-border-subtle text-foreground flex size-9 items-center justify-center rounded-lg border transition-colors"
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
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-semibold shadow-sm transition-all active:scale-95"
                >
                  <Maximize2 className="size-3.5" />
                  <span>Fullscreen</span>
                </button>
              </div>
            </div>
          </div>

          <Card className="border-border-subtle bg-surface-container-low rounded-sm p-6 sm:p-7">
            <div className="min-w-0">
              <h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
                Author
              </h1>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-baseline">
                <LinkWrapper
                  to={`/u/${game.author?.username}`}
                  username={game.author?.username}
                >
                  <UserAvatar
                    name={authorName}
                    avatarUrl={game.author?.avatarUrl}
                    type="describe"
                  />
                </LinkWrapper>
              </div>
              <div className="-mt-1.5">
                <LinkWrapper
                  to={`/u/${game.author?.username}`}
                  username={game.author?.username}
                >
                  <span className="text-secondary-foreground font-mono font-semibold hover:underline">
                    @{game.author?.username}
                  </span>
                </LinkWrapper>

                <h2 className="text-foreground shrink-0 text-sm font-semibold sm:text-lg">
                  {authorName}
                </h2>
                <span className="text-muted-foreground line-clamp-3 text-xs leading-relaxed font-medium sm:text-sm">
                  {game.author?.bio ?? "Indie Creator"}
                </span>
              </div>
            </div>
          </Card>

          {/* Game Details Card */}
          <Card className="border-border-subtle bg-surface-container-low rounded-sm p-6 sm:p-7">
            {/* Header: Title, Subtitle & Share Button */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {title}
                </h1>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed sm:text-sm">
                  {subtitle}
                </p>
              </div>
            </div>

            {/* Metadata Rows */}
            <div className="my-6 flex flex-col gap-3 text-sm">
              <div className="flex items-baseline">
                <span className="text-muted-foreground w-28 shrink-0 text-xs sm:w-32 sm:text-sm">
                  Rating:
                </span>
                <span className="text-primary text-base leading-none font-bold sm:text-lg">
                  {rating}
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="text-muted-foreground w-28 shrink-0 text-xs sm:w-32 sm:text-sm">
                  Votes:
                </span>
                <span className="text-foreground text-xs font-medium sm:text-sm">
                  {votes}
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="text-muted-foreground w-28 shrink-0 text-xs sm:w-32 sm:text-sm">
                  Released:
                </span>
                <span className="text-foreground text-xs font-medium sm:text-sm">
                  {releasedDate}
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="text-muted-foreground w-28 shrink-0 text-xs sm:w-32 sm:text-sm">
                  Platforms:
                </span>
                <span className="text-foreground text-xs font-medium sm:text-sm">
                  {platforms}
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="text-muted-foreground w-28 shrink-0 text-xs sm:w-32 sm:text-sm">
                  Orientation:
                </span>
                <span className="text-foreground text-xs font-medium sm:text-sm">
                  {orientation}
                </span>
              </div>
            </div>

            {/* Tags Badges */}
            <div className="border-border-subtle/40 flex flex-wrap items-center gap-2 border-t pt-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="bg-surface-container-high/50 hover:bg-surface-container-highest border-border-subtle text-foreground inline-flex cursor-default items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors"
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
          </Card>

          {/* About the Game Card */}
          <Card className="border-border-subtle bg-surface-container-low rounded-sm p-6 sm:p-7">
            {/* Header with 3 red horizontal lines */}
            <div className="flex items-center gap-2.5">
              <div
                aria-hidden="true"
                className="text-primary flex shrink-0 flex-col gap-1"
              >
                <span className="bg-primary h-0.5 w-4 rounded-full" />
                <span className="bg-primary h-0.5 w-2.5 rounded-full" />
                <span className="bg-primary h-0.5 w-3.5 rounded-full" />
              </div>
              <h2 className="text-foreground text-lg font-bold tracking-tight sm:text-xl">
                About the Game
              </h2>
            </div>

            {/* Content description */}
            <div className="space-y-3">
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                {aboutBody}
              </p>
            </div>
          </Card>
        </div>

        {/* Right Column: Related Games */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 border-primary/40 text-primary flex size-6 items-center justify-center rounded-full border">
                <Gamepad2 className="fill-primary text-primary size-3.5" />
              </div>
              <h2 className="text-foreground text-lg font-bold tracking-tight">
                Related Games
              </h2>
            </div>
            <Link
              to="/games"
              className="text-primary text-xs font-semibold transition-all hover:underline sm:text-sm"
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
