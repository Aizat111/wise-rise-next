import { COURSE_MEDIA_CDN } from "../constants";

/**
 * Resolve API media paths to absolute URLs.
 * Absolute http(s) paths are returned as-is; relative paths use the media CDN.
 */
export function resolveMediaUrl(
  path: string | null | undefined,
): string | null {
  if (!path) return null;
  const trimmed = path.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `${COURSE_MEDIA_CDN}/${trimmed.replace(/^\//, "")}`;
}

/** Progressive files play natively; everything else (e.g. `.m3u8`) goes through HLS. */
export function isProgressiveMediaUrl(src: string): boolean {
  try {
    const pathname = new URL(src, "https://local.invalid").pathname;
    return /\.(mp4|webm|ogg|mov)$/i.test(pathname);
  } catch {
    return /\.(mp4|webm|ogg|mov)(\?|#|$)/i.test(src);
  }
}

/** Prefer progressive MP4 for broad browser support; fall back to HLS teaser. */
export function resolveTrailerUrl(input: {
  teaser?: string | null;
  rawTeaserPath?: string | null;
}): string | null {
  const fromRaw = resolveMediaUrl(input.rawTeaserPath);
  if (fromRaw) return fromRaw;

  const teaser = input.teaser?.trim();
  if (!teaser) return null;
  return teaser;
}

export function resolveVideoPlaybackUrl(input: {
  streamUrl?: string | null;
  downloadUrl?: string | null;
  rawFilePath?: string | null;
  podcastFile?: string | null;
}): string | null {
  return (
    resolveMediaUrl(input.streamUrl) ??
    resolveMediaUrl(input.downloadUrl) ??
    resolveMediaUrl(input.rawFilePath) ??
    resolveMediaUrl(input.podcastFile)
  );
}
