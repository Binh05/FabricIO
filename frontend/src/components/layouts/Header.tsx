import { useState, type FormEvent } from "react";
import { LogOut, Menu, Search, Upload, UserRound } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
            "hover:text-foreground rounded-xs px-3 py-2 text-sm font-medium transition-colors hover:bg-white/5",
            active
              ? "bg-surface-container-high text-foreground"
              : "text-muted-foreground",
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
  const { token, signOut } = useAuth();
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
    <header className="border-border-subtle bg-surface/95 sticky top-0 z-30 h-12 border-b px-2 py-8 backdrop-blur-md sm:px-4 lg:px-8">
      <div className="mx-auto flex h-full max-w-400 items-center justify-between gap-4">
        <Logo />

        <form
          key={searchParams.get("q") ?? ""}
          onSubmit={onSearch}
          className="hidden max-w-xl flex-1 md:flex"
        >
          <InputGroup className="border-border-subtle bg-surface-container-lowest text-muted-foreground focus-within:border-primary focus-within:ring-primary/50 focus-within:ring-offset-surface h-10 rounded-md transition-colors focus-within:ring-2 focus-within:ring-offset-2">
            <InputGroupAddon className="pl-3">
              <Search aria-hidden="true" size={17} />
              <InputGroupText className="text-xs font-medium">
                <label htmlFor="desktop-game-search">Search</label>
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="desktop-game-search"
              type="search"
              name="q"
              placeholder="Search games, studios tags (e.g. Cyberpunk, Roguelike)..."
              defaultValue={searchParams.get("q") ?? ""}
              className="text-foreground placeholder:text-muted-foreground text-sm"
            />
          </InputGroup>
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
            className="bg-primary/80 shadow-primary/50 hidden h-9 rounded-xs shadow-lg sm:inline-flex"
          >
            <Link to="/upload-game">
              <Upload aria-hidden="true" />
              Upload game
            </Link>
          </Button>

          {loading ? (
            <Skeleton className="size-8 rounded-full" />
          ) : !token ? (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:inline-flex"
            >
              <Link to="/signin">Log in</Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-full p-0"
                  aria-label="Mở menu tài khoản"
                >
                  <UserAvatar
                    name={user?.username ?? "FabricIO"}
                    avatarUrl={user?.avatarUrl ?? ""}
                    type="header"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-48">
                <DropdownMenuLabel className="flex gap-2 items-center">
                  <UserAvatar
                    name={user?.username ?? "FabricIO"}
                    avatarUrl={user?.avatarUrl ?? ""}
                    type="header"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span>{user?.username ?? "FabricIO"}</span>
                    {user?.email && (
                      <span className="text-muted-foreground truncate text-xs font-normal">
                        {user.email}
                      </span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  asChild
                  variant="default"
                >
                  <Link to="/profile">
                    <UserRound />
                    Trang cá nhân
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => void signOut()}
                >
                  <LogOut />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              className="border-border-subtle bg-surface text-foreground border-l p-0"
            >
              <SheetHeader className="border-border-subtle border-b p-5">
                <SheetTitle className="text-foreground text-left">
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
                  className="w-full"
                >
                  <InputGroup className="border-border-subtle bg-surface-container-lowest text-muted-foreground focus-within:border-primary focus-within:ring-primary/50 focus-within:ring-offset-surface h-11 rounded-md transition-colors focus-within:ring-2 focus-within:ring-offset-2">
                    <InputGroupAddon className="pl-3">
                      <Search aria-hidden="true" size={17} />
                      <InputGroupText className="text-xs font-medium">
                        <label htmlFor="mobile-game-search">Search</label>
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="mobile-game-search"
                      type="search"
                      name="q"
                      placeholder="Search games, studios tags (e.g. Cyberpunk, Roguelike)..."
                      defaultValue={searchParams.get("q") ?? ""}
                      className="text-foreground placeholder:text-muted-foreground text-sm"
                    />
                  </InputGroup>
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
