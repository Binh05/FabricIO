import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn } from "@/lib/utils";

interface IUserAvatarProps {
  type: "header" | "profile";
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
          type === "profile" && "size-24 text-4xl shadow-md",
        )}
      >
        <AvatarImage src={avatarUrl} alt="avatar" className="rounded-full object-cover aspect-square" />
        <AvatarFallback
          className={cn(
            `${bgColor} font-semibold text-foreground`,
            type === "profile" && "text-4xl",
          )}
        >
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {type === "header" && (
        <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-cyan ring-2 ring-surface" />
      )}
    </div>
  );
}

export default UserAvatar;
