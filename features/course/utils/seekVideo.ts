/**
 * Seeks an HTML5 video once it exists and metadata is loaded.
 * Safe to call before the element is mounted — waits via rAF.
 */
export function seekHtmlVideoWhenReady(
  getVideo: () => HTMLVideoElement | null,
  seconds: number,
  signal?: AbortSignal,
): void {
  if (!Number.isFinite(seconds) || seconds < 0) return;

  let applied = false;
  const startedAt = performance.now();
  const MAX_WAIT_MS = 15_000;

  const applySeek = (video: HTMLVideoElement) => {
    if (applied || signal?.aborted) return;
    applied = true;

    const duration = video.duration;
    const target =
      Number.isFinite(duration) && duration > 0
        ? Math.min(seconds, Math.max(0, duration - 0.05))
        : seconds;

    video.currentTime = target;
    void video.play().catch(() => undefined);
  };

  const waitForVideo = () => {
    if (signal?.aborted) return;

    const video = getVideo();
    if (!video) {
      if (performance.now() - startedAt > MAX_WAIT_MS) return;
      requestAnimationFrame(waitForVideo);
      return;
    }

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      applySeek(video);
      return;
    }

    const onReady = () => applySeek(video);
    video.addEventListener("loadedmetadata", onReady, { once: true });
    video.addEventListener("canplay", onReady, { once: true });

    signal?.addEventListener(
      "abort",
      () => {
        video.removeEventListener("loadedmetadata", onReady);
        video.removeEventListener("canplay", onReady);
      },
      { once: true },
    );
  };

  waitForVideo();
}
