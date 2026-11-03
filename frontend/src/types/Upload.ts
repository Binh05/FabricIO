export type UploadPurpose =
  | "USER_AVATAR"
  | "GAME_THUMBNAIL"
  | "GAME_VIDEO"
  | "GAME_SOURCE";

export interface PresignCommand {
  objectId: string;
  purpose: UploadPurpose;
  contentType: string;
  size: number;
}

export interface PresignedUpload {
  url: string;
  method: string;
  headers: Record<string, string>;
  expiresAt: string;
}

export interface PresignResult {
  key: string;
  presignedUpload: PresignedUpload;
}

export interface CompleteCommand {
  objectId: string;
  key: string;
  purpose: UploadPurpose;
}

export interface CompleteResult {
  url: string;
}

