import { Camera } from "lucide-react";
import { Button } from "../ui/button";
import { useRef } from "react";
// import { useAuth } from "@/hooks/useAuth";

const AvatarUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
//   const { uploadAvatar } = useAuth();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    // await uploadAvatar(formData);
  };

  return (
    <>
      <Button
        className="absolute -right-1 -bottom-1 rounded-full bg-secondary p-0 cursor-pointer"
        variant="secondary"
        size="icon"
        onClick={handleClick}
      >
        <Camera className="text-muted size-5 stroke-2" />
      </Button>
      <input
        type="file"
        hidden
        ref={fileInputRef}
        onChange={handleAvatarUpload}
      />
    </>
  );
};

export default AvatarUpload;
