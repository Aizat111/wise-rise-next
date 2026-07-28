'use client';

import NextImage from 'next/image';
import type { FC } from 'react';

import { DEFAULT_SIZES } from '@/core/config/images.config';
import { ImageKey as ManifestImageKey, buildImgixUrl, resolveImagePath } from '@/core/lib/imgix';

interface ImageProps extends React.ComponentPropsWithoutRef<typeof NextImage> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'eager' | 'lazy';
  className?: string;
  // Optional: resolve asset path via manifest key instead of raw src
  assetKey?: ManifestImageKey;
  // Optional: extra imgix params (e.g., { ar: '16:9', fit: 'crop', crop: 'faces' })
  imgixParams?: Record<string, string | number | undefined>;
  // Sizes hint; has a sensible default
  sizes?: string;
  priority?: boolean;
  onError?: React.ReactEventHandler<HTMLImageElement>;
}

const Image: FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  className,
  assetKey,
  imgixParams,
  sizes = DEFAULT_SIZES,
  priority = false,
  onError,
  ...props
}) => {
  // Resolve path from manifest when provided
  const resolvedPath = (assetKey ? resolveImagePath(assetKey) : src)?.trim();

  const loader = ({ src: raw, width: w, quality }: { src: string; width: number; quality?: number }) => {
    // Next may request larger widths for DPR (e.g. 2x). If the caller provided an explicit `width`,
    // clamp the requested width so `src`/`srcset` don't jump to much larger sizes.
    const clampedW = typeof width === 'number' && width > 0 ? Math.min(w, width) : w;

    // If Imgix is enabled and we're using a manifest key or a relative path, build full Imgix URL
    const isRelative = !/^https?:\/\//i.test(resolvedPath) && !resolvedPath.startsWith('/');
    if (isRelative || assetKey) {
      // Don't auto-add `h` here: if `fit=crop` is used, adding `h` forces a crop/zoom.
      // Only include `h` when the caller explicitly passes it via `imgixParams`.
      return buildImgixUrl(resolvedPath, { ...imgixParams, w: clampedW, q: quality || 50 });
    }
    // Fallback: ensure we *overwrite* w/q (no duplicates)
    const url = new URL(raw, 'http://local'); // base to allow URLSearchParams usage for relative paths
    url.searchParams.set('w', String(w));
    url.searchParams.set('q', String(quality || 50));

    // If the input was relative, strip the fake origin back out
    if (url.origin === 'http://local') {
      return `${url.pathname}${url.search}${url.hash}`;
    }

    return raw.includes('?') ? `${raw}&w=${w}&sat=15&q=${quality || 50}` : `${raw}?w=${w}&sat=15&q=${quality || 50}`;
  };

  return (
    <NextImage
      src={resolvedPath}
      alt={alt}
      draggable={false}
      width={width}
      height={height}
      loading={priority ? undefined : loading}
      className={className}
      sizes={sizes}
      unoptimized
      priority={priority}
      onError={onError}
      {...props}
      loader={loader}
    />
  );
};

export default Image;
