import { useAuth } from "@/hooks/useAuth";
import SubmitGameForm from "@/components/games/SubmitGameForm";
import { useGame } from "@/hooks/useGame";
import { useEffect } from "react";
import SubmitGamePageSkeleton from "@/components/skeletons/SubmitGamePageSkeleton";

export const SubmitGame = () => {
  const { user } = useAuth();
  const { tags, fetchGameTags } = useGame();

  useEffect(() => {
    if (tags.length < 1) {
      fetchGameTags();
    }
  }, []);

  if (!user) return <SubmitGamePageSkeleton />;

  return (
    <section className="mb-16">
      <div className="mb-8">
        <span className="text-primary mb-2 block text-[13px] font-bold tracking-[2px] uppercase">
          Creator Upload
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Đăng game mới lên cửa hàng
        </h1>
        <p className="text-muted mt-2">
          Tải build cho Windows, Android hoặc WebGL, thêm ảnh đại diện, ảnh show
          game và giá bán.
        </p>
      </div>

      <SubmitGameForm />
    </section>
  );
};
