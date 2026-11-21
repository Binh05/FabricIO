export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio: string | null;
  avatarUrl: string | null;
  role: "User" | "Admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface UserUpdateRequest {
  fullName: string;
  bio: string;
}

export interface FetchUserResult {
  id: string;
  username: string;
  fullName: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
}
