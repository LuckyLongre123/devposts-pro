/**
 * Thumbnail Constants
 * Default thumbnail path and related constants
 */

// Using default thumbnail from public folder
export const DEFAULT_THUMBNAIL = "/default-thumbnail.png";

/**
 * Thumbnail dimensions (Open Graph standard)
 */
export const THUMBNAIL_DIMENSIONS = {
  width: 1200,
  height: 630,
  aspect: "16/9",
} as const;

/**
 * Thumbnail aspect ratio class for Tailwind
 */
export const THUMBNAIL_ASPECT_CLASS = "aspect-video";
