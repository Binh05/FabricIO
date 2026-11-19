import { api } from "@/lib/api";
import type { ApiResponse, CursorResponse } from "@/types/BaseResponse";
import type {
  Comment,
  CreateCommentRequest,
  CreateReplyRequest,
} from "@/types/Comment";

const ROOT_COMMENT_SIZE = 4;
const REPLY_SIZE = 3;

export class commentService {
  static async getComments(
    gameId: string,
    cursor?: string | null,
  ): Promise<ApiResponse<CursorResponse<Comment>>> {
    const res = await api.get(`/games/${gameId}/comments`, {
      params: { size: ROOT_COMMENT_SIZE, cursor: cursor ?? undefined },
    });
    return res.data;
  }

  static async getReplies(
    commentId: string,
    cursor?: string | null,
  ): Promise<ApiResponse<CursorResponse<Comment>>> {
    const res = await api.get(`/comments/${commentId}/replies`, {
      params: { size: REPLY_SIZE, cursor: cursor ?? undefined },
    });
    return res.data;
  }

  static async createComment(
    gameId: string,
    request: CreateCommentRequest,
  ): Promise<ApiResponse<Comment>> {
    const res = await api.post(`/games/${gameId}/comments`, request);
    return res.data;
  }

  static async createReply(
    commentId: string,
    request: CreateReplyRequest,
  ): Promise<ApiResponse<Comment>> {
    const res = await api.post(`/comments/${commentId}/replies`, request);
    return res.data;
  }
}
