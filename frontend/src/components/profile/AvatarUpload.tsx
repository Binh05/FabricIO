import { Camera, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useRef } from "react";
import { useUser } from "@/hooks/useUser";
import { UPLOAD_LIMITS } from "@/lib/uploadUtils";

const AvatarUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadAvatar, isUploadingAvatar } = useUser();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      await uploadAvatar(file);
    } catch {
      // error handled in useUser
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <Button
        className="absolute -right-1 -bottom-1 rounded-full bg-secondary p-0 cursor-pointer disabled:cursor-not-allowed"
        variant="secondary"
        size="icon"
        onClick={handleClick}
        disabled={isUploadingAvatar}
        title="Đổi ảnh đại diện"
        type="button"
      >
        {isUploadingAvatar ? (
          <Loader2 className="text-muted size-5 stroke-2 animate-spin" />
        ) : (
          <Camera className="text-muted size-5 stroke-2" />
        )}
      </Button>
      <input
        type="file"
        hidden
        ref={fileInputRef}
        accept={UPLOAD_LIMITS.USER_AVATAR.accept}
        onChange={handleAvatarUpload}
      />
    </>
  );
};

export default AvatarUpload;
