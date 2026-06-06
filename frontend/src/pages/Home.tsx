import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { GameCard } from '@/components/games/GameCard';

const SectionHeading = ({ title, subtitle = "", action = null }) => (
  <div className="section-head">
    <div>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const Home = () => {
  const { games } = useApp();
  const featured = games.filter((game) => game.status === "featured");
  const trending = games.filter((game) => game.status === "trending");

  return (
    <>
      <section className="section hero">
        <div className="hero-copy">
          <span className="eyebrow">Featured Drop</span>
          <h1>Discover indie games and creator updates in one dark, modern hub.</h1>
          <p>GameStore blends dense discovery with a modern interface designed for player interaction and creator storytelling.</p>
          <div className="hero-actions">
            <Link className="primary-button" to={`/game-detail/${games[0].id}`}>Play Now</Link>
            <Link className="ghost-button ghost-outline" to="/games">View Games</Link>
          </div>
        </div>
        <div className="hero-media">
          <img src={games[0].heroImage} alt={games[0].title} />
          <div className="floating-card">
            <div className="muted-text">Trending tonight</div>
            <h3>{games[1].title}</h3>
            <div className="meta-row">
              <span className="price paid">${games[1].price}</span>
              <span className="tag accent">{games[1].tags[0]}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <SectionHeading 
          title="Featured Games" 
          subtitle="Curated highlights with strong cover art, ratings, and tags."
          action={<Link className="ghost-button ghost-outline" to="/games">Browse all</Link>}
        />
        <div className="grid game-grid">
          {featured.map((game) => <GameCard key={game.id} game={game} />)}
        </div>
      </section>

      <section className="section">
        <SectionHeading title="Trending Now" subtitle="A horizontal discovery rail inspired by storefront browsing." />
        <div className="trending-row">
          {trending.map((game) => <GameCard key={game.id} game={game} compact={true} />)}
        </div>
      </section>
    </>
  );
};
