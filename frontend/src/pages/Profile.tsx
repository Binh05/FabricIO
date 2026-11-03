import { useEffect, useState } from "react";
import { GameCard } from "@/components/games/GameCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import UserAvatar from "@/components/layouts/UserAvatar";
import AvatarUpload from "@/components/profile/AvatarUpload";
import { useGame } from "@/hooks/useGame";
import { Link, Navigate } from "react-router-dom";
import { HomeSkeleton } from "@/components/skeletons/HomeSkeleton";
import { GameCardSkeleton } from "@/components/skeletons/GameCardSkeleton";
import type { Game } from "@/types/Game";

export const Profile = () => {
  const { user, loading, signOut } = useAuth();
  const { fetchMyGames } = useGame();
  const [activeTab, setActiveTab] = useState("games");
  const [myGames, setMyGames] = useState<Game[]>([]);
  const [gameLoading, setGameLoading] = useState(false);

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

  if (loading) {
    return <HomeSkeleton />;
  }

  if (!user) return <Navigate to={"/signin"} replace />;

  // const favoriteGames = games.filter((g) => favorites.has(g.id));
  // const tabs = isSelf ? ["games", "favorites"] : ["games"];
  const tabs = ["games"];

  const onSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    await signOut();
  };

  return (
    <section className="mb-16">
      <div className="bg-card border-border mb-10 flex flex-col items-center gap-8 rounded-lg border p-10 md:flex-row md:items-start">
        <div className="relative">
          <UserAvatar
            name={user.username}
            avatarUrl={user?.avatarUrl ?? undefined}
            type="profile"
          />
          <AvatarUpload />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {user.fullName}
          </h1>
          <div className="text-primary mb-2 font-semibold">@{user.email}</div>
          <p className="text-muted">
            {user?.bio ?? "Hãy giới thiệu về bản thân."}
          </p>
        </div>
        <div className="my-auto flex flex-col gap-3">
          <Button variant="gradient" asChild>
            <Link to="/upload-game">Đăng game</Link>
          </Button>

          <Button
            variant="outline"
            className="transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
            onClick={(e) => onSignOut(e)}
          >
            Đăng xuất
          </Button>
        </div>
      </div>

      <div className="border-border mb-8 flex gap-2 border-b px-2 pb-3">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant="tab"
            aria-expanded={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:gap-2 md:grid-cols-4 xl:grid-cols-6">
        {gameLoading
          ? Array.from({ length: 3 }).map((_, index) => (
            <GameCardSkeleton key={index} />
          ))
          : myGames.map((game) => <GameCard key={game.id} game={game} />)}
        {!gameLoading && myGames.length === 0 && (
          <div className="bg-card border-border rounded-lg border p-12 text-center md:col-span-2 xl:col-span-6 lg:col-span-4">
            <h3 className="text-xl font-bold">Bạn chưa có game nào</h3>
            <p className="text-muted-foreground mt-2">
              Hãy đăng game đầu tiên của bạn!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
