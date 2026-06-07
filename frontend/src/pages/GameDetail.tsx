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
    <section className="mb-16">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-10">
        <div className="flex flex-col gap-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="relative rounded-lg overflow-hidden aspect-video">
              <img className="w-full h-full object-cover" src={currentImage} alt={game.title} />
              <div className="absolute bottom-5 right-5 flex gap-2.5">
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-border text-muted cursor-pointer transition-all duration-200 hover:bg-primary/10 hover:border-primary/30 hover:text-primary" onClick={prevSlide}><ChevronLeft size={20} /></button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-border text-muted cursor-pointer transition-all duration-200 hover:bg-primary/10 hover:border-primary/30 hover:text-primary" onClick={nextSlide}><ChevronRight size={20} /></button>
              </div>
            </div>
          </div>
          <iframe 
            className="w-full aspect-video rounded-lg border border-border bg-black" 
            src={game.video} 
            title={`${game.title} video`} 
            allowFullScreen 
          />
          <div>
            <div className="flex gap-2 mb-5 border-b border-border pb-3">
              {tabRow.map(tab => (
                <button 
                  key={tab}
                  className={`px-5 py-2.5 rounded-sm font-semibold transition-all duration-200 cursor-pointer hover:bg-white/5 hover:text-white ${activeTab === tab ? "bg-white/10 text-white" : "text-muted"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div>
              {activeTab === "description" && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Game Overview</h3>
                  <p className="leading-7 text-muted">{game.longDescription}</p>
                </div>
              )}
              {activeTab === "ratings" && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Ratings</h3>
                  <p className="text-muted mb-4 italic">Set a local star rating to preview UI interactions.</p>
                  <Stars rating={ratings[game.id] || 0} interactive={true} onRate={rateGame} gameId={game.id} />
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="detail-sidebar">
          <div className="bg-card border border-border rounded-lg p-6 flex flex-col gap-6">
            <div className="bg-primary/10 text-primary self-start px-3 py-1 rounded-full text-[13px] border border-primary/20 font-bold uppercase tracking-wider">{game.status}</div>
            <h1 className="text-3xl font-extrabold tracking-tight">{game.title}</h1>
            <div className="text-muted">by <span className="text-white font-medium">{game.developer}</span></div>
            <div className="flex justify-between items-center py-2 border-y border-border">
              <span className={`text-2xl font-extrabold ${game.price === 0 ? "text-success" : "text-warning"}`}>
                {game.price === 0 ? "Free" : `$${game.price}`}
              </span>
              <div className="flex flex-col items-end text-[12px] text-muted">
                <span>{formatCompact(game.views)} views</span>
                <span>{formatCompact(game.downloads)} downloads</span>
              </div>
            </div>
            <Stars rating={game.rating} />
            <div className="flex flex-wrap gap-2">{game.tags.map(tag => <span key={tag} className="bg-white/5 px-3 py-1 rounded-full text-[13px] text-muted border border-border">{tag}</span>)}</div>
            <div className="flex flex-col gap-3">
              <button className="bg-linear-to-br from-primary to-primary-glow text-white border-none py-4 px-6 rounded-sm font-bold cursor-pointer transition-all duration-200 hover:brightness-110 shadow-glow" onClick={() => showToast("Added to cart")}>
                {game.price === 0 ? "Download" : "Buy Now"}
              </button>
                <Link className="px-5 py-3 rounded-sm text-center text-white font-semibold transition-all duration-200 bg-white/5 border border-border cursor-pointer hover:bg-white/10" to={`/play/${game.id}`}>Play</Link>
              <button 
                className={`px-5 py-3 rounded-sm font-semibold transition-all duration-200 border border-border cursor-pointer ${isFavorite ? "bg-primary/10 border-primary/30 text-primary" : "text-muted hover:bg-white/5 hover:text-white"}`}
                onClick={() => toggleFavorite(game.id)}
              >
                {isFavorite ? "Favorited" : "Add to Favorite"}
              </button>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-border text-muted cursor-pointer transition-all duration-200 hover:bg-primary/10 hover:border-primary/30 hover:text-primary"><ThumbsUp size={18} /></button>
              <button className="flex-1 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-border text-muted cursor-pointer transition-all duration-200 hover:bg-primary/10 hover:border-primary/30 hover:text-primary"><ThumbsDown size={18} /></button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};
