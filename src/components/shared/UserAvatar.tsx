import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface IUserAvatarProps {
  className?: string;
  type: "sidebar";
  username: string;
  avatarUrl: string;
}

function UserAvatar({
  className,
  type,
  username = "FabricIO",
  avatarUrl,
}: IUserAvatarProps) {
  const bgColor = !avatarUrl ? "bg-blue-500" : "";
  return (
    <Avatar className={cn(className, type === "sidebar" && "size-8 text-base")}>
      <AvatarImage src={avatarUrl} alt="user avatar" />
      <AvatarFallback className={`${bgColor} font-semibold text-white`}>
        {username.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
