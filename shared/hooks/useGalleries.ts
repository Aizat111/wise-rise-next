'use client';

import { useMemo } from 'react';

import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { useGraphWsFetcher } from '@/core/api/graphql/useGraphWsFetcher';
import type { Gallery, GalleryImage } from '@/core/types/galleries.types';

const sortImages = (images: GalleryImage[]) =>
  images
    .filter(image => image.active && image.image_url)
    .slice()
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));

export const useGalleryBySlug = (slug: string) => {
  const query = useGraphWsFetcher<{ galleryBySlug: Gallery | null }>(GRAPHQL_TYPES.GALLERY_BY_SLUG_QUERY).render(
    { slug },
    {
      refetchOnWindowFocus: false,
      enabled: !!slug
    }
  );

  const gallery = useMemo(() => {
    const item = query.data?.galleryBySlug;
    return item?.active ? item : null;
  }, [query.data]);

  const images = useMemo(() => sortImages(gallery?.images || []), [gallery?.images]);

  return {
    gallery,
    images,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
};
