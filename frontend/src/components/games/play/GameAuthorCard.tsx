import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import UserAvatar from "@/components/layouts/UserAvatar";
import type { Game } from "@/types/Game";

interface GameAuthorCardProps {
  game: Game;
}

export function GameAuthorCard({ game }: GameAuthorCardProps) {
  const authorName = game.author?.fullName?.trim() || "Indie Creator";
  const authorPath = game.author?.username ? `/u/${game.author.username}` : undefined;
  const author = (
    <>
      <UserAvatar name={authorName} avatarUrl={game.author?.avatarUrl} type="describe" />
    </>
  );

  return (
    <Card className="border-border-subtle bg-surface-container-low rounded-sm p-6 sm:p-7">
      <h2 className="text-foreground mb-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
        Author
      </h2>
      <div className="flex items-start gap-3">
        <div className="flex items-baseline">
          {authorPath ? <Link to={authorPath}>{author}</Link> : author}
        </div>
        <div className="-mt-1.5">
          {authorPath ? (
            <Link to={authorPath} className="text-secondary-foreground font-mono font-semibold hover:underline">
              @{game.author?.username}
            </Link>
          ) : (
            <span className="text-secondary-foreground font-mono font-semibold">
              @{game.author?.username}
            </span>
          )}
          <h3 className="text-foreground shrink-0 text-sm font-semibold sm:text-lg">{authorName}</h3>
          <span className="text-muted-foreground line-clamp-3 text-xs leading-relaxed font-medium sm:text-sm">
            {game.author?.bio ?? "Indie Creator"}
          </span>
        </div>
      </div>
    </Card>
  );
}
