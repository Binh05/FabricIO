export interface Game {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  gameUrl: string;
  price: number;
  tags: GameTag[];
  avgRating: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
  author?: GameAuthor | null;
}

export interface GameAuthor {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string | null;
}

export interface GameTag {
  id: string;
  name: string;
}

export interface PostGameRequest {
  title: string;
  description: string | null;
  price: number;
  tagIds: string[] | null;
}

export interface GamePlayResponse {
  gamePlayUrl: string;
}
