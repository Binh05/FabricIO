import { CalendarDays, UserRound } from "lucide-react";
import type { Game } from "@/types/Game";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Stars } from "@/components/games/Stars";
import GameTagChip from "@/components/games/GameTag";

const GameDescription = ({ game }: { game: Game }) => {
  const authorName = game.author?.fullName?.trim();
  const initials = authorName
    ? authorName
        .split(/\s+/)
        .slice(-2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "";
  const description = game.description?.trim();
  const createdAt = new Date(game.createdAt);
  const createdDate = Number.isNaN(createdAt.getTime())
    ? null
    : createdAt.toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
  const formattedPrice =
    game.price === 0
      ? "Miễn phí"
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(game.price);

  return (
    <section
      aria-label={`Thông tin về ${game.title}`}
      className="space-y-5"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold tracking-tight">Mô tả trò chơi</h2>
          <p className="text-muted-foreground mt-3 max-w-3xl whitespace-pre-line text-sm leading-7">
            {description || "Chưa có nội dung mô tả cho trò chơi này."}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3 md:min-w-56">
          <Avatar size="lg" className="size-12">
            {game.author?.avatarUrl && (
              <AvatarImage
                src={game.author.avatarUrl}
                alt={authorName || "Ảnh đại diện tác giả"}
              />
            )}
            <AvatarFallback>{initials || <UserRound size={18} />}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-muted text-xs">Tác giả</p>
            <p className="text-foreground truncate font-semibold">
              {authorName || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <div className="border-border flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {game.tags.map((tag) => (
            <GameTagChip key={tag.id} tag={tag} />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <div>
            <p className="text-muted-foreground text-xs">Đánh giá</p>
            <Stars rating={game.avgRating} />
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Giá</p>
            <p className="text-foreground text-sm font-semibold">
              {formattedPrice}
            </p>
          </div>
          {createdDate && (
            <div className="flex items-center gap-2">
              <CalendarDays
                aria-hidden="true"
                className="text-muted-foreground"
                size={16}
              />
              <div>
                <p className="text-muted-foreground text-xs">Ngày đăng</p>
                <p className="text-foreground text-sm">{createdDate}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GameDescription;