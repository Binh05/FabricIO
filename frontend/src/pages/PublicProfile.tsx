import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GameCard } from "@/components/games/GameCard";
import { GameCardSkeleton } from "@/components/skeletons/GameCardSkeleton";
import UserAvatar from "@/components/layouts/UserAvatar";
import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/useGame";
import { useUser } from "@/hooks/useUser";
import type { Game } from "@/types/Game";
import type { FetchUserResult } from "@/types/User";

const PublicProfile = () => {
  const { id } = useParams<{ id: string }>();
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
      <section className="m-6">
        <div className="bg-card border-border mb-6 h-56 animate-pulse rounded-lg border" />
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4 md:gap-2 xl:grid-cols-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <GameCardSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="m-6 flex flex-col items-center gap-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Không tìm thấy người dùng</h1>
        <Button variant="outline" asChild>
          <Link to="/games">Quay lại danh sách game</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="m-6 mb-6">
      <div className="bg-card border-border mb-6 flex flex-col items-center gap-8 rounded-lg border p-10 md:flex-row md:items-start">
        <UserAvatar
          name={profile.fullName}
          avatarUrl={profile.avatarUrl ?? undefined}
          type="profile"
        />
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {profile.fullName}
          </h1>
          <p className="text-muted mt-2">
            {profile.bio ?? "Hãy giới thiệu về bản thân."}
          </p>
          <p className="text-muted mt-3 text-xs">
            Tham gia từ{" "}
            {new Date(profile.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
      </div>

      <div className="border-border mb-8 border-b px-2 pb-3">
        <h2 className="text-xl font-bold">Game đã đăng</h2>
      </div>

      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4 md:gap-2 xl:grid-cols-6">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
        {games.length === 0 && (
          <div className="bg-card border-border rounded-lg border p-12 text-center md:col-span-2 lg:col-span-4 xl:col-span-6">
            <h3 className="text-xl font-bold">Chưa có game nào</h3>
            <p className="text-muted-foreground mt-2">
              Người dùng này chưa đăng game nào.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PublicProfile;
