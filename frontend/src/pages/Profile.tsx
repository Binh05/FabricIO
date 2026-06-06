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
    <section className="section profile-layout">
      <div className="panel profile-banner">
        <img className="avatar" style={{ width: 88, height: 88 }} src={profileUser.avatar} alt={profileUser.username} />
        <div>
          <h1>{profileUser.name}</h1>
          <div className="feed-meta">@{profileUser.username}</div>
          <p className="muted-text">{profileUser.bio}</p>
        </div>
        {isSelf ? (
          <Link className="primary-button" to="/submit-game">Đăng game</Link>
        ) : (
          <button className="primary-button">Follow</button>
        )}
      </div>

      <div className="tab-row">
        {tabs.map(tab => (
          <button 
            key={tab}
            className={`tab-button ghost-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid game-grid">
        {(activeTab === "games" ? authoredGames : favoriteGames).map(game => (
          <GameCard key={game.id} game={game} />
        ))}
        {(activeTab === "games" ? authoredGames : favoriteGames).length === 0 && (
          <div className="panel empty-state"><h3>Chưa có game nào</h3></div>
        )}
      </div>
    </section>
  );
};
