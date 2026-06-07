import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { users } from "@/data/mockData";
import { GameCard } from "@/components/games/GameCard";
import { Button } from "@/components/ui/button";

export const Profile = () => {
  const [searchParams] = useSearchParams();
  const { user: currentUser, games, favorites } = useApp();
  const userId = searchParams.get("user");
  const profileUser = users.find((u) => u.id === Number(userId)) || currentUser;
  const isSelf = profileUser.id === currentUser.id;

  const [activeTab, setActiveTab] = useState("games");

  const authoredGames = games.filter((g) => {
    const dev = String(g.developer).toLowerCase();
    return (
      dev === profileUser.name.toLowerCase() ||
      dev === profileUser.username.toLowerCase()
    );
  });

  const favoriteGames = games.filter((g) => favorites.has(g.id));

  const tabs = isSelf ? ["games", "favorites"] : ["games"];

  return (
    <section className="mb-16">
      <div className="bg-card border-border mb-10 flex flex-col items-center gap-8 rounded-lg border p-10 md:flex-row md:items-start">
        <img
          className="h-24 w-24 rounded-full border-4 border-white/5 object-cover"
          src={profileUser.avatar}
          alt={profileUser.username}
        />
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {profileUser.name}
          </h1>
          <div className="text-primary mb-2 font-semibold">
            @{profileUser.username}
          </div>
          <p className="text-muted">{profileUser.bio}</p>
        </div>
        {isSelf ? (
          <Button variant="gradient" asChild>
            <Link to="/submit-game">Đăng game</Link>
          </Button>
        ) : (
          <Button variant="gradient">Follow</Button>
        )}
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

      <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2 xl:grid-cols-3">
        {(activeTab === "games" ? authoredGames : favoriteGames).map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
        {(activeTab === "games" ? authoredGames : favoriteGames).length ===
          0 && (
          <div className="bg-card border-border rounded-lg border p-12 text-center md:col-span-2 xl:col-span-3">
            <h3 className="text-xl font-bold">Chưa có game nào</h3>
          </div>
        )}
      </div>
    </section>
  );
};
