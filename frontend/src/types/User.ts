export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserUpdateRequest {
  fullName: string;
  bio: string;
}

export interface FetchUserResult {
  id: string;
  fullName: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
}
