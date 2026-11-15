import { useState, type FormEvent } from "react";
import { Menu, Search, Upload } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import UserAvatar from "./UserAvatar";
import type { User } from "@/types/User";
import { cn } from "@/lib/utils";
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

const navigation = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Browse" },
];

const NavLinks = ({
  className,
  path,
  onClick,
}: {
  className?: string;
  path: string;
  onClick?: () => void;
}) => (
  <nav aria-label="Main navigation" className={className}>
    {navigation.map((item) => {
      const active =
        item.href === "/"
          ? path === "/"
          : path === item.href || path.startsWith(`${item.href}/`);

      return (
        <Link
          key={item.href}
          aria-current={active ? "page" : undefined}
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/5 hover:text-foreground",
            active ? "bg-surface-container-high text-foreground" : "text-muted-foreground",
          )}
          to={item.href}
          onClick={onClick}
        >
          {item.label}
        </Link>
      );
    })}
  </nav>
);

export default function Header({ user }: { user: User | null }) {
  const { token } = useAuth();
  const { loading } = useGame();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formQuery = new FormData(event.currentTarget).get("q");
    const query = typeof formQuery === "string" ? formQuery.trim() : "";
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    const search = params.toString();

    navigate(`/games${search ? `?${search}` : ""}`);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 h-12 border-b border-border-subtle bg-surface/95 py-8 px-4 backdrop-blur-md sm:px-4 lg:px-8">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4">
        <Logo />

        <form
          key={searchParams.get("q") ?? ""}
          onSubmit={onSearch}
          className="hidden h-10 max-w-xl flex-1 items-center gap-3 rounded-md border border-border-subtle bg-surface-container-lowest px-3 text-muted-foreground transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2 focus-within:ring-offset-surface md:flex"
        >
          <Search aria-hidden="true" size={17} />
          <label
            htmlFor="desktop-game-search"
            className="shrink-0 text-xs font-medium text-muted-foreground"
          >
            Search
          </label>
          <input
            id="desktop-game-search"
            className="min-w-0 w-full border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-primary"
            type="search"
            name="q"
            placeholder="Search games, studios tags (e.g. Cyberpunk, Roguelike)..."
            defaultValue={searchParams.get("q") ?? ""}
          />
        </form>

        <div className="flex items-center gap-2 sm:gap-3">
          <NavLinks
            className="hidden items-center gap-1 md:flex"
            path={location.pathname}
          />

          <Button
            variant="gradient"
            size="sm"
            asChild
            className="hidden h-9 sm:inline-flex bg-primary/80 shadow-lg shadow-primary/50"
          >
            <Link to="/upload-game">
              <Upload aria-hidden="true" />
              Upload game
            </Link>
          </Button>

          {loading ? (
            <Skeleton className="size-8 rounded-full" />
          ) : !token ? (
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link to="/signin">Log in</Link>
            </Button>
          ) : (
            <Link to="/profile" aria-label="Open profile">
              <UserAvatar
                name={user?.username ?? "FabricIO"}
                avatarUrl={user?.avatarUrl ?? ""}
                type="header"
              />
            </Link>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              aria-describedby="mobile-navigation-description"
              className="border-l border-border-subtle bg-surface p-0 text-foreground"
            >
              <SheetHeader className="border-b border-border-subtle p-5">
                <SheetTitle className="text-left text-foreground">
                  <Logo />
                </SheetTitle>
                <SheetDescription
                  id="mobile-navigation-description"
                  className="sr-only"
                >
                  Navigate FabricIO and find games.
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-6 p-5">
                <form
                  key={searchParams.get("q") ?? ""}
                  onSubmit={onSearch}
                  className="flex h-11 w-full items-center gap-3 rounded-md border border-border-subtle bg-surface-container-lowest px-3 text-muted-foreground transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2 focus-within:ring-offset-surface"
                >
                  <Search aria-hidden="true" size={17} />
                  <label
                    htmlFor="mobile-game-search"
                    className="shrink-0 text-xs font-medium text-muted-foreground"
                  >
                    Search
                  </label>
                  <input
                    id="mobile-game-search"
                    className="min-w-0 w-full border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-primary"
                    type="search"
                    name="q"
                    placeholder="Search games, studios tags (e.g. Cyberpunk, Roguelike)..."
                    defaultValue={searchParams.get("q") ?? ""}
                  />
                </form>

                <NavLinks
                  className="flex flex-col gap-2"
                  path={location.pathname}
                  onClick={() => setIsOpen(false)}
                />

                <Button variant="gradient" asChild className="w-full">
                  <Link to="/upload-game" onClick={() => setIsOpen(false)}>
                    <Upload aria-hidden="true" />
                    Upload game
                  </Link>
                </Button>

                {!token && (
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/signin" onClick={() => setIsOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

        </div>
      </div>
    </header>
  );
}
