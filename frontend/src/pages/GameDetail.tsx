import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Stars } from "../components/games/Stars";
import { ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const tabRow = ["description", "ratings"];

export const GameDetail = () => {
  const { id } = useParams();
  const { games, ratings, rateGame, toggleFavorite, favorites, showToast } =
    useApp();
  const game = games.find((g) => g.id === Number(id)) || games[0];

  const [activeTab, setActiveTab] = useState("description");
  const [carouselIndex, setCarouselIndex] = useState(0);

  const currentImage = game.gallery[carouselIndex % game.gallery.length];
  const isFavorite = favorites.has(game.id);

  const nextSlide = () =>
    setCarouselIndex((prev) => (prev + 1) % game.gallery.length);
  const prevSlide = () =>
    setCarouselIndex(
      (prev) => (prev - 1 + game.gallery.length) % game.gallery.length,
    );

  const formatCompact = (value) =>
    Intl.NumberFormat("en", { notation: "compact" }).format(value);

  return (
    <section className="mb-16">
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-8">
          <div className="bg-card border-border rounded-lg border p-6">
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <img
                className="h-full w-full object-cover"
                src={currentImage}
                alt={game.title}
              />
              <div className="absolute right-5 bottom-5 flex gap-2.5">
                <Button variant="icon" onClick={prevSlide}>
                  <ChevronLeft size={20} />
                </Button>
                <Button variant="icon" onClick={nextSlide}>
                  <ChevronRight size={20} />
                </Button>
              </div>
            </div>
          </div>
          <iframe
            className="border-border aspect-video w-full rounded-lg border bg-black"
            src={game.video}
            title={`${game.title} video`}
            allowFullScreen
          />
          <div>
            <div className="border-border mb-5 flex gap-2 border-b pb-3">
              {tabRow.map((tab) => (
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
            <div>
              {activeTab === "description" && (
                <div className="bg-card border-border rounded-lg border p-6">
                  <h3 className="mb-4 text-xl font-bold">Game Overview</h3>
                  <p className="text-muted leading-7">{game.longDescription}</p>
                </div>
              )}
              {activeTab === "ratings" && (
                <div className="bg-card border-border rounded-lg border p-6">
                  <h3 className="mb-4 text-xl font-bold">Ratings</h3>
                  <p className="text-muted mb-4 italic">
                    Set a local star rating to preview UI interactions.
                  </p>
                  <Stars
                    rating={ratings[game.id] || 0}
                    interactive={true}
                    onRate={rateGame}
                    gameId={game.id}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="detail-sidebar">
          <div className="bg-card border-border flex flex-col gap-6 rounded-lg border p-6">
            <div className="bg-primary/10 text-primary border-primary/20 self-start rounded-full border px-3 py-1 text-[13px] font-bold tracking-wider uppercase">
              {game.status}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {game.title}
            </h1>
            <div className="text-muted">
              by{" "}
              <span className="font-medium text-white">{game.developer}</span>
            </div>
            <div className="border-border flex items-center justify-between border-y py-2">
              <span
                className={`text-2xl font-extrabold ${game.price === 0 ? "text-success" : "text-warning"}`}
              >
                {game.price === 0 ? "Free" : `$${game.price}`}
              </span>
              <div className="text-muted flex flex-col items-end text-[12px]">
                <span>{formatCompact(game.views)} views</span>
                <span>{formatCompact(game.downloads)} downloads</span>
              </div>
            </div>
            <Stars rating={game.rating} />
            <div className="flex flex-wrap gap-2">
              {game.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-muted border-border rounded-full border bg-white/5 px-3 py-1 text-[13px]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <Button
                variant="gradient"
                onClick={() => showToast("Added to cart")}
              >
                {game.price === 0 ? "Download" : "Buy Now"}
              </Button>
              <Button variant="outline" asChild>
                <Link to={`/play/${game.id}`}>Play</Link>
              </Button>
              <Button
                variant="outline"
                className={
                  isFavorite
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : ""
                }
                onClick={() => toggleFavorite(game.id)}
              >
                {isFavorite ? "Favorited" : "Add to Favorite"}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="icon">
                <ThumbsUp size={18} />
              </Button>
              <Button variant="icon">
                <ThumbsDown size={18} />
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};
