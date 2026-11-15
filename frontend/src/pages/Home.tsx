import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Rocket,
  SearchX,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";
import { GameCard } from "@/components/games/GameCard";
import GameNewestDrop from "@/components/games/GameNewestDrop";
import { useGame } from "@/hooks/useGame";
import { HomeSkeleton } from "@/components/skeletons/HomeSkeleton";


export const Home = () => {
  const { games, fetchGames, loading } = useGame();
  const [isCompactGrid, setIsCompactGrid] = useState(false);

  useEffect(() => {
    void fetchGames("", 0, 8);
  }, [fetchGames]);

  if (loading) return <HomeSkeleton />

  const featuredGame = games[0];
  const previewGames = games.slice(1, 4);

  return (
    <div className="-mt-1 w-[calc(100%+3rem)] bg-background text-foreground">
      <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
        {/* Top Featured Spotlight */}
        {games.length > 0 && <GameNewestDrop
          game={featuredGame}
          previewGames={previewGames}
        />}

        {/* HOT GAMES Section */}
        <section aria-labelledby="hot-games-heading" className="mt-12">
          {/* Header Row: Title & Controls */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Red bar + Title + Count badge */}
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-6 w-1.5 rounded-full bg-primary"
              />
              <h2
                id="hot-games-heading"
                className="text-xl font-black tracking-tight text-foreground uppercase sm:text-2xl"
              >
                HOT GAMES
              </h2>
            </div>

          </div>

          {/* Cards Grid */}
          {games.length === 0 ? (
            <div className="flex min-h-60 flex-col items-center justify-center rounded-xl border border-border-subtle bg-surface-container-low p-8 text-center">
              <SearchX className="mb-3 text-muted-foreground" size={32} />
              <h3 className="font-semibold text-foreground">No games found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try selecting a different genre or clearing the filters.
              </p>
              <Link
                to="/upload-game"
                type="button"
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-glow"
              >
                Upload first game
              </Link>
            </div>
          ) : (
            <div
              className={"grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}
            >
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}

          {/* Discover More Indie Titles Button */}
          <div className="mt-8 flex justify-center">
            <Link
              to="/games"
              className="flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-container-low px-6 py-2.5 text-sm font-semibold text-foreground/90 shadow-xs transition-colors hover:bg-surface-container-high hover:text-foreground"
            >
              <span>Discover More Indie Titles</span>
              <ChevronDown size={15} />
            </Link>
          </div>
        </section>

        {/* CTA Banner: Independent Creators */}
        <section className="relative mt-14 overflow-hidden rounded-2xl border border-border-subtle bg-linear-to-r from-surface-container to-surface p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-primary uppercase">
                <Rocket size={14} className="fill-primary" />
                INDEPENDENT CREATORS
              </div>

              <h2 className="mt-2 text-xl font-black tracking-tight text-foreground sm:text-2xl lg:text-3xl">
                Are you building the next breakthrough indie game?
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Deploy your WebGL, HTML5, or native build on FabricIO in under 3
                minutes. Zero upfront listing fees, 85% creator revenue share,
                and live telemetry on player retention.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <Link
                to="/upload-game"
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary-glow hover:shadow-primary/35"
              >
                <Upload size={16} />
                Upload Your Game
              </Link>

            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-14 flex flex-col gap-5 border-t border-border-subtle pt-8 pb-10 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-semibold text-cyan">
              <span className="size-2 rounded-full bg-cyan shadow-[0_0_8px_var(--cyan)]" />
              SYSTEMS OPERATIONAL
            </span>
            <span className="text-border-chip">·</span>
            <span>14,892 Indie Creators Online</span>
          </div>

          <nav
            aria-label="Footer links"
            className="flex flex-wrap items-center gap-5 text-muted-foreground"
          >
            <Link
              to="/upload-game"
              className="transition-colors hover:text-foreground"
            >
              Developer Portal
            </Link>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Community Discord
            </a>
            <Link to="/games" className="transition-colors hover:text-foreground">
              Game Showcase
            </Link>
            <span className="cursor-pointer transition-colors hover:text-foreground">
              Telemetry &amp; Status
            </span>
          </nav>

          <span>
            © {new Date().getFullYear()} FabricIO Games Inc. All rights reserved.
          </span>
        </footer>
      </div>
    </div>
  );
};
