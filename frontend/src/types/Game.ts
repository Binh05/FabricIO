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
  createdAt: string;
  updatedAt: string;
}

export interface GameTag {
  id: string;
  name: string;
}

export interface PostGameRequest {
  title: string;
  description: string | null;
  price: number;
  sourceGame: File;
  thumbnail: File;
  media: File[] | null;
  tagIds: string[] | null;
}

export interface GamePlayResponse {
  gamePlayUrl: string;
}
