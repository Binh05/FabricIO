import { Link } from "react-router-dom";
import Header from "@/components/layouts/Header";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import type { GameTag } from "@/types/Game";
import GameTagSkeleton from "../games/GameTagSkeleton";
import { useEffect } from "react";

export const MainLayout = ({ children }) => {
  const { tagLoading, fetchGameTags, tags } = useGame();
  const { user, loading } = useAuth();

  const sidebarLinks = [
    { href: "/profile", label: "Profile" },
    { href: "/submit-game", label: "Upload Game" },
  ];

  useEffect(() => {
    if (!tags.length) {
      fetchGameTags();
    }
  }, []);

  if (loading) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />
      <div className="mx-auto flex w-full max-w-400 flex-1 flex-col gap-10 p-10 lg:flex-row">
        <aside className="flex w-full flex-col gap-8 lg:w-70">
          <div className="flex flex-col gap-4">
            <h3 className="text-muted text-[12px] font-bold tracking-wider uppercase">
              Discover
            </h3>
            <div className="flex flex-col gap-1">
              {sidebarLinks.map((item) => (
                <Link
                  key={item.href}
                  className="text-muted cursor-pointer rounded-sm border-none bg-transparent px-5 py-2.5 text-left font-semibold transition-all duration-200 hover:bg-white/5 hover:text-white"
                  to={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-muted text-[12px] font-bold tracking-wider uppercase">
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tagLoading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <GameTagSkeleton key={index} />
                  ))
                : tags.slice(0, 8).map((tag: GameTag) => (
                    <span
                      key={tag.id}
                      className="text-muted border-border rounded-full border bg-white/5 px-3 py-1 text-[13px]"
                    >
                      {tag.name}
                    </span>
                  ))}
            </div>
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <footer className="border-border text-muted border-t p-10 text-center text-sm">
        GameStore UI concept built with React.
      </footer>
    </div>
  );
};
