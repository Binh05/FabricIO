import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Stars } from '@/components/games/Stars';
import { Heart, ThumbsUp, ThumbsDown } from 'lucide-react';

export const GameCard = ({ game, compact = false }) => {
  const { toggleFavorite, favorites, user, showToast } = useApp();
  const isFavorite = favorites.has(game.id);
  
  const isMyGame = () => {
    const dev = String(game.developer || "").trim().toLowerCase();
    return dev === String(user.name).toLowerCase() || dev === String(user.username).toLowerCase();
  };

  const formatPrice = (price) => (price === 0 ? "Free" : `$${price.toFixed(2)}`);

  return (
    <article className="card">
      <div className="card-media">
        <img src={game.heroImage} alt={game.title} />
      </div>
      <div className="card-body">
        <div className="card-title-row">
          <div>
            <h3 className="card-title">{game.title}</h3>
            <div className="card-meta">{game.developer}</div>
          </div>
          <button 
            className={`icon-button ${isFavorite ? "active" : ""}`} 
            onClick={() => toggleFavorite(game.id)}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="tag-row">
          {game.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
        </div>
        <div className="meta-row">
          <span className={`price ${game.price === 0 ? "free" : "paid"}`}>{formatPrice(game.price)}</span>
          <span className="stat-badge"><Stars rating={game.rating} /></span>
        </div>
        {!compact && (
          <>
            <p className="muted-text line-clamp-2">{game.description}</p>
            <div className="card-actions">
              <Link className="primary-button" to={`/game-detail/${game.id}`}>View</Link>
              {game.price === 0 ? (
                <Link className="ghost-button ghost-outline" to={`/play/${game.id}`}>Play</Link>
              ) : (
                <button className="ghost-button ghost-outline" onClick={() => showToast("Added to cart")}>Buy</button>
              )}
              {isMyGame() && (
                <Link className="ghost-button ghost-outline" to={`/submit-game?edit=${game.id}`}>Edit</Link>
              )}
              <button className="icon-button"><ThumbsUp size={16} /></button>
              <button className="icon-button"><ThumbsDown size={16} /></button>
            </div>
          </>
        )}
      </div>
    </article>
  );
};
