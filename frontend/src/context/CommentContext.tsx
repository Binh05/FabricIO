import type { Comment } from "@/types/Comment";
import { createContext, useState } from "react";

export interface CommentPage {
  items: Comment[];
  cursor: string | null;
  hasMore: boolean;
}

export interface CommentContextType {
  commentsByGame: Record<string, CommentPage>;
  repliesByComment: Record<string, CommentPage>;
  setCommentsByGame: React.Dispatch<React.SetStateAction<Record<string, CommentPage>>>;
  setRepliesByComment: React.Dispatch<React.SetStateAction<Record<string, CommentPage>>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loadingReplies: Record<string, boolean>;
  setLoadingReplies: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const CommentContext = createContext<CommentContextType | null>(null);

export const CommentProvider = ({ children }: { children: React.ReactNode }) => {
  const [commentsByGame, setCommentsByGame] = useState<Record<string, CommentPage>>({});
  const [repliesByComment, setRepliesByComment] = useState<Record<string, CommentPage>>({});
  const [loading, setLoading] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({});

  return (
    <CommentContext.Provider
      value={{
        commentsByGame,
        repliesByComment,
        setCommentsByGame,
        setRepliesByComment,
        loading,
        setLoading,
        loadingReplies,
        setLoadingReplies,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};
