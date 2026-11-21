import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { getAvatarBgColor, getAvatarInitials } from "@/lib/commentUtils";

interface IUserAvatarProps {
  type: "header" | "profile" | "describe" | "comment";
  name: string;
  avatarUrl?: string;
  className?: string;
}

function UserAvatar({
  type,
  name = "",
  avatarUrl,
  className,
}: IUserAvatarProps) {
  const bgColor = !avatarUrl ? getAvatarBgColor(name) : "";

  return (
    <div className="relative inline-flex">
      <Avatar
        className={cn(
          className,
          type === "header" && "size-9 text-sm",
          type === "profile" &&
            "border-border-chip bg-surface-container-high size-24 rounded-sm border text-3xl shadow-md after:rounded-md sm:size-28 sm:text-4xl",
          type === "describe" && "size-12 text-lg",
          type === "comment" && "size-10 text-sm sm:size-11 sm:text-base",
        )}
      >
        <AvatarImage
          src={avatarUrl}
          alt="avatar"
          className={cn(
            "aspect-square object-cover",
            type === "profile" ? "rounded-md" : "rounded-sm",
          )}
        />
        <AvatarFallback
          className={cn(
            `${bgColor} text-foreground rounded-sm font-semibold`,
            type === "profile" && "text-3xl sm:text-4xl",
            type === "describe" && "text-lg",
            type === "comment" && "text-sm sm:text-base",
          )}
        >
          {getAvatarInitials(name)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

export default UserAvatar;
