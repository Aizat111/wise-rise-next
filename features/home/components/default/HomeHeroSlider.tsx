"use client";

import type { Hero } from "@/core/types/hero.types";
import { useAppSelector } from "@/store/hooks";

import { HeroSlider, type HeroSlide } from "@/shared/ui/sliders";

import { useHeroesQuery } from "../../api/hero.queries";
import { getHeroPlatformParam } from "../../api/hero.utils";
import type { DefaultHomeMode } from "../../types";

type HomeHeroSliderProps = {
  mode: DefaultHomeMode;
  initialHeroes?: Hero[];
  initialPlatform?: string;
};

function mapHeroToSlide(hero: Hero): HeroSlide {
  return {
    id: hero.id,
    imageUrl: hero.image_url ?? "",
    mobileImageUrl: hero.mobile_image_url?.trim() || hero.image_url || "",
    href: hero.button_url,
    alt: hero.title,
  };
}

/**
 * Data-aware hero for DefaultHome ("Tüm İçerikler" / "Wise&Rise").
 * WeTheLiving intentionally does not use this component.
 */
export function HomeHeroSlider({
  mode,
  initialHeroes,
  initialPlatform,
}: HomeHeroSliderProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const platform = getHeroPlatformParam(mode);
  const seeded =
    initialPlatform === platform && initialHeroes && initialHeroes.length > 0
      ? initialHeroes
      : undefined;
  const { data = [], isLoading, isError, refetch, isFetching } =
    useHeroesQuery(platform, "image", {
      initialData: seeded,
      refetchOnMount: isAuthenticated ? "always" : seeded ? false : "always",
    });
  console.log(data);
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
