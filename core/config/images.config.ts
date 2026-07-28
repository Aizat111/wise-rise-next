// Centralized image configuration for S3 + Imgix integration
// - IMGIX serves your S3 bucket as a Source. Keep paths relative to the bucket root.
// - All defaults and naming live here for easy discovery and maintenance.

export const IMGIX_BASE_URL = process.env.NEXT_PUBLIC_IMGIX_BASE_URL?.replace(/\/+$/, '') || 'https://static.toshi.bet';

// Reasonable defaults; override per-usage via imgixParams
export const DEFAULT_IMGIX_PARAMS: Record<string, string | number> = {
  fit: 'max' // preserve aspect while constraining by w/h
};

// Responsive width breakpoints for srcset generation (width descriptor)
export const RESPONSIVE_WIDTHS: number[] = [320, 480, 640, 768, 960, 1200, 1440, 1600, 1920, 2560];

// Generic sizes you can reuse; override at call sites
export const DEFAULT_SIZES = '';
