import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Header from "@/layouts/Header";

export const MainLayout = ({ children }) => {
  const { user, games, toasts } = useApp();

  const sidebarLinks = [
    { href: "/profile", label: "Profile" },
    { href: "/game-detail/2", label: "Spotlight" },
    { href: "/submit-game", label: "Upload Game" },
  ];

  const ALL_TAGS = [...new Set(games.flatMap((game) => game.tags))];

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
              {ALL_TAGS.slice(0, 8).map((tag: string) => (
                <span
                  key={tag}
                  className="text-muted border-border rounded-full border bg-white/5 px-3 py-1 text-[13px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-muted text-[12px] font-bold tracking-wider uppercase">
              Community Pulse
            </h3>
            <div className="flex flex-col gap-3">
              <div className="bg-card border-border rounded-lg border p-6">
                <div className="text-muted mb-1 text-sm">Live players</div>
                <h2 className="text-3xl font-bold">124.5K</h2>
              </div>
            </div>
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <footer className="border-border text-muted border-t p-10 text-center text-sm">
        GameStore UI concept built with React.
      </footer>

      <div className="fixed right-10 bottom-10 z-1000 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-card border-primary animate-slideIn rounded-xl border-l-4 px-6 py-4 text-white shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
};
