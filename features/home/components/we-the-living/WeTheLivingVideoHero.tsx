"use client";

import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  useEffect,
  useRef,
  useState,
  type RefObject,
  type SyntheticEvent,
  type VideoHTMLAttributes,
} from "react";
import { Player } from "react-tuby";
import ReactHlsPlayer from "react-hls-player/dist";
import "react-tuby/css/main.css";

import type { Hero } from "@/core/types/hero.types";
import { isProgressiveMediaUrl } from "@/features/course/utils/mediaUrl";
import { notify } from "@/shared/components/notify";
import { cn } from "@/lib/utils";

import { useHeroesQuery } from "../../api/hero.queries";
import { pickFirstPlayableVideo } from "../../api/hero.utils";
import { WE_THE_LIVING_PLATFORM } from "./constants";
import { WeTheLivingVideoHeroSkeleton } from "./WeTheLivingVideoHeroSkeleton";

const PLAYER_PRIMARY = "#be161a";

type TubyMediaProps = VideoHTMLAttributes<HTMLVideoElement> & { src: string };

function WeTheLivingVideoHeroCopy() {
  const t = useTranslations("home.weTheLiving");

  return (
    <div className="px-2 pt-6 text-center sm:pt-8 md:pt-10">
      <h1 className="text-2xl font-semibold font-all-round-gothic tracking-wide  text-white sm:text-3xl md:text-5xl">
        {t("visualLibraryTitle")}
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm font-medium text-white sm:mt-4 sm:text-base md:text-xl">
        {t("visualLibrarySubtitle")}
      </p>
    </div>
  );
}

function WeTheLivingHeroVideo({ hero }: { hero: Hero }) {
  const reduceMotion = useReducedMotion();
  const playerRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const videoUrl = hero.video_url?.trim() ?? "";
  const useNativeVideo = isProgressiveMediaUrl(videoUrl);

  useEffect(() => {
    setIsReady(false);
  }, [hero.id, videoUrl]);

  useEffect(() => {
    const video = playerRef.current;
    if (!video) return;

    video.muted = true;

    if (reduceMotion) {
      video.pause();
      return;
    }

    void video.play().catch(() => {
      // Autoplay can still be blocked; keep the muted fallback frame.
    });
  }, [hero.id, reduceMotion, videoUrl]);

  const markReady = () => {
    setIsReady(true);
    if (reduceMotion) return;
    void playerRef.current?.play().catch(() => { });
  };

  return (
    <div className="relative mx-auto mt-6 aspect-video w-90 overflow-hidden bg-black rounded-3xl sm:mt-8 sm:w-100 md:w-160">
      {isReady ? null : (
        <WeTheLivingVideoHeroSkeleton className="absolute inset-0 z-10 h-full min-h-0 max-h-none" />
      )}
      <div
        className={cn(
          "relative size-full min-h-0 min-w-0 ",
          isReady ? "opacity-100" : "opacity-0",
        )}
      >
        <Player
          key={hero.id}
          src={videoUrl}
          poster={hero.image_url ?? undefined}
          primaryColor={PLAYER_PRIMARY}
          keyboardShortcut={false}
          dimensions={{ width: "100%", height: "100%" }}
          playerRef={playerRef as RefObject<HTMLVideoElement>}
        >
          {(ref, props) => {
            const { onCanPlay, onLoadedData, ...rest } = props;
            const mediaProps: TubyMediaProps = {
              ...rest,
              autoPlay: !reduceMotion,
              muted: true,
              loop: true,
              playsInline: true,
              preload: "metadata",
              "aria-label": hero.title?.trim() || undefined,
              className: "h-full w-full object-cover object-center",
              onCanPlay: (event: SyntheticEvent<HTMLVideoElement>) => {
                onCanPlay?.(event);
                markReady();
              },
              onLoadedData: (event: SyntheticEvent<HTMLVideoElement>) => {
                onLoadedData?.(event);
                setIsReady(true);
              },
            };

            if (useNativeVideo) {
              return (
                <video
                  ref={ref as RefObject<HTMLVideoElement>}
                  {...mediaProps}
                />
              );
            }

            return (
              <ReactHlsPlayer
                {...mediaProps}
                playerRef={ref as RefObject<HTMLVideoElement>}
              />
            );
          }}
        </Player>
      </div>
    </div>
  );
}

export function WeTheLivingVideoHero() {
  const t = useTranslations("home.weTheLiving");
  const { data = [], isLoading, isError, isFetching } = useHeroesQuery(
    WE_THE_LIVING_PLATFORM,
    "video",
  );

  const hero = pickFirstPlayableVideo(data);
  const showSkeleton = isLoading || (isFetching && data.length === 0);

  useEffect(() => {
    if (!isError) return;
    notify.error(t("videoLoadError"), { id: "wtl-video-hero-error" });
  }, [isError, t]);

  if (showSkeleton) {
    return (
      <section aria-label={t("visualLibraryTitle")} className="relative w-full">
        <WeTheLivingVideoHeroCopy />
        <WeTheLivingVideoHeroSkeleton className="mx-auto mt-6 aspect-video h-auto min-h-0 max-h-none w-50 sm:mt-8" />
      </section>
    );
  }

  if (isError || !hero) {
    return (
      <section aria-label={t("visualLibraryTitle")} className="relative w-full">
        <WeTheLivingVideoHeroCopy />
        <div className="mx-auto mt-6 aspect-video w-50 overflow-hidden bg-black/40 sm:mt-8" />
      </section>
    );
  }

  return (
    <section aria-label={t("visualLibraryTitle")} className="relative w-full">
      <WeTheLivingVideoHeroCopy />
      <WeTheLivingHeroVideo hero={hero} />
    </section>
  );
}
