import { CommentContext, type CommentPage } from "@/context/CommentContext";
import { commentService } from "@/services/commentService";
import type { Comment } from "@/types/Comment";
import axios from "axios";
import { useCallback, useContext, useEffect, useRef } from "react";
import { toast } from "sonner";

export interface UseComment {
  commentsByGame: Record<string, CommentPage>;
  repliesByComment: Record<string, CommentPage>;
  loading: boolean;
  loadingReplies: Record<string, boolean>;
  fetchComments: (gameId: string, reset?: boolean) => Promise<void>;
  fetchReplies: (commentId: string, reset?: boolean) => Promise<void>;
  createComment: (gameId: string, content: string) => Promise<Comment>;
  createReply: (
    commentId: string,
    parentId: string,
    content: string,
  ) => Promise<Comment>;
}

export const useComment = (): UseComment => {
  const context = useContext(CommentContext);
  if (!context) throw new Error("useComment phải được sử dụng bên trong CommentProvider");

  const {
    commentsByGame,
    repliesByComment,
    setCommentsByGame,
    setRepliesByComment,
    loading,
    setLoading,
    loadingReplies,
    setLoadingReplies,
  } = context;
  const commentsRef = useRef(commentsByGame);
  const repliesRef = useRef(repliesByComment);
  useEffect(() => {
    commentsRef.current = commentsByGame;
    repliesRef.current = repliesByComment;
  }, [commentsByGame, repliesByComment]);

  const getErrorMessage = (error: unknown, fallback: string) =>
    axios.isAxiosError(error) ? error.response?.data?.message ?? fallback : fallback;

  const fetchComments = useCallback(async (gameId: string, reset = false) => {
    const current = commentsRef.current[gameId];
    if (!reset && current && !current.hasMore) return;
    setLoading(true);
    try {
      const response = await commentService.getComments(gameId, reset ? null : current?.cursor);
      setCommentsByGame((previous) => ({
        ...previous,
        [gameId]: {
          items: reset || !current ? response.data.content : [...current.items, ...response.data.content],
          cursor: response.data.cursor,
          hasMore: response.data.hasMore,
        },
      }));
    } catch (error) {
      console.error("Lỗi khi tải bình luận", error);
      toast.error(getErrorMessage(error, "Không thể tải bình luận."));
    } finally {
      setLoading(false);
    }
  }, [setCommentsByGame, setLoading]);

  const fetchReplies = useCallback(async (commentId: string, reset = false) => {
    const current = repliesRef.current[commentId];
    if (!reset && current && !current.hasMore) return;
    setLoadingReplies((previous) => ({ ...previous, [commentId]: true }));
    try {
      const response = await commentService.getReplies(commentId, reset ? null : current?.cursor);
      setRepliesByComment((previous) => ({
        ...previous,
        [commentId]: {
          items: reset || !current ? response.data.content : [...current.items, ...response.data.content],
          cursor: response.data.cursor,
          hasMore: response.data.hasMore,
        },
      }));
    } catch (error) {
      console.error("Lỗi khi tải phản hồi", error);
      toast.error(getErrorMessage(error, "Không thể tải phản hồi."));
    } finally {
      setLoadingReplies((previous) => ({ ...previous, [commentId]: false }));
    }
  }, [setLoadingReplies, setRepliesByComment]);

  const createComment = useCallback(async (gameId: string, content: string) => {
    try {
      const response = await commentService.createComment(gameId, { content });
      setCommentsByGame((previous) => {
        const page = previous[gameId];
        return {
          ...previous,
          [gameId]: page
            ? { ...page, items: [response.data, ...page.items] }
            : { items: [response.data], cursor: null, hasMore: false },
        };
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo bình luận", error);
      toast.error(getErrorMessage(error, "Không thể đăng bình luận."));
      throw error;
    }
  }, [setCommentsByGame]);

  const createReply = useCallback(async (
    commentId: string,
    parentId: string,
    content: string,
  ) => {
    try {
      const response = await commentService.createReply(commentId, {
        content,
        parent_id: parentId,
      });
      setRepliesByComment((previous) => {
        const page = previous[parentId];
        return {
          ...previous,
          [parentId]: page
            ? { ...page, items: [...page.items, response.data] }
            : { items: [response.data], cursor: null, hasMore: false },
        };
      });
      setCommentsByGame((previous) => {
        const next = Object.fromEntries(Object.entries(previous).map(([gameId, page]) => [gameId, {
            ...page,
            items: page.items.map((item) =>
              item.id === parentId ? { ...item, replyCount: item.replyCount + 1 } : item,
            ),
          }]));
        return next;
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo phản hồi", error);
      toast.error(getErrorMessage(error, "Không thể đăng phản hồi."));
      throw error;
    }
  }, [setCommentsByGame, setRepliesByComment]);

  return {
    commentsByGame,
    repliesByComment,
    loading,
    loadingReplies,
    fetchComments,
    fetchReplies,
    createComment,
    createReply,
  };
};
