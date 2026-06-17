import { Search } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import UserAvatar from "./UserAvatar";
import type { User } from "@/types/User";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useGame } from "@/hooks/useGame";
import { Skeleton } from "../ui/skeleton";
import Logo from "./Logo";

const nav = [
  { href: "/", label: "Home", key: "/" },
  { href: "/games", label: "Games", key: "/games" },
  { href: "/submit-game", label: "Submit Game", key: "/submit-game" },
];

export default function Header({ user }: { user: User | null }) {
  const { token } = useAuth();
  const { fetchGames, loading } = useGame();
  const location = useLocation();
  const path = location.pathname;
  const [keyword, setKeyword] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchGames(keyword);

    if (!loading) {
      navigate("/games");
    }
  };

  return (
    <header className="border-border sticky top-0 z-100 flex h-20 items-center justify-between gap-6 border-b bg-[#0f0f0f]/85 px-10 backdrop-blur-lg">
      <Logo />
      <form
        onSubmit={onSearch}
        className="border-border text-muted flex h-12 max-w-125 flex-1 items-center gap-3 rounded-full border bg-white/5 px-4"
      >
        <Search size={18} />
        <input
          className="text-foreground w-full border-none bg-transparent outline-none"
          type="search"
          placeholder="Search games..."
          value={keyword}
          onChange={handleChange}
        />
      </form>
      <div className="flex items-center gap-4">
        <nav className="flex gap-1">
          {nav.map((item) => (
            <Link
              key={item.key}
              className={cn(
                "text-muted rounded-full px-4 py-2 font-medium transition-all duration-200 hover:bg-white/10 hover:text-white",
                path === item.href ? "bg-white/10 text-white" : "",
              )}
              to={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {loading ? (
          <Skeleton className="size-8 rounded-full" />
        ) : !token ? (
          <Button variant="ghost" asChild>
            <Link to="/signin">Login</Link>
          </Button>
        ) : (
          <Link to="/profile">
            <UserAvatar
              name={user?.username ?? "gamestore "}
              avatarUrl={user?.avatarUrl ?? ""}
              type="header"
            />
          </Link>
        )}
      </div>
    </header>
  );
}
