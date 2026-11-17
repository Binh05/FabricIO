import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Gamepad2, Pencil, PlusCircle, ShieldCheck } from "lucide-react";
import { GameCard } from "@/components/games/GameCard";
import { GameCardSkeleton } from "@/components/skeletons/GameCardSkeleton";
import UserAvatar from "@/components/layouts/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import { useUser } from "@/hooks/useUser";
import type { Game } from "@/types/Game";
import type { FetchUserResult } from "@/types/User";

const formatJoinDate = (dateString?: string | Date) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  return `Gia nhập: T${d.getMonth() + 1}/${d.getFullYear()}`;
};

const PublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { fetchUserById } = useUser();
  const { fetchUserGames } = useGame();
  const [profile, setProfile] = useState<FetchUserResult | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const [fetchedProfile, fetchedGames] = await Promise.all([
        fetchUserById(id),
        fetchUserGames(id),
      ]);

      if (!isMounted) return;

      setProfile(fetchedProfile);
      setGames(fetchedGames);
      setLoading(false);
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
        <div className="bg-surface-container-low border-border-subtle h-48 animate-pulse rounded-md border sm:h-56" />
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4 md:gap-2 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <GameCardSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
        <Card className="border-border-subtle bg-surface-container-low flex flex-col items-center gap-4 rounded-sm p-12 text-center">
          <h1 className="text-2xl font-bold">Không tìm thấy người dùng</h1>
          <p className="text-muted-foreground text-sm">
            Người dùng không tồn tại hoặc tài khoản đã bị vô hiệu hóa.
          </p>
          <Button variant="outline" asChild>
            <Link to="/games">Quay lại danh sách game</Link>
          </Button>
        </Card>
      </section>
    );
  }

  const isSelf = user?.id === profile.id;
  const roleBadgeText =
    isSelf && user?.username?.toLowerCase() === "admin"
      ? "PLATFORM ADMIN & INDIE DEV"
      : "INDIE GAME DEVELOPER";
  const joinDate = formatJoinDate(profile.createdAt);
  const bioText = profile.bio?.trim()
    ? profile.bio
    : "Chưa cập nhật tiểu sử hoặc mô tả ngắn gọn về niềm đam mê lập trình game WebGL indie.";

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
                name={profile.fullName}
                avatarUrl={profile.avatarUrl ?? undefined}
                type="profile"
              />
            </div>

            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {profile.fullName}
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

              <div className="text-muted-foreground mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs sm:justify-start sm:text-sm">
                {profile?.username && (
                  <>
                    <span className="text-cyan font-mono font-semibold">
                      @{profile.username}
                    </span>
                    <span className="text-muted-foreground/40">•</span>
                  </>
                )}
                <span className="text-muted-foreground/90">{joinDate}</span>
              </div>

              <p className="text-muted-foreground mt-2 max-w-2xl text-xs leading-relaxed sm:text-sm">
                {bioText}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-2 flex w-full shrink-0 flex-col items-stretch gap-2 sm:flex-row md:mt-0 md:w-auto md:flex-col">
            {isSelf ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border-chip bg-surface-container-high hover:bg-surface-container-highest text-foreground h-9 cursor-pointer gap-2 rounded-sm px-3.5 text-xs font-semibold sm:text-sm"
                  asChild
                >
                  <Link
                    to="/profile#edit-profile-form"
                    state={{ scrollToEdit: true }}
                  >
                    <Pencil className="size-4" />
                    <span>Chỉnh sửa hồ sơ</span>
                  </Link>
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
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border-border-chip bg-surface-container-high hover:bg-surface-container-highest text-foreground h-9 cursor-pointer gap-2 rounded-sm px-3.5 text-xs font-semibold sm:text-sm"
                asChild
              >
                <Link to="/games">Khám phá games</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Published Games Header Bar matching Image 2 */}
      <div className="bg-surface-container-low border-border-subtle flex flex-col gap-2 rounded-sm border p-1.5 sm:flex-row sm:items-center sm:justify-between sm:px-3 sm:py-2">
        <div className="flex items-center gap-1.5">
          <div className="bg-surface-container-high text-foreground flex items-center gap-2 rounded-sm px-3 py-1.5 text-xs font-semibold shadow-xs sm:text-sm">
            <Gamepad2 className="text-primary size-4" />
            <span>Games đã đăng</span>
            <span className="bg-primary py-0.2 text-primary-foreground rounded-xs px-1.5 font-mono text-[11px] font-bold">
              {games.length}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between px-1 sm:justify-end sm:px-0">
          <span className="text-muted-foreground font-mono text-[11px] tracking-wider uppercase sm:text-xs">
            HIỂN THỊ: {games.length} / {games.length} GAME
          </span>
        </div>
      </div>

      {/* Games Showcase Grid */}
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4 md:gap-2 xl:grid-cols-6">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
        {games.length === 0 && (
          <Card className="border-border-subtle bg-surface-container-low col-span-2 rounded-sm p-12 text-center sm:col-span-3 md:col-span-4 lg:col-span-4 xl:col-span-6">
            <h3 className="text-xl font-bold">Chưa có game nào</h3>
            <p className="text-muted-foreground mt-2">
              Người dùng này chưa đăng game nào.
            </p>
          </Card>
        )}
      </div>
    </section>
  );
};

export default PublicProfile;
