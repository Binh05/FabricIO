import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Stars } from "../components/games/Stars";
import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/useGame";
import GameDetailPanel from "@/components/games/GameDetailPanel";
import AppCarousel from "@/components/common/AppCarousel";

const tabRow = ["description", "ratings"];

export const GameDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { games, loading, fetchGameById } = useGame();

  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (!id) return;
    if (!games.some((game) => game.id === id)) {
      fetchGameById(id);
    }

    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, [id]);

  if (!id) return;

  const game = games.find((g) => g.id === id) || games[0];

  if (loading || !game) return null;

  const images = [game.thumbnailUrl, ...game.media.map((m) => m.mediaUrl)];

  return (
    <section className="mb-16">
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-8">
          <AppCarousel images={images} alt={game.title} />
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
                    onRate={() => {}}
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
