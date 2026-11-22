import { useState } from "react";
import { Play, Sparkles, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import type { Game } from "@/types/Game";
import { createGamePlayUrl, getYearFromISOString } from "@/lib/utils";

interface GameFeaturedDropProps {
  game: Game;
  previewGames?: Game[];
  onSelectGame?: (game: Game) => void;
}

const GameNewestDrop = ({
  game,
  previewGames = [],
}: GameFeaturedDropProps) => {
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);

  // If there are preview games, allow switching preview artwork
  const allPreviewItems = [game, ...previewGames.filter((g) => g.id !== game.id)].slice(0, 3);
  const currentDisplayedGame = allPreviewItems[activeThumbIndex] || game;

  const rawTitle = currentDisplayedGame.title;
  const hasColon = rawTitle.includes(":");
  const titlePart1 = hasColon ? rawTitle.split(":")[0] + ":" : rawTitle;
  const titlePart2 = hasColon ? rawTitle.split(":")[1] : "";

  const description =
    currentDisplayedGame.description ||
    "Navigate the subterranean megacity of Neo-Kyoto. Synthesize high-frequency bio-cybernetic weapons, unravel clandestine megacorp syndicates, and trigger unthrottled zero-install 60FPS browser combat.";

  const tags =
    currentDisplayedGame.tags && currentDisplayedGame.tags.length > 0
      ? currentDisplayedGame.tags.map((t) => t.name)
      : ["Newest"];

  const rating =
    currentDisplayedGame.avgRating && currentDisplayedGame.avgRating > 0
      ? currentDisplayedGame.avgRating.toFixed(1)
      : "5";

  const ratingReviews =
    currentDisplayedGame.ratingCount && currentDisplayedGame.ratingCount > 0
      ? currentDisplayedGame.ratingCount.toLocaleString()
      : "0";

  return (
    <section
      aria-label={`Featured spotlight: ${rawTitle}`}
      className="relative isolate min-h-110 sm:min-h-120 lg:min-h-130 overflow-hidden rounded-md bg-surface-container-lowest shadow-2xl"
    >
      {/* Background artwork */}
      <img
        src={currentDisplayedGame.thumbnailUrl}
        alt=""
        className="absolute inset-0 size-full object-cover object-center transition-all duration-700"
      />

      {/* Atmospheric gradient overlays */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-background via-surface-container-lowest/90 via-55% to-surface-container-lowest/20"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-background via-transparent to-surface-container-lowest/40"
      />

      {/* Content wrapper */}
      <div className="relative flex min-h-110 sm:min-h-120 lg:min-h-130 flex-col justify-between p-6 sm:p-8 lg:p-10">
        {/* Top badges row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <span className="flex items-center gap-1.5 rounded-xs border border-primary/40 bg-primary/15 px-3 py-1 font-mono text-[11px] font-bold tracking-wider text-primary uppercase shadow-xs">
            <Sparkles size={12} className="fill-primary" />
            Newest SPOTLIGHT
          </span>

          <span className="flex items-center gap-1.5 rounded-xs border border-border-subtle bg-surface-container-lowest/80 px-3 py-1 text-xs text-foreground/90 backdrop-blur-xs">
            <Star size={12} className="fill-warning text-warning" />
            <span className="font-semibold text-foreground">{rating}</span>
            <span className="text-muted-foreground">({ratingReviews} reviews)</span>
          </span>

          <span className="rounded-xs border border-border-subtle bg-surface-container-lowest/80 px-3 py-1 text-xs text-foreground/80 backdrop-blur-xs">
            {getYearFromISOString(currentDisplayedGame.createdAt)} Release
          </span>

          <span className="flex items-center gap-1.5 rounded-xs border border-cyan/30 bg-surface-container-lowest/80 px-3 py-1 text-xs font-semibold text-cyan backdrop-blur-xs">
            <span className="size-1.5 rounded-xs bg-cyan shadow-[0_0_8px_var(--cyan)]" />
            WebGL NATIVE
          </span>
        </div>

        {/* Center / Bottom Main info and controls */}
        <div className="mt-8 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          {/* Left Details */}
          <div className="max-w-2xl">
            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {titlePart1}
              {titlePart2 && (
                <span className="text-primary"> {titlePart2}</span>
              )}
            </h1>

            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.slice(0, 4).map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-xs border border-border-subtle bg-surface-container/80 px-2.5 py-1 text-xs font-medium text-foreground/85 backdrop-blur-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions & Price */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                to={createGamePlayUrl(currentDisplayedGame)}
                className="flex items-center gap-2 rounded-xs bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary-glow hover:shadow-primary/40"
              >
                <Play size={15} className="fill-primary-foreground" />
                Play Now (Instant WebGL)
              </Link>

              <div className="flex items-baseline gap-2 pl-1">
                <span className="text-base font-bold text-cyan">
                  {currentDisplayedGame.price === 0
                    ? "Free to Play"
                    : `$${currentDisplayedGame.price.toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>

          {/* Right side: Telemetry & Preview Thumbnails */}
          <div className="flex flex-col items-start gap-3 lg:items-end">
            {/* Specs / Telemetry */}
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5 font-semibold text-cyan">
                <span className="size-2 rounded-xs bg-cyan shadow-[0_0_8px_var(--cyan)]" />
                60 FPS
              </span>
              <span className="text-border-chip">|</span>
              <span className="text-foreground/80">WebGL 2.0 Native</span>
              <span className="text-border-chip">|</span>
              <span className="flex items-center gap-1 font-semibold text-cyan">
                <Zap size={13} className="fill-cyan" />
                18ms Ping
              </span>
            </div>

            {/* Preview Thumbnails */}
            {allPreviewItems.length > 0 && (
                <div className="flex items-center gap-2 p-1 bg-surface-container rounded-sm">
                  {allPreviewItems.map((item, idx) => {
                    const isActive = idx === activeThumbIndex;
                    return (
                      <button
                        key={item.id || idx}
                        type="button"
                        onClick={() => setActiveThumbIndex(idx)}
                        className={`group relative h-14 w-20 overflow-hidden rounded-xs transition-all sm:h-16 sm:w-24 ${
                          isActive
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-surface"
                            : "border border-border-chip opacity-70 hover:opacity-100"
                        }`}
                        aria-label={`View ${item.title}`}
                      >
                        <img
                          src={item.thumbnailUrl}
                          alt=""
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameNewestDrop;
