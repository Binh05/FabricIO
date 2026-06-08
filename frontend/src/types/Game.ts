export interface Game {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  gameUrl: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  media: GameMedia[];
  tags: GameTag[];
}

export interface GameMedia {
  id: string;
  mediaUrl: string;
  mediaType: string;
  sortOrder: number;
}

export interface GameTag {
  id: string;
  name: string;
  slug: string;
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
