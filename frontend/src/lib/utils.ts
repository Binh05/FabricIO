import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getYearFromISOString(rawDate: string) {
  const date = new Date(rawDate);
  return date.getUTCFullYear();
}

export function slugifyGameTitle(title: string): string {
  const slug = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/\u0111/g, "d");

  return (
    slug
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80)
      .replace(/-+$/g, "") || "game"
  );
}

export function getGameIdFromPlayParam(playParam: string) {
  const separatorIndex = playParam.lastIndexOf("~");
  return separatorIndex === -1 ? playParam : playParam.slice(separatorIndex + 1);
}

export function createGamePlayUrl(game: { id: string; title: string }) {
  return `/games/${slugifyGameTitle(game.title)}~${encodeURIComponent(game.id)}`;
}