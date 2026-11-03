import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getYearFromISOString(rawDate: string) {
  const date = new Date(rawDate);
  return date.getUTCFullYear();
}