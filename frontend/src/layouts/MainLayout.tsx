import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search } from 'lucide-react';

export const MainLayout = ({ children }) => {
  const { user, games, toasts } = useApp();
  const location = useLocation();
  const path = location.pathname;

  const nav = [
    { href: "/", label: "Home", key: "/" },
    { href: "/games", label: "Games", key: "/games" },
    { href: "/submit-game", label: "Submit Game", key: "/submit-game" }
  ];

  const sidebarLinks = [
    { href: "/profile", label: "Profile" },
    { href: "/game-detail/2", label: "Spotlight" },
    { href: "/submit-game", label: "Upload Game" }
  ];

  const ALL_TAGS = [...new Set(games.flatMap((game) => game.tags))];

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark">G</span>
          <span>GameStore</span>
        </Link>
        <label className="searchbar">
          <Search size={18} />
          <input type="search" placeholder="Search games, tags, creators..." />
        </label>
        <div className="topbar-right">
          <nav className="nav-links">
            {nav.map((item) => (
              <Link key={item.key} className={`nav-link ${path === item.href ? "active" : ""}`} to={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link className="ghost-button mobile-nav-toggle" to="/games">Browse</Link>
          <button className="ghost-button">Login</button>
          <Link className="pill-button" to="/profile">
            <img className="avatar" src={user.avatar} alt={user.username} />
            {user.username}
          </Link>
        </div>
      </header>
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-group">
            <h3 className="sidebar-title">Discover</h3>
            <div className="sidebar-links">
              {sidebarLinks.map((item) => (
                <Link key={item.href} className="ghost-button" to={item.href}>{item.label}</Link>
              ))}
            </div>
          </div>
          <div className="sidebar-group">
            <h3 className="sidebar-title">Popular Tags</h3>
            <div className="chip-row">
              {ALL_TAGS.slice(0, 8).map((tag: string) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
          <div className="sidebar-group">
            <h3 className="sidebar-title">Community Pulse</h3>
            <div className="stack">
              <div className="panel">
                <div className="meta">Live players</div>
                <h2>124.5K</h2>
              </div>
            </div>
          </div>
        </aside>
        <main className="main">{children}</main>
      </div>
      <footer className="footer">GameStore UI concept built with React.</footer>
      
      <div className="toast-stack">
        {toasts.map(toast => (
          <div key={toast.id} className="toast">{toast.message}</div>
        ))}
      </div>
    </div>
  );
};
