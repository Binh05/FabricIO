import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Stars } from "../components/games/Stars";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/useGame";
import GameDetailPanel from "@/components/games/GameDetailPanel";

const tabRow = ["description", "ratings"];

export const GameDetail = () => {
  const { id } = useParams();
  const { rateGame } = useApp();
  const { games, loading, fetchGameById } = useGame();

  const [activeTab, setActiveTab] = useState("description");
  // const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    if (!games.some((game) => game.id === id)) {
      fetchGameById(id);
    }
  }, []);

  const game = games.find((g) => g.id === id) || games[0];

  if (loading || !game) return null;

  // const images = [game.thumbnailUrl, ...game.media.map((m) => m.mediaUrl)];
  // const currentImage = images[carouselIndex % game.media.length];

  const nextSlide = () => {};
  // setCarouselIndex((prev) => (prev + 1) % game.media.length);
  const prevSlide = () => {};
  // setCarouselIndex(
  //   (prev) => (prev - 1 + game.media.length) % game.media.length,
  // );

  return (
    <section className="mb-16">
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-8">
          <div className="bg-card border-border rounded-lg border p-6">
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <img
                className="h-full w-full object-cover"
                src={game.thumbnailUrl}
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
            src={"https://www.youtube.com/embed/dQw4w9WgXcQ"}
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
                  <p className="text-muted leading-7">{game.description}</p>
                </div>
              )}
              {activeTab === "ratings" && (
                <div className="bg-card border-border rounded-lg border p-6">
                  <h3 className="mb-4 text-xl font-bold">Ratings</h3>
                  <p className="text-muted mb-4 italic">
                    Set a local star rating to preview UI interactions.
                  </p>
                  <Stars
                    rating={game.ratingAvg || 0.0}
                    interactive={true}
                    onRate={rateGame}
                    gameId={game.id}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <GameDetailPanel game={game} />
      </div>
    </section>
  );
};
