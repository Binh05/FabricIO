export interface CommentAuthor {
  id: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
}

export interface Comment {
  id: string;
  parentId: string | null;
  replyToCommentId: string | null;
  author: CommentAuthor;
  content: string;
  likeCount: number;
  replyCount: number;
  updatedAt: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  content: string;
}

export interface CreateReplyRequest {
  content: string;
  parent_id: string;
}

export interface DeleteReplyResult {
  parentId: string;
  replyCount: number;
}
