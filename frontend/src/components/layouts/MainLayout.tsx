import Header from "@/components/layouts/Header";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import { useEffect } from "react";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { fetchGameTags, tags } = useGame();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!tags.length) {
      fetchGameTags();
    }
  }, []);

  if (loading) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />
      <div className="mx-auto flex w-full max-w-400 flex-1 flex-col gap-10 p-6 lg:flex-row">
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
};
