import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import {
  Check,
  Gamepad2,
  LogOut,
  Pencil,
  PlusCircle,
  ShieldCheck,
} from "lucide-react";
import { GameCard } from "@/components/games/GameCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/layouts/UserAvatar";
import AvatarUpload from "@/components/profile/AvatarUpload";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import { HomeSkeleton } from "@/components/skeletons/HomeSkeleton";
import { GameCardSkeleton } from "@/components/skeletons/GameCardSkeleton";
import type { Game } from "@/types/Game";

const formatJoinDate = (dateString?: string | Date) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  return `Gia nhập: T${d.getMonth() + 1}/${d.getFullYear()}`;
};

export const Profile = () => {
  const { user, loading, signOut } = useAuth();
  const { fetchMyGames } = useGame();
  const [activeTab, setActiveTab] = useState("games");
  const [myGames, setMyGames] = useState<Game[]>([]);
  const [gameLoading, setGameLoading] = useState(false);
  const editFormRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    const loadMyGames = async () => {
      setGameLoading(true);
      try {
        const games = await fetchMyGames();
        setMyGames(games);
      } finally {
        setGameLoading(false);
      }
    };

    loadMyGames();
  }, [user?.id]);

  const scrollToEditForm = () => {
    editFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    const nameInput = document.getElementById("profile-bio");
    nameInput?.focus();
  };

  useEffect(() => {
    if (
      location.hash === "#edit-profile-form" ||
      (location.state as { scrollToEdit?: boolean } | null)?.scrollToEdit
    ) {
      scrollToEditForm();
    }
  }, [location]);

  if (loading) {
    return <HomeSkeleton />;
  }

  if (!user) return <Navigate to={"/signin"} replace />;

  const onSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    await signOut();
  };

  const isAdmin = user.username?.toLowerCase() === "admin";
  const roleBadgeText = isAdmin
    ? "PLATFORM ADMIN & INDIE DEV"
    : "INDIE GAME DEVELOPER";
  const joinDate = formatJoinDate(user.createdAt);
  const bioText = user.bio?.trim()
    ? user.bio
    : 'Chưa cập nhật tiểu sử hoặc mô tả ngắn gọn về niềm đam mê lập trình game WebGL indie. Nhấn "Chỉnh sửa hồ sơ" bên dưới để hoàn thiện thông tin nhà phát triển.';

  return (
    <section className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      {/* User Information Card matching Image 1 */}
      <div className="border-border-subtle bg-surface-container-low relative overflow-hidden rounded-md border p-5 shadow-sm sm:p-6">
        {/* Subtle top edge red accent */}
        <div className="via-primary/80 absolute top-0 right-0 left-0 h-0.5 bg-linear-to-r from-transparent to-transparent" />

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Avatar + Identity Details */}
          <div className="flex min-w-0 flex-1 flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
            <div className="relative shrink-0">
              <UserAvatar
                name={user.username}
                avatarUrl={user?.avatarUrl ?? undefined}
                type="profile"
              />
              <AvatarUpload />
            </div>

            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {user.fullName}
                </h1>
                <span className="border-primary/25 bg-primary/15 text-primary inline-flex items-center gap-1 rounded-xs border px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase">
                  <ShieldCheck className="size-3.5" />
                  {roleBadgeText}
                </span>
                {/* <span className="inline-flex items-center gap-1 rounded-xs border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                  <Check className="size-3.5" />
                  Đã xác minh
                </span> */}
              </div>

              <div className="text-muted-foreground mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-mono text-xs sm:justify-start sm:text-sm">
                <span className="text-secondary-foreground font-semibold">
                  @{user.username}
                </span>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-muted-foreground">{user.email}</span>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-muted-foreground/90 font-sans">
                  {joinDate}
                </span>
              </div>

              <p className="text-muted-foreground mt-2 max-w-2xl font-sans text-xs leading-relaxed sm:text-sm">
                {bioText}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-2 flex w-full shrink-0 flex-col items-stretch gap-2 sm:flex-row md:mt-0 md:w-auto md:flex-col">
            <Button
              variant="outline"
              size="sm"
              className="border-border-chip bg-surface-container-high hover:bg-surface-container-highest text-foreground h-9 cursor-pointer gap-2 rounded-sm px-3.5 text-xs font-semibold sm:text-sm"
              onClick={scrollToEditForm}
            >
              <Pencil className="size-4" />
              <span>Chỉnh sửa hồ sơ</span>
            </Button>

            <Button
              variant="gradient"
              size="sm"
              className="shadow-primary/20 h-9 gap-2 rounded-sm px-3.5 text-xs font-bold shadow-md sm:text-sm"
              asChild
            >
              <Link to="/upload-game">
                <PlusCircle className="size-4" />
                <span>Đăng game mới</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 cursor-pointer gap-1.5 rounded-sm px-3 text-xs font-medium"
              onClick={(e) => onSignOut(e)}
            >
              <LogOut className="size-3.5" />
              <span>Đăng xuất</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Profile Form with ref target for smooth scrolling */}
      <div ref={editFormRef}>
        <ProfileEditForm user={user} />
      </div>

      {/* Published Games Header Bar matching Image 2 */}
      <div className="bg-surface-container-low border-border-subtle flex flex-col gap-2 rounded-sm border p-1.5 sm:flex-row sm:items-center sm:justify-between sm:px-3 sm:py-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm",
              activeTab === "games"
                ? "bg-surface-container-high text-foreground shadow-xs"
                : "text-muted-foreground hover:bg-surface-container-high/60 hover:text-foreground",
            )}
            onClick={() => setActiveTab("games")}
          >
            <Gamepad2 className="text-primary size-4" />
            <span>Games đã đăng</span>
            <span className="bg-primary py-0.2 text-primary-foreground rounded-xs px-1.5 font-mono text-[11px] font-bold">
              {myGames.length}
            </span>
          </button>
        </div>

        <div className="flex items-center justify-between px-1 sm:justify-end sm:px-0">
          <span className="text-muted-foreground font-mono text-[11px] tracking-wider uppercase sm:text-xs">
            HIỂN THỊ: {myGames.length} / {myGames.length} GAME
          </span>
        </div>
      </div>

      {/* Games Showcase Grid */}
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4 md:gap-2 xl:grid-cols-6">
        {gameLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <GameCardSkeleton key={index} />
            ))
          : myGames.map((game) => <GameCard key={game.id} game={game} />)}
        {!gameLoading && myGames.length === 0 && (
          <Card className="border-border-subtle bg-surface-container-low col-span-2 rounded-sm p-12 text-center sm:col-span-3 md:col-span-4 lg:col-span-4 xl:col-span-6">
            <h3 className="text-xl font-bold">Bạn chưa có game nào</h3>
            <p className="text-muted-foreground mt-2">
              Hãy đăng game đầu tiên của bạn!
            </p>
          </Card>
        )}
      </div>
    </section>
  );
};
