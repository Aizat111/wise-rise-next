'use client';

import { FC, useState } from 'react';

import Image from './Image';

export const FALLBACK_GAME_IMAGE = '/assets/games/fallback.svg';

interface ImageWithFallbackProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  [key: string]: any;
}

/**
 * Image wrapper that automatically swaps to fallback when the image fails to load.
 * Useful for game images that may have broken URLs or missing files.
 */
export const ImageWithFallback: FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc = FALLBACK_GAME_IMAGE,
  alt,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  return <Image src={imgSrc} alt={alt} onError={() => setImgSrc(fallbackSrc)} {...props} />;
};
