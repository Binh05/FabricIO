import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { users } from '@/data/mockData';
import { GameCard } from '@/components/games/GameCard';

export const Profile = () => {
  const [searchParams] = useSearchParams();
  const { user: currentUser, games, favorites } = useApp();
  const userId = searchParams.get("user");
  const profileUser = users.find(u => u.id === Number(userId)) || currentUser;
  const isSelf = profileUser.id === currentUser.id;

  const [activeTab, setActiveTab] = useState("games");

  const authoredGames = games.filter(g => {
    const dev = String(g.developer).toLowerCase();
    return dev === profileUser.name.toLowerCase() || dev === profileUser.username.toLowerCase();
  });

  const favoriteGames = games.filter(g => favorites.has(g.id));

  const tabs = isSelf ? ["games", "favorites"] : ["games"];

  return (
    <section className="mb-16">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-card border border-border rounded-lg p-10 mb-10">
        <img className="w-24 h-24 rounded-full object-cover border-4 border-white/5" src={profileUser.avatar} alt={profileUser.username} />
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight">{profileUser.name}</h1>
          <div className="text-primary font-semibold mb-2">@{profileUser.username}</div>
          <p className="text-muted">{profileUser.bio}</p>
        </div>
        {isSelf ? (
          <Link className="bg-linear-to-br from-primary to-primary-glow text-white border-none py-3 px-6 rounded-sm font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 shadow-glow inline-flex items-center justify-center" to="/submit-game">Đăng game</Link>
        ) : (
          <button className="bg-linear-to-br from-primary to-primary-glow text-white border-none py-3 px-6 rounded-sm font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 shadow-glow inline-flex items-center justify-center">Follow</button>
        )}
      </div>

      <div className="flex gap-2 mb-8 px-2 border-b border-border pb-3">
        {tabs.map(tab => (
          <button 
            key={tab}
            className={`px-5 py-2.5 rounded-sm font-semibold transition-all duration-200 cursor-pointer hover:bg-white/5 hover:text-white ${activeTab === tab ? "bg-white/10 text-white" : "text-muted"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[30px]">
        {(activeTab === "games" ? authoredGames : favoriteGames).map(game => (
          <GameCard key={game.id} game={game} />
        ))}
        {(activeTab === "games" ? authoredGames : favoriteGames).length === 0 && (
          <div className="bg-card border border-border rounded-lg p-12 text-center md:col-span-2 xl:col-span-3">
            <h3 className="text-xl font-bold">Chưa có game nào</h3>
          </div>
        )}
      </div>
    </section>
  );
};
