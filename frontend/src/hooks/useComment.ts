import { CommentContext, type CommentPage } from "@/context/CommentContext";
import { commentService } from "@/services/commentService";
import type { Comment } from "@/types/Comment";
import axios from "axios";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
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
  deleteComment: (commentId: string) => Promise<void>;
  deleteReply: (replyId: string, parentId: string) => Promise<void>;
  toggleLike: (commentId: string) => void;
  togglingLikes: Record<string, boolean>;
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
  const likeTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const optimisticLikesRef = useRef<Record<string, boolean>>({});
  const serverLikesRef = useRef<Record<string, boolean>>({});
  const inFlightLikesRef = useRef(new Set<string>());
  const [togglingLikes, setTogglingLikes] = useState<Record<string, boolean>>({});
  useEffect(() => {
    commentsRef.current = commentsByGame;
    repliesRef.current = repliesByComment;
  }, [commentsByGame, repliesByComment]);

  useEffect(() => {
    return () => {
      Object.values(likeTimersRef.current).forEach((timer) => clearTimeout(timer));
    };
  }, []);

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

  const deleteComment = useCallback(async (commentId: string) => {
    try {
      await commentService.deleteComment(commentId);
      setCommentsByGame((previous) =>
        Object.fromEntries(
          Object.entries(previous).map(([gameId, page]) => [
            gameId,
            {
              ...page,
              items: page.items.filter((item) => item.id !== commentId),
            },
          ]),
        ),
      );
      setRepliesByComment((previous) => {
        const next = { ...previous };
        delete next[commentId];
        return next;
      });
      toast.success("Đã xóa bình luận.");
    } catch (error) {
      console.error("Lỗi khi xóa bình luận", error);
      toast.error(getErrorMessage(error, "Không thể xóa bình luận."));
      throw error;
    }
  }, [setCommentsByGame, setRepliesByComment]);

  const deleteReply = useCallback(async (replyId: string, parentId: string) => {
    try {
      const response = await commentService.deleteReply(replyId);
      setRepliesByComment((previous) => {
        const page = previous[parentId];
        if (!page) return previous;
        return {
          ...previous,
          [parentId]: {
            ...page,
            items: page.items.filter((item) => item.id !== replyId),
          },
        };
      });
      const updatedParentId = response.data?.parentId ?? parentId;
      const replyCount = response.data?.replyCount;
      setCommentsByGame((previous) =>
        Object.fromEntries(
          Object.entries(previous).map(([gameId, page]) => [
            gameId,
            {
              ...page,
              items: page.items.map((item) =>
                item.id === updatedParentId
                  ? {
                      ...item,
                      replyCount:
                        replyCount ?? Math.max(0, item.replyCount - 1),
                    }
                  : item,
              ),
            },
          ]),
        ),
      );
      toast.success("Đã xóa phản hồi.");
    } catch (error) {
      console.error("Lỗi khi xóa phản hồi", error);
      toast.error(getErrorMessage(error, "Không thể xóa phản hồi."));
      throw error;
    }
  }, [setCommentsByGame, setRepliesByComment]);

  const scheduleLikeRequest = useCallback((commentId: string) => {
    if (likeTimersRef.current[commentId]) {
      clearTimeout(likeTimersRef.current[commentId]);
    }
    likeTimersRef.current[commentId] = setTimeout(() => {
      delete likeTimersRef.current[commentId];

      if (inFlightLikesRef.current.has(commentId)) {
        scheduleLikeRequest(commentId);
        return;
      }

      const targetLiked = optimisticLikesRef.current[commentId];
      const serverLiked = serverLikesRef.current[commentId];
      if (targetLiked === undefined || targetLiked === serverLiked) {
        delete optimisticLikesRef.current[commentId];
        return;
      }

      inFlightLikesRef.current.add(commentId);
      setTogglingLikes((previous) => ({ ...previous, [commentId]: true }));

      void commentService.setLike(commentId, { liked: targetLiked })
        .then((response) => {
          serverLikesRef.current[commentId] = response.data.liked;

          const latestTarget = optimisticLikesRef.current[commentId];
          const applyServerResult = (previous: Record<string, CommentPage>) =>
            Object.fromEntries(
              Object.entries(previous).map(([key, page]) => [
                key,
                {
                  ...page,
                  items: page.items.map((item) => {
                    if (item.id !== commentId) return item;
                    const likedByMe =
                      latestTarget === undefined
                        ? response.data.liked
                        : latestTarget;
                    return {
                      ...item,
                      likedByMe,
                      likeCount:
                        likedByMe === response.data.liked
                          ? response.data.likeCount
                          : Math.max(
                              0,
                              response.data.likeCount +
                                (likedByMe ? 1 : -1),
                            ),
                    };
                  }),
                },
              ]),
            );

          setCommentsByGame(applyServerResult);
          setRepliesByComment(applyServerResult);

          if (latestTarget === response.data.liked) {
            delete optimisticLikesRef.current[commentId];
          } else {
            scheduleLikeRequest(commentId);
          }
        })
        .catch((error) => {
          const serverLiked = serverLikesRef.current[commentId] ?? false;
          const applyRollback = (previous: Record<string, CommentPage>) =>
            Object.fromEntries(
              Object.entries(previous).map(([key, page]) => [
                key,
                {
                  ...page,
                  items: page.items.map((item) =>
                    item.id === commentId
                      ? {
                          ...item,
                          likedByMe: serverLiked,
                          likeCount: Math.max(
                            0,
                            item.likeCount +
                              (serverLiked === item.likedByMe
                                ? 0
                                : serverLiked
                                  ? 1
                                  : -1),
                          ),
                        }
                      : item,
                  ),
                },
              ]),
            );
          setCommentsByGame(applyRollback);
          setRepliesByComment(applyRollback);
          delete optimisticLikesRef.current[commentId];
          console.error("Lỗi khi thích bình luận", error);
          toast.error(getErrorMessage(error, "Không thể thích bình luận."));
        })
        .finally(() => {
          inFlightLikesRef.current.delete(commentId);
          setTogglingLikes((previous) => ({ ...previous, [commentId]: false }));
        });
    }, 1000);
  }, [setCommentsByGame, setRepliesByComment]);

  const toggleLike = useCallback((commentId: string) => {
    let currentLiked: boolean | undefined =
      optimisticLikesRef.current[commentId];

    if (currentLiked === undefined) {
      const currentComment =
        commentsRef.current &&
        Object.values(commentsRef.current)
          .flatMap((page) => page.items)
          .find((item) => item.id === commentId);
      const currentReply =
        repliesRef.current &&
        Object.values(repliesRef.current)
          .flatMap((page) => page.items)
          .find((item) => item.id === commentId);
      currentLiked = (currentComment ?? currentReply)?.likedByMe;
      if (currentLiked !== undefined) {
        serverLikesRef.current[commentId] = currentLiked;
      }
    }

    if (currentLiked === undefined) return;
    const targetLiked = !currentLiked;
    optimisticLikesRef.current[commentId] = targetLiked;

    const applyOptimisticLike = (
      previous: Record<string, CommentPage>,
    ) => Object.fromEntries(
      Object.entries(previous).map(([key, page]) => [
        key,
        {
          ...page,
          items: page.items.map((item) =>
            item.id === commentId && item.likedByMe !== targetLiked
              ? {
                  ...item,
                  likedByMe: targetLiked,
                  likeCount: Math.max(
                    0,
                    item.likeCount + (targetLiked ? 1 : -1),
                  ),
                }
              : item,
          ),
        },
      ]),
    );

    setCommentsByGame(applyOptimisticLike);
    setRepliesByComment(applyOptimisticLike);
    scheduleLikeRequest(commentId);
  }, [scheduleLikeRequest, setCommentsByGame, setRepliesByComment]);

  return {
    commentsByGame,
    repliesByComment,
    loading,
    loadingReplies,
    fetchComments,
    fetchReplies,
    createComment,
    createReply,
    deleteComment,
    deleteReply,
    toggleLike,
    togglingLikes,
  };
};
