// אילו קבצים אפשר להעלות. בלי SVG (יכול להכיל קוד).
export const ACCEPTED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

// Supabase בחבילה החינמית מגביל קובץ ל-50MB
export const MAX_BYTES = { image: 15 * 1024 * 1024, video: 50 * 1024 * 1024 };

export const ACCEPT_ATTR = Object.keys(ACCEPTED).join(",");
