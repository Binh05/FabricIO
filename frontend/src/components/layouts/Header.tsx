import { Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import UserAvatar from "./UserAvatar";
import type { User } from "@/types/User";

const nav = [
  { href: "/", label: "Home", key: "/" },
  { href: "/games", label: "Games", key: "/games" },
  { href: "/submit-game", label: "Submit Game", key: "/submit-game" },
];

export default function Header({ user }: {user: User}) {
  const { token } = useAuth()
  const location = useLocation();
  const path = location.pathname;

  return (
    <header className="border-border sticky top-0 z-100 flex h-20 items-center justify-between gap-6 border-b bg-[#0f0f0f]/85 px-10 backdrop-blur-lg">
      <Link
        className="flex items-center gap-3 text-[22px] font-extrabold tracking-[-0.5px]"
        to="/"
      >
        <span className="from-primary to-primary-glow flex h-9 w-9 items-center justify-center rounded-[10px] bg-linear-to-br text-white">
          G
        </span>
        <span>GameStore</span>
      </Link>
      <label className="border-border text-muted flex h-12 max-w-125 flex-1 items-center gap-3 rounded-full border bg-white/5 px-4">
        <Search size={18} />
        <input
          className="w-full border-none bg-transparent text-white outline-none"
          type="search"
          placeholder="Search games, tags, creators..."
        />
      </label>
      <div className="flex items-center gap-4">
        <nav className="flex gap-1">
          {nav.map((item) => (
            <Link
              key={item.key}
              className={`text-muted rounded-full px-4 py-2 font-medium transition-all duration-200 hover:bg-white/10 hover:text-white ${path === item.href ? "bg-white/10 text-white" : ""}`}
              to={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {!token ? (
          <Button variant="ghost" asChild>
            <Link to="/signin">Login</Link>
          </Button>
        ) : (
          <Link
            to="/profile"
          >
            <UserAvatar name={user.username} avatarUrl={user.avatarUrl} type="header"/>
          </Link>
        )}
      </div>
    </header>
  );
}
