import { useEffect } from "react";
import { ChevronDown, Rocket, SearchX, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { GameCard } from "@/components/games/GameCard";
import GameNewestDrop from "@/components/games/GameNewestDrop";
import { useGame } from "@/hooks/useGame";
import { HomeSkeleton } from "@/components/skeletons/HomeSkeleton";

export const Home = () => {
  const { games, fetchGames, loading } = useGame();

  useEffect(() => {
    void fetchGames("", 0, 8);
  }, [fetchGames]);

  if (loading) return <HomeSkeleton />;

  const featuredGame = games[0];
  const previewGames = games.slice(1, 4);

  return (
    <div className="bg-background text-foreground w-[calc(100%)]">
      <div className="mx-auto my-6 w-full sm:px-3 lg:px-8">
        {/* Top Featured Spotlight */}
        {games.length > 0 && (
          <GameNewestDrop game={featuredGame} previewGames={previewGames} />
        )}

        {/* HOT GAMES Section */}
        <section aria-labelledby="hot-games-heading" className="mt-12">
          {/* Header Row: Title & Controls */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Red bar + Title + Count badge */}
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="bg-primary h-6 w-1.5 rounded-full"
              />
              <h2
                id="hot-games-heading"
                className="text-foreground text-xl font-black tracking-tight uppercase sm:text-2xl"
              >
                HOT GAMES
              </h2>
            </div>
          </div>

          {/* Cards Grid */}
          {games.length === 0 ? (
            <div className="border-border-subtle bg-surface-container-low flex min-h-60 flex-col items-center justify-center rounded-xl border p-8 text-center">
              <SearchX className="text-muted-foreground mb-3" size={32} />
              <h3 className="text-foreground font-semibold">No games found</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Try selecting a different genre or clearing the filters.
              </p>
              <Link
                to="/upload-game"
                type="button"
                className="bg-primary text-primary-foreground hover:bg-primary-glow mt-4 rounded-lg px-4 py-2 text-xs font-semibold"
              >
                Upload first game
              </Link>
            </div>
          ) : (
            <div
              className={
                "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4"
              }
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
              className="border-border-subtle bg-surface-container-low text-foreground/90 hover:bg-surface-container-high hover:text-foreground flex items-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-semibold shadow-xs transition-colors"
            >
              <span>Discover More Indie Titles</span>
              <ChevronDown size={15} />
            </Link>
          </div>
        </section>

        {/* CTA Banner: Independent Creators */}
        <section className="border-border-subtle from-surface-container to-surface relative mt-14 overflow-hidden rounded-2xl border bg-linear-to-r p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="text-primary flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                <Rocket size={14} className="fill-primary" />
                INDEPENDENT CREATORS
              </div>

              <h2 className="text-foreground mt-2 text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
                Are you building the next breakthrough indie game?
              </h2>

              <p className="text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base">
                Deploy your WebGL, HTML5, or native build on FabricIO in under 3
                minutes. Zero upfront listing fees, 85% creator revenue share,
                and live telemetry on player retention.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-4">
              <Link
                to="/upload-game"
                className="bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary-glow hover:shadow-primary/35 flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold shadow-lg transition-all"
              >
                <Upload size={16} />
                Upload Your Game
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-border-subtle text-muted-foreground mt-14 flex flex-col gap-5 border-t pt-8 pb-10 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-cyan flex items-center gap-1.5 font-semibold">
              <span className="bg-cyan size-2 rounded-full shadow-[0_0_8px_var(--cyan)]" />
              SYSTEMS OPERATIONAL
            </span>
            <span className="text-border-chip">·</span>
            <span>14,892 Indie Creators Online</span>
          </div>

          <nav
            aria-label="Footer links"
            className="text-muted-foreground flex flex-wrap items-center gap-5"
          >
            <Link
              to="/upload-game"
              className="hover:text-foreground transition-colors"
            >
              Developer Portal
            </Link>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Community Discord
            </a>
            <Link
              to="/games"
              className="hover:text-foreground transition-colors"
            >
              Game Showcase
            </Link>
            <span className="hover:text-foreground cursor-pointer transition-colors">
              Telemetry &amp; Status
            </span>
          </nav>

          <span>
            © {new Date().getFullYear()} FabricIO Games Inc. All rights
            reserved.
          </span>
        </footer>
      </div>
    </div>
  );
};
