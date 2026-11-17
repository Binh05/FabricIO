import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn } from "@/lib/utils";

interface IUserAvatarProps {
  type: "header" | "profile" | "describe";
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
  const bgColor = !avatarUrl ? "bg-muted-foreground/30" : "";

  return (
    <div className="relative inline-flex">
      <Avatar
        className={cn(
          className,
          type === "header" && "size-8 text-sm",
          type === "profile" &&
            "size-24 sm:size-28 text-3xl sm:text-4xl shadow-md rounded-md after:rounded-md border border-border-chip bg-surface-container-high",
          type === "describe" && "size-12 text-lg",
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
            `${bgColor} text-foreground font-semibold`,
            type === "profile" && "rounded-md text-3xl sm:text-4xl",
            type === "describe" && "text-lg",
          )}
        >
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {type === "header" && (
        <span className="bg-cyan ring-surface absolute right-0 bottom-0 size-2.5 rounded-full ring-2" />
      )}
    </div>
  );
}

export default UserAvatar;
