import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const CARD_IMAGE_WIDTHS = [128, 256];
const CARD_IMAGE_QUALITY = 75;

export function prefetchCardImages(imageUrls: string[]): void {
  if (typeof window === 'undefined') return;

  for (const url of new Set(imageUrls)) {
    for (const width of CARD_IMAGE_WIDTHS) {
      const img = new window.Image();
      img.src = `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=${CARD_IMAGE_QUALITY}`;
    }
  }
}
