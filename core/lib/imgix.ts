import {
  DEFAULT_IMGIX_PARAMS,
  IMGIX_BASE_URL,
  RESPONSIVE_WIDTHS,
} from "@/core/config/images.config";
import { IMAGE_MANIFEST } from "@/data/imageManifest";

export type ImgixParams = Record<string, string | number | undefined>;

export const isImgixEnabled = (): boolean => {
  return Boolean(IMGIX_BASE_URL && IMGIX_BASE_URL.startsWith("http"));
};

export const normalizePath = (path?: string): string => {
  if (!path) return "";
  return path.replace(/^\/+/, "");
};

export const buildImgixUrl = (path: string, params?: ImgixParams): string => {
  const finalPath = normalizePath(path);
  const url = new URL(`${IMGIX_BASE_URL}/${finalPath}`);
  const merged: Record<string, string | number> = { ...DEFAULT_IMGIX_PARAMS };
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null)
        merged[key] = value as string | number;
    });
  }
  // Clear existing params and set merged params to avoid duplicates
  url.search = "";
  Object.entries(merged).forEach(([key, value]) =>
    url.searchParams.set(key, String(value)),
  );
  return url.toString();
};

export const buildWidthSrcSet = (
  path: string,
  params?: ImgixParams,
  widths: number[] = RESPONSIVE_WIDTHS,
): string => {
  // Extract 'w' from params to use as first width in srcset
  const { w: requestedWidth, ...paramsWithoutW } = params || {};

  // Build width array: requested width first (if exists), then other widths excluding duplicates
  const widthSet = new Set<number>();
  const finalWidths: number[] = [];

  // Add requested width first if it exists
  if (requestedWidth !== undefined && requestedWidth !== null) {
    const requestedNum = Number(requestedWidth);
    if (!isNaN(requestedNum) && requestedNum > 0) {
      finalWidths.push(requestedNum);
      widthSet.add(requestedNum);
    }
  }

  // Add other widths, excluding the requested width to avoid duplicates
  widths.forEach((w) => {
    if (!widthSet.has(w)) {
      finalWidths.push(w);
      widthSet.add(w);
    }
  });

  return finalWidths
    .map((w) => {
      const u = buildImgixUrl(path, { ...paramsWithoutW, w });
      return `${u} ${w}w`;
    })
    .join(", ");
};

export type ImageKey = keyof typeof IMAGE_MANIFEST;

export const resolveImagePath = (key: ImageKey): string => {
  return normalizePath(IMAGE_MANIFEST[key]);
};

/** Use external CDN URLs as-is; relative/static paths go through Imgix. */
export const resolveGameImageUrl = (
  image?: string,
  params?: ImgixParams,
): string => {
  if (!image) return "";

  const trimmed = image.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return buildImgixUrl(trimmed, params);
};
