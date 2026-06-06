import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Stars } from '../components/games/Stars';
import { ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight } from 'lucide-react';

const tabRow = ["description", "ratings"]

export const GameDetail = () => {
  const { id } = useParams();
  const { games, ratings, rateGame, toggleFavorite, favorites, showToast } = useApp();
  const game = games.find(g => g.id === Number(id)) || games[0];
  
  const [activeTab, setActiveTab] = useState("description");
  const [carouselIndex, setCarouselIndex] = useState(0);

  const currentImage = game.gallery[carouselIndex % game.gallery.length];
  const isFavorite = favorites.has(game.id);

  const nextSlide = () => setCarouselIndex(prev => (prev + 1) % game.gallery.length);
  const prevSlide = () => setCarouselIndex(prev => (prev - 1 + game.gallery.length) % game.gallery.length);

  const formatCompact = (value) => Intl.NumberFormat("en", { notation: "compact" }).format(value);

  return (
    <section className="section">
      <div className="detail-layout">
        <div className="detail-header">
          <div className="panel detail-panel">
            <div className="carousel">
              <img className="carousel-image" src={currentImage} alt={game.title} />
              <div className="carousel-controls">
                <button className="icon-button" onClick={prevSlide}><ChevronLeft size={20} /></button>
                <button className="icon-button" onClick={nextSlide}><ChevronRight size={20} /></button>
              </div>
            </div>
          </div>
          <iframe 
            className="video-frame" 
            src={game.video} 
            title={`${game.title} video`} 
            allowFullScreen 
          />
          <div>
            <div className="tab-row">
              {tabRow.map(tab => (
                <button 
                  key={tab}
                  className={`tab-button ghost-button ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="tabs-content">
              {activeTab === "description" && (
                <div className="panel detail-panel active">
                  <h3>Game Overview</h3>
                  <p className="feed-content">{game.longDescription}</p>
                </div>
              )}
              {activeTab === "ratings" && (
                <div className="panel detail-panel active">
                  <h3>Ratings</h3>
                  <p className="muted-text">Set a local star rating to preview UI interactions.</p>
                  <Stars rating={ratings[game.id] || 0} interactive={true} onRate={rateGame} gameId={game.id} />
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="detail-sidebar">
          <div className="panel detail-panel">
            <div className="tag accent">{game.status}</div>
            <h1>{game.title}</h1>
            <div className="meta">by {game.developer}</div>
            <div className="meta-row">
              <span className={`price ${game.price === 0 ? "free" : "paid"}`}>
                {game.price === 0 ? "Free" : `$${game.price}`}
              </span>
              <span className="tag">{formatCompact(game.views)} views</span>
              <span className="tag">{formatCompact(game.downloads)} downloads</span>
            </div>
            <Stars rating={game.rating} />
            <div className="tag-row">{game.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}</div>
            <div className="card-actions">
              <button className="primary-button" onClick={() => showToast("Added to cart")}>
                {game.price === 0 ? "Download" : "Buy Now"}
              </button>
              <Link className="ghost-button ghost-outline" to={`/play/${game.id}`}>Play</Link>
              <button 
                className={`ghost-button ghost-outline ${isFavorite ? "active" : ""}`}
                onClick={() => toggleFavorite(game.id)}
              >
                {isFavorite ? "Favorited" : "Add to Favorite"}
              </button>
            </div>
            <div className="card-actions">
              <button className="icon-button"><ThumbsUp size={18} /></button>
              <button className="icon-button"><ThumbsDown size={18} /></button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};
