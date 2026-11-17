import { useState } from "react";
import { Check, LockKeyhole, ShieldCheck } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import type { User, UserUpdateRequest } from "@/types/User";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProfileEditFormProps {
  user: User;
}

const ProfileEditForm = ({ user }: ProfileEditFormProps) => {
  const { updateProfile, isUpdatingProfile } = useUser();
  const [profileForm, setProfileForm] = useState<UserUpdateRequest>({
    fullName: user.fullName,
    bio: user.bio ?? "",
  });

  const resetForm = () => {
    setProfileForm({
      fullName: user.fullName,
      bio: user.bio ?? "",
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await updateProfile(profileForm);
    } catch {
      // The hook displays the API error.
    }
  };

  return (
    <Card
      id="edit-profile-form"
      className="scroll-mt-6 border-border-subtle bg-surface-container-low rounded-sm p-6 sm:p-8"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-8 flex items-start gap-4">
          <div>
            <h2 className="text-xl font-bold">Chỉnh sửa hồ sơ cá nhân</h2>
            <p className="text-muted mt-1 text-sm">
              Quản lý thông tin định danh hiển thị trên nền tảng FabricIO Indie
              Engine
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="profile-username"
              className="mb-2 block text-sm font-semibold"
            >
              Username (Tên người dùng)
            </label>
            <div className="relative">
              <input
                id="profile-username"
                value={`@${user.username}`}
                disabled
                className="border-border text-muted placeholder:text-muted-foreground bg-surface-container-lowest w-full rounded-md border px-4 py-2.5 pr-11 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-70"
              />
              <LockKeyhole className="text-muted absolute top-1/2 right-4 size-4 -translate-y-1/2" />
            </div>
            <p className="text-muted mt-2 text-xs">
              Được bảo lưu vì là định danh của tài khoản.
            </p>
          </div>

          <div>
            <label
              htmlFor="profile-email"
              className="mb-2 block text-sm font-semibold"
            >
              Địa chỉ Email
            </label>
            <div className="relative">
              <input
                id="profile-email"
                value={user.email}
                disabled
                className="border-border text-muted placeholder:text-muted-foreground bg-surface-container-lowest w-full rounded-md border px-4 py-2.5 pr-11 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-70"
              />
              <ShieldCheck className="text-muted absolute top-1/2 right-4 size-4 -translate-y-1/2" />
            </div>
            <p className="text-muted mt-2 text-xs">
              Email được bảo vệ bởi hệ thống xác thực tài khoản.
            </p>
          </div>

          <div>
            <label
              htmlFor="profile-full-name"
              className="mb-2 block text-sm font-semibold"
            >
              Tên hiển thị <span className="text-primary">*</span>
            </label>
            <input
              id="profile-full-name"
              value={profileForm.fullName}
              onChange={(event) =>
                setProfileForm((current) => ({
                  ...current,
                  fullName: event.target.value,
                }))
              }
              disabled={isUpdatingProfile}
              required
              className="border-border placeholder:text-muted-foreground focus:border-primary bg-surface-container-lowest text-foreground w-full rounded-md border px-4 py-2.5 text-sm outline-none"
            />
            <p className="text-muted mt-2 text-xs">
              Tên này sẽ xuất hiện trên trang tác giả trò chơi và bảng xếp hạng.
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-4">
              <label htmlFor="profile-bio" className="text-sm font-semibold">
                Tiểu sử &amp; Thông tin nhà phát triển
              </label>
              <span className="text-muted text-xs">
                {profileForm.bio.length}/300 ký tự
              </span>
            </div>
            <textarea
              id="profile-bio"
              value={profileForm.bio}
              onChange={(event) =>
                setProfileForm((current) => ({
                  ...current,
                  bio: event.target.value,
                }))
              }
              disabled={isUpdatingProfile}
              maxLength={300}
              rows={3}
              className="border-border placeholder:text-muted-foreground focus:border-primary bg-surface-container-lowest text-foreground w-full resize-none rounded-md border px-4 py-2.5 text-sm outline-none"
            />
            <p className="text-muted mt-2 text-xs">
              Mô tả ngắn gọn về niềm đam mê lập trình game WebGL indie.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isUpdatingProfile}
            onClick={resetForm}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            variant="gradient"
            disabled={isUpdatingProfile}
            className="hover:bg-primary-glow shadow-primary-glow/50 bg-primary/80 shadow-md"
          >
            <Check className="size-4" />
            {isUpdatingProfile ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileEditForm;
