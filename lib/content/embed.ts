// קישור רגיל מ-YouTube / Vimeo → כתובת embed. מחזיר null אם הקישור לא מוכר.

export function toEmbed(url: string): { src: string; thumb?: string } | null {
  const u = url.trim();
  const yt =
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([\w-]{11})/.exec(u) ??
    /[?&#,](?:v|vid)[=:]([\w-]{11})/.exec(u);
  if (yt) return { src: `https://www.youtube-nocookie.com/embed/${yt[1]}`, thumb: `https://i.ytimg.com/vi/${yt[1]}/hqdefault.jpg` };
  const vimeo = /vimeo\.com\/(?:video\/)?(\d+)/.exec(u);
  if (vimeo) return { src: `https://player.vimeo.com/video/${vimeo[1]}` };
  return null;
}

/** תמונה מקדימה לסרטון embed (ל-YouTube בלבד) */
export function embedThumb(src: string): string | undefined {
  const id = /embed\/([\w-]{11})/.exec(src)?.[1];
  return id && src.includes("youtube") ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : undefined;
}
