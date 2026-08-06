"use client";

import {
  useEffect,
  useEffectEvent,
  useRef,
  type MutableRefObject,
  type RefObject,
  type SyntheticEvent,
} from "react";
import { Player } from "react-tuby";
import ReactHlsPlayer from "react-hls-player";
import "react-tuby/css/main.css";

import { cn } from "@/lib/utils";

import type { VideoPlayerProps } from "../types";
import { isProgressiveMediaUrl } from "../utils/mediaUrl";
import { calcWatchPercent, toWatchPercent } from "../utils/watchProgress";

const BRAND_PRIMARY = "#be161a";

type TubyTimeHandler =
  | ((event: SyntheticEvent<HTMLVideoElement>) => void)
  | undefined;

/**
 * Video player built on react-tuby.
 * Progressive MP4/WebM/etc. use a native <video>; HLS (.m3u8) uses react-hls-player.
 * Tracks max watch percentage and reports it on close / complete.
 */
export function VideoPlayer({
  src,
  poster,
  autoPlay = false,
  playsInline = true,
  className,
  playerRef: externalRef,
  onProgress,
  onTimeUpdate: onTimeUpdateProp,
  onClose,
}: VideoPlayerProps) {
  const internalRef = useRef<HTMLVideoElement>(null);
  const maxPercentRef = useRef(0);
  const reportedRef = useRef(false);
  const useNativeVideo = isProgressiveMediaUrl(src);

  const reportProgress = useEffectEvent((percent: number) => {
    onProgress?.(percent);
  });

  const reportTimeUpdate = useEffectEvent(
    (currentTime: number, duration: number) => {
      onTimeUpdateProp?.(currentTime, duration);
    },
  );

  const reportClose = useEffectEvent((percent: number) => {
    if (reportedRef.current) return;
    reportedRef.current = true;
    onClose?.(percent);
  });

  // Reset tracking when the stream changes; report max % on unmount/close.
  useEffect(() => {
    reportedRef.current = false;
    maxPercentRef.current = 0;

    return () => {
      reportClose(toWatchPercent(maxPercentRef.current));
    };
  }, [src]);

  // Keep external playerRef in sync once the HTML5 video mounts.
  useEffect(() => {
    if (!externalRef) return;

    let cancelled = false;
    let rafId = 0;

    const sync = () => {
      if (cancelled) return;
      const video = internalRef.current;
      (externalRef as MutableRefObject<HTMLVideoElement | null>).current =
        video;
      if (!video) {
        rafId = window.requestAnimationFrame(sync);
      }
    };

    sync();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      (externalRef as MutableRefObject<HTMLVideoElement | null>).current = null;
    };
  }, [src, externalRef]);

  const handleTimeUpdate = (
    event: SyntheticEvent<HTMLVideoElement>,
    original?: TubyTimeHandler,
  ) => {
    original?.(event);

    const video = event.currentTarget;
    reportTimeUpdate(video.currentTime, video.duration);

    const percent = calcWatchPercent(video.currentTime, video.duration);
    if (percent === null) return;

    if (percent > maxPercentRef.current) {
      maxPercentRef.current = percent;
      reportProgress(toWatchPercent(percent));
    }
  };

  const handleEnded = (
    event: SyntheticEvent<HTMLVideoElement>,
    original?: TubyTimeHandler,
  ) => {
    original?.(event);

    maxPercentRef.current = 100;
    reportProgress(100);
    reportClose(100);
  };

  return (
    <div
      className={cn(
        "relative size-full min-h-0 min-w-0 overflow-hidden bg-black",
        className,
      )}
    >
      <Player
        src={src}
        poster={poster}
        primaryColor={BRAND_PRIMARY}
        keyboardShortcut={false}
        dimensions={{ width: "100%", height: "100%" }}
        playerRef={internalRef as RefObject<HTMLVideoElement>}
      >
        {(ref, props) => {
          const { onTimeUpdate, onEnded, ...rest } = props;
          const originalTimeUpdate = onTimeUpdate as TubyTimeHandler;
          const originalEnded = onEnded as TubyTimeHandler;

          const mediaProps = {
            ...rest,
            autoPlay,
            playsInline,
            className: "size-full object-contain",
            onTimeUpdate: (e: SyntheticEvent<HTMLVideoElement>) =>
              handleTimeUpdate(e, originalTimeUpdate),
            onEnded: (e: SyntheticEvent<HTMLVideoElement>) =>
              handleEnded(e, originalEnded),
          };

          // react-hls-player always routes through hls.js when MSE is available,
          // which breaks progressive MP4/WebM sources — use native video for those.
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
  );
}
