"use client";

import {
  useEffect,
  useEffectEvent,
  useRef,
  type RefObject,
} from "react";

import { useReportVideoWatchProgressMutation } from "../api/watch-progress.mutations";
import { VIDEO_WATCH_PROGRESS_INTERVAL_MS } from "../constants";
import { formatSecondsToDuration } from "../utils/playbackTime";

type WatchTarget = {
  profileId: string | number;
  videoId: string | number;
  courseSlug?: string;
};

type UseVideoWatchProgressOptions = {
  profileId: string | number | null | undefined;
  videoId: string | number | null | undefined;
  courseSlug?: string;
  playerRef: RefObject<HTMLVideoElement | null>;
  enabled?: boolean;
  /** Previously saved max position so a rewind cannot lower stored progress. */
  initialWatchedSeconds?: number;
};

export function useVideoWatchProgress({
  profileId,
  videoId,
  courseSlug,
  playerRef,
  enabled = true,
  initialWatchedSeconds = 0,
}: UseVideoWatchProgressOptions) {
  const maxTimeRef = useRef(0);
  const lastSentRef = useRef<string | null>(null);
  const reportProgress = useReportVideoWatchProgressMutation();
  const mutateRef = useRef(reportProgress.mutate);
  mutateRef.current = reportProgress.mutate;

  const post = useEffectEvent((seconds: number, target: WatchTarget) => {
    if (!Number.isFinite(seconds) || seconds < 1) return;

    const duration = formatSecondsToDuration(seconds);
    if (duration === lastSentRef.current) return;

    lastSentRef.current = duration;
    mutateRef.current({
      profileId: target.profileId,
      videoId: target.videoId,
      duration,
      courseSlug: target.courseSlug,
    });
  });

  useEffect(() => {
    maxTimeRef.current = 0;
    lastSentRef.current = null;
  }, [videoId]);

  useEffect(() => {
    const initial = Number.isFinite(initialWatchedSeconds)
      ? Math.max(0, initialWatchedSeconds)
      : 0;

    if (maxTimeRef.current < initial) {
      maxTimeRef.current = initial;
    }

    if (initial >= 1 && lastSentRef.current == null) {
      lastSentRef.current = formatSecondsToDuration(initial);
    }
  }, [videoId, initialWatchedSeconds]);

  useEffect(() => {
    if (!enabled || profileId == null || videoId == null) return;

    const target: WatchTarget = { profileId, videoId, courseSlug };
    let video: HTMLVideoElement | null = null;
    let rafId = 0;

    const captureTime = () => {
      const current = video?.currentTime;
      if (typeof current === "number" && Number.isFinite(current)) {
        maxTimeRef.current = Math.max(maxTimeRef.current, current);
      }
    };

    const handleTimeUpdate = () => {
      captureTime();
    };

    const handlePause = () => {
      captureTime();
      post(maxTimeRef.current, target);
    };

    const handleEnded = () => {
      const duration = video?.duration;
      if (typeof duration === "number" && Number.isFinite(duration)) {
        maxTimeRef.current = Math.max(maxTimeRef.current, duration);
      } else {
        captureTime();
      }
      post(maxTimeRef.current, target);
    };

    const attach = () => {
      video = playerRef.current;
      if (!video) {
        rafId = window.requestAnimationFrame(attach);
        return;
      }

      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("pause", handlePause);
      video.addEventListener("ended", handleEnded);
    };

    attach();

    const intervalId = window.setInterval(() => {
      const current = playerRef.current;
      if (!current || current.paused || current.ended) return;
      video = current;
      captureTime();
      post(maxTimeRef.current, target);
    }, VIDEO_WATCH_PROGRESS_INTERVAL_MS);

    const handleHide = () => {
      captureTime();
      post(maxTimeRef.current, target);
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") handleHide();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", handleHide);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearInterval(intervalId);
      video?.removeEventListener("timeupdate", handleTimeUpdate);
      video?.removeEventListener("pause", handlePause);
      video?.removeEventListener("ended", handleEnded);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", handleHide);
      post(maxTimeRef.current, target);
    };
  }, [enabled, profileId, videoId, courseSlug, playerRef]);
}
