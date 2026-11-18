import { useRef, useState } from "react";
import {
  Maximize2,
  Play as PlayIcon,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";
import type { Game } from "@/types/Game";

interface GamePlayerBoxProps {
  game: Game;
}

function GamePlayerBox({ game }: GamePlayerBoxProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleReload = () => {
    if (iframeRef.current) {
      if (game.gameUrl) {
        iframeRef.current.src = game.gameUrl;
      }
      toast.success("Game reloaded");
      return;
    }

    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 50);
  };

  const toggleSound = () => {
    setIsMuted((prev) => {
      const next = !prev;
      toast.info(next ? "Audio muted" : "Audio unmuted");
      return next;
    });
  };

  const handleFullscreen = () => {
    const target = playerContainerRef.current;
    if (!target) return;

    if (document.fullscreenElement) {
      void document.exitFullscreen?.();
    } else {
      void target.requestFullscreen?.();
    }
  };

  return (
    <div
      ref={playerContainerRef}
      className="border-border-subtle bg-surface-container-lowest flex flex-col overflow-hidden rounded-md border shadow-xl"
    >
      <div className="bg-surface-container-lowest relative flex aspect-video w-full items-center justify-center">
        {isPlaying ? (
          <iframe
            ref={iframeRef}
            id="webgl-iframe"
            src={game.gameUrl}
            className="h-full w-full border-none"
            title={`${game.title} WebGL`}
            allow="fullscreen; autoplay; gamepad; clipboard-read; clipboard-write"
            sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-popups"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            aria-label={`Play ${game.title}`}
            className="group relative flex size-full cursor-pointer flex-col items-center justify-center overflow-hidden"
          >
            <img
              src={game.thumbnailUrl}
              alt={`${game.title} preview`}
              className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="bg-surface-container-lowest/50 group-hover:bg-surface-container-lowest/40 absolute inset-0 backdrop-blur-[2px] transition-colors" />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <span className="bg-primary text-primary-foreground flex size-16 items-center justify-center rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 active:scale-95 sm:size-20">
                <PlayIcon className="size-8 translate-x-0.5 fill-current" />
              </span>
              <span className="text-foreground text-xl font-extrabold tracking-tight drop-shadow-md sm:text-2xl">
                Play {game.title}
              </span>
            </div>
          </button>
        )}
      </div>

      <div className="bg-surface-container-lowest border-border-subtle flex items-center justify-between gap-3 border-t px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReload}
            aria-label="Reload Game"
            title="Reload Game"
            className="bg-surface-container-high/60 hover:bg-surface-container-highest border-border-subtle text-foreground flex size-9 items-center justify-center rounded-lg border transition-colors"
          >
            <RotateCcw className="size-4" />
          </button>
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
            className="bg-surface-container-high/60 hover:bg-surface-container-highest border-border-subtle text-foreground flex size-9 items-center justify-center rounded-lg border transition-colors"
          >
            {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
        </div>
        <button
          type="button"
          onClick={handleFullscreen}
          className="bg-primary hover:bg-primary/90 text-primary-foreground flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-semibold shadow-sm transition-all active:scale-95"
        >
          <Maximize2 className="size-3.5" />
          <span>Fullscreen</span>
        </button>
      </div>
    </div>
  );
}

export default GamePlayerBox;
