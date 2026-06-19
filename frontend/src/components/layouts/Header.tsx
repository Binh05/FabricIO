import { Menu, Search } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const onSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (keyword.trim() === "") return;
    fetchGames(keyword, 0, 9);

    if (isOpen) setIsOpen(false);
    navigate(`/games?q=${keyword}`);
  };

  const NavLinks = ({
    className,
    onClick,
  }: {
    className?: string;
    onClick?: () => void;
  }) => (
    <nav className={className}>
      {nav.map((item) => (
        <Link
          key={item.key}
          className={cn(
            "text-muted rounded-full px-4 py-2 font-medium transition-all duration-200 hover:bg-white/10 hover:text-white",
            path === item.href ? "bg-white/10 text-white" : "",
          )}
          to={item.href}
          onClick={onClick}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="border-border sticky top-0 z-10 flex h-20 items-center justify-between gap-4 border-b bg-[#0f0f0f]/85 px-4 backdrop-blur-lg md:px-10">
      <Logo />

      {/* Desktop Search */}
      <form
        onSubmit={onSearch}
        className="border-border text-muted hidden h-12 max-w-125 flex-1 items-center gap-3 rounded-full border bg-white/5 px-4 md:flex"
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

      <div className="flex items-center gap-2 md:gap-4">
        {/* Desktop Nav */}
        <NavLinks className="hidden gap-1 md:flex" />

        {/* User / Login - Always visible or slightly adjusted */}
        <div className="flex items-center gap-2">
          {loading ? (
            <Skeleton className="size-8 rounded-full" />
          ) : !token ? (
            <Button variant="ghost" asChild className="hidden md:inline-flex">
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

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("md:hidden", isOpen && "hidden")}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              aria-describedby="nav menu"
              className="border-l-border bg-[#0f0f0f] p-0 pr-8 text-white"
            >
              <SheetHeader className="border-border border-b p-6">
                <SheetTitle className="text-left text-white">
                  <Logo />
                </SheetTitle>
                <SheetDescription className="sr-only">
                  logo website
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-6 p-6">
                {/* Mobile Search */}
                <form
                  onSubmit={onSearch}
                  className="border-border text-muted flex h-12 w-full items-center gap-3 rounded-full border bg-white/5 px-4"
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

                {/* Mobile Nav */}
                <div className="flex flex-col gap-4">
                  {nav.map((item) => (
                    <Link
                      key={item.key}
                      className={cn(
                        "px-2 py-1 text-lg font-medium transition-colors",
                        path === item.href
                          ? "text-white"
                          : "text-muted-foreground hover:text-white",
                      )}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="border-border mt-4 border-t pt-4">
                  {!token && (
                    <Button
                      className="h-auto w-full justify-start px-2 py-1 text-lg font-medium"
                      variant="ghost"
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link to="/signin">Login</Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
