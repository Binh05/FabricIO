import Header from "@/components/layouts/Header";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import { useEffect } from "react";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { fetchGameTags, tags } = useGame();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!tags.length) {
      void fetchGameTags();
    }
  }, [fetchGameTags, tags.length]);

  if (loading) return null;

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      {/* Ambient glow orb — top, slightly left of center, behind everything */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-45 left-[40%] z-0 -translate-x-8/12"
      >
        <div className="bg-primary/15 size-130 rounded-full opacity-60 blur-[120px]" />
        <div className="bg-primary/20 absolute inset-50 rounded-full blur-[60px]" />
      </div>

      <Header user={user} />
      <div className="relative z-10 mx-auto flex w-full max-w-400 flex-1 flex-col p-3 lg:flex-row">
        <main className="mx-auto min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
};
