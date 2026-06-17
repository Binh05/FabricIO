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
  const bgColor = !avatarUrl ? "bg-gray-500" : "";

  return (
    <Avatar
      className={cn(
        className,
        type === "header" && "size-8 text-sm",
        type === "profile" && "size-24 text-4xl shadow-md",
      )}
    >
      <AvatarImage src={avatarUrl} alt="avatar" className="rounded-full" />
      <AvatarFallback
        className={cn(
          `${bgColor} font-semibold text-white`,
          type === "profile" && "text-4xl",
        )}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
