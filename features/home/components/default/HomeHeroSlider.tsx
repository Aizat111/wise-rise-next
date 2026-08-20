"use client";

import type { Hero } from "@/core/types/hero.types";

import { HeroSlider, type HeroSlide } from "@/shared/ui/sliders";

import { useHeroesQuery } from "../../api/hero.queries";
import { getHeroPlatformParam } from "../../api/hero.utils";
import type { DefaultHomeMode } from "../../types";

type HomeHeroSliderProps = {
  mode: DefaultHomeMode;
};

function mapHeroToSlide(hero: Hero): HeroSlide {
  return {
    id: hero.id,
    imageUrl: hero.image_url,
    mobileImageUrl: hero.mobile_image_url?.trim() || hero.image_url,
    href: hero.button_url,
    alt: hero.title,
  };
}

/**
 * Data-aware hero for DefaultHome ("Tüm İçerikler" / "Wise&Rise").
 * WeTheLiving intentionally does not use this component.
 */
export function HomeHeroSlider({ mode }: HomeHeroSliderProps) {
  const platform = getHeroPlatformParam(mode);
  const { data = [], isLoading, isError, refetch, isFetching } =
    useHeroesQuery(platform);

  return (
    <HeroSlider
      items={data.map(mapHeroToSlide)}
      isLoading={isLoading || (isFetching && data.length === 0)}
      isError={isError}
      onRetry={() => {
        void refetch();
      }}
      aria-label="Öne çıkan içerikler"
    />
  );
}
