"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "@/shared/ui/Images/Image";

import {
  HERO_ACTIVE_PERCENT,
  HERO_ASPECT_RATIO_CLASS,
  HERO_MOBILE_ACTIVE_PERCENT,
  HERO_MOBILE_PEEK_PERCENT,
  HERO_PEEK_PERCENT,
} from "./constants";
import type { HeroSlide, HeroSliderProps } from "./types";
import { HeroPagination } from "./HeroPagination";
import { HeroSliderSkeleton } from "./HeroSliderSkeleton";

const DRAG_THRESHOLD_PX = 48;
const SPRING = { type: "spring" as const, stiffness: 280, damping: 32 };

function HeroErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className={cn(
        "flex w-full flex-col items-center justify-center gap-7 rounded-xl bg-white/5 px-4 py-12 text-center",
        HERO_ASPECT_RATIO_CLASS,
      )}
    >
      <p className="text-sm text-white/70">Hero içerikleri yüklenemedi.</p>
      {onRetry ? (
        <Button
          type="button"
          variant="ghost"
          onClick={onRetry}
          className="cursor-pointer text-white/90 hover:bg-white/10 hover:text-white"
        >
          Tekrar dene
        </Button>
      ) : null}
    </div>
  );
}

type HeroSlideCardProps = {
  item: HeroSlide;
  isActive: boolean;
  onActivate?: () => void;
  priority?: boolean;
};

function HeroSlideCard({
  item,
  isActive,
  onActivate,
  priority = false,
}: HeroSlideCardProps) {
  const alt = item.alt?.trim() || "Hero";
  const href = item.href?.trim() || "";
  const isLinked = Boolean(href) && isActive;
  const desktopSrc = item.imageUrl;
  const mobileSrc = item.mobileImageUrl?.trim() || item.imageUrl;

  const media = (
    <>
      <Image
        src={desktopSrc}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 95vw, 90vw"
        className="hidden object-cover object-top md:block"
        draggable={false}
      />
      <Image
        src={mobileSrc}
        alt={alt}
        fill
        priority={priority}
        sizes="95vw"
        className="object-cover object-top md:hidden"
        draggable={false}
      />
    </>
  );

  const shellClassName = cn(
    "relative mx-auto h-full w-full overflow-hidden rounded-4xl bg-white/5 md:w-full",
    "transition-[transform,box-shadow,border-color] duration-300 ease-out",
    "border border-transparent",
    isActive &&
      " md:hover:border-white md:hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
    (isLinked || Boolean(onActivate)) && "cursor-pointer",
  );

  if (isLinked) {
    return (
      <a
        href={href}
        aria-label={alt}
        className={shellClassName}
        draggable={false}
      >
        {media}
      </a>
    );
  }

  if (onActivate) {
    return (
      <button
        type="button"
        aria-label={isActive ? alt : `${alt} — göster`}
        onClick={onActivate}
        className={shellClassName}
      >
        {media}
      </button>
    );
  }

  return (
    <div aria-label={alt} className={shellClassName}>
      {media}
    </div>
  );
}

type HeroCarouselProps = {
  items: HeroSlide[];
  className?: string;
  "aria-label"?: string;
};

function HeroCarousel({
  items,
  className,
  "aria-label": ariaLabel = "Hero",
}: HeroCarouselProps) {
  const count = items.length;
  const canNavigate = count > 1;
  const loop = canNavigate;

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Virtual index into the cloned track (middle copy when looping).
  const [virtualIndex, setVirtualIndex] = useState(() => (loop ? count : 0));
  const skipAnimationRef = useRef(false);
  const suppressClickRef = useRef(false);
  const virtualIndexRef = useRef(virtualIndex);

  const trackX = useMotionValue(0);

  const loopedItems = loop ? [...items, ...items, ...items] : items;
  const realIndex = loop
    ? ((virtualIndex % count) + count) % count
    : virtualIndex;

  useEffect(() => {
    virtualIndexRef.current = virtualIndex;
  }, [virtualIndex]);

  const measure = useEffectEvent(() => {
    const el = viewportRef.current;
    if (!el) return;
    setViewportWidth(el.clientWidth);
    setIsDesktop(window.matchMedia("(min-width: 768px)").matches);
  });

  useEffect(() => {
    measure();
    const el = viewportRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => measure());
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const syncLength = useEffectEvent((nextCount: number, nextLoop: boolean) => {
    setVirtualIndex(nextLoop ? nextCount : 0);
  });

  useEffect(() => {
    syncLength(count, loop);
  }, [count, loop]);

  // Mobile: 95% width centered. Desktop: 90% width with 5% peek each side.
  const peekPercent = isDesktop ? HERO_PEEK_PERCENT : HERO_MOBILE_PEEK_PERCENT;
  const activePercent = isDesktop
    ? HERO_ACTIVE_PERCENT
    : HERO_MOBILE_ACTIVE_PERCENT;

  const gapPx = isDesktop ? 12 : 0;
  const slideWidth =
    viewportWidth > 0
      ? isDesktop
        ? viewportWidth * 0.9
        : viewportWidth * 0.95
      : 0;
  const peekPx =
    viewportWidth > 0
      ? isDesktop
        ? viewportWidth * 0.05
        : (viewportWidth - slideWidth) / 2
      : 0;
  const step = slideWidth + gapPx;
  const targetX = slideWidth > 0 ? peekPx - virtualIndex * step : 0;

  const recenterIfNeeded = useCallback(
    (index: number) => {
      if (!loop) return index;
      if (index < count) {
        skipAnimationRef.current = true;
        return index + count;
      }
      if (index >= count * 2) {
        skipAnimationRef.current = true;
        return index - count;
      }
      return index;
    },
    [count, loop],
  );

  useEffect(() => {
    if (slideWidth <= 0) return;

    if (skipAnimationRef.current) {
      trackX.set(targetX);
      skipAnimationRef.current = false;
      return;
    }

    const controls = animate(trackX, targetX, {
      ...SPRING,
      onComplete: () => {
        const current = virtualIndexRef.current;
        const recentered = recenterIfNeeded(current);
        if (recentered !== current) {
          setVirtualIndex(recentered);
        }
      },
    });

    return () => controls.stop();
  }, [targetX, trackX, slideWidth, recenterIfNeeded]);

  const goToReal = useCallback(
    (nextReal: number) => {
      if (!canNavigate) return;
      const normalized = ((nextReal % count) + count) % count;
      if (!loop) {
        setVirtualIndex(normalized);
        return;
      }

      const base = Math.floor(virtualIndex / count) * count;
      const candidates = [
        base - count + normalized,
        base + normalized,
        base + count + normalized,
      ];
      let best = candidates[1]!;
      let bestDist = Math.abs(best - virtualIndex);
      for (const candidate of candidates) {
        const dist = Math.abs(candidate - virtualIndex);
        if (dist < bestDist) {
          best = candidate;
          bestDist = dist;
        }
      }
      setVirtualIndex(best);
    },
    [canNavigate, count, loop, virtualIndex],
  );

  const next = useCallback(() => {
    if (!canNavigate) return;
    setVirtualIndex((current) => current + 1);
  }, [canNavigate]);

  const prev = useCallback(() => {
    if (!canNavigate) return;
    setVirtualIndex((current) => current - 1);
  }, [canNavigate]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!canNavigate || slideWidth <= 0) return;
      if (event.button !== 0) return;

      const startX = event.clientX;
      const startY = event.clientY;
      const originTrack = trackX.get();
      let dragging = false;
      const pointerId = event.pointerId;

      const cleanup = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        if (viewportRef.current?.hasPointerCapture(pointerId)) {
          viewportRef.current.releasePointerCapture(pointerId);
        }
      };

      const onMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== pointerId) return;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        if (!dragging) {
          if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
          if (Math.abs(dy) > Math.abs(dx)) {
            cleanup();
            return;
          }
          dragging = true;
          setIsDragging(true);
          viewportRef.current?.setPointerCapture(pointerId);
        }

        trackX.set(originTrack + dx);
      };

      const onUp = (upEvent: PointerEvent) => {
        if (upEvent.pointerId !== pointerId) return;
        cleanup();

        if (!dragging) return;

        const dx = upEvent.clientX - startX;
        if (dx <= -DRAG_THRESHOLD_PX) {
          next();
        } else if (dx >= DRAG_THRESHOLD_PX) {
          prev();
        } else {
          void animate(trackX, peekPx - virtualIndexRef.current * step, SPRING);
        }

        suppressClickRef.current = true;
        setIsDragging(false);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    },
    [canNavigate, next, prev, slideWidth, step, trackX, peekPx],
  );

  const onClickCapture = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!suppressClickRef.current) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
    },
    [],
  );

  const onMouseMove = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!canNavigate || !isDesktop) return;
      const rect = viewportRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mid = rect.left + rect.width / 2;
      setHoverSide(event.clientX < mid ? "left" : "right");
    },
    [canNavigate, isDesktop],
  );

  const showLeftNav = canNavigate && (!isDesktop || hoverSide === "left");
  const showRightNav = canNavigate && (!isDesktop || hoverSide === "right");

  return (
    <section
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      className={cn("relative w-full", className)}
    >
      <div
        ref={viewportRef}
        className={cn(
          "relative w-full overflow-hidden h-auto",
          isDragging ? "cursor-grabbing select-none" : "cursor-grab",
        )}
        onPointerDown={onPointerDown}
        onClickCapture={onClickCapture}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setHoverSide(null)}
      >
        {slideWidth > 0 ? (
          <motion.div
            className="flex"
            style={{ x: trackX, gap: gapPx }}
          >
            {loopedItems.map((item, loopIndex) => {
              const isActive = loopIndex === virtualIndex;

              return (
                <div
                  key={`${item.id}-${loopIndex}`}
                  className={cn(
                    "relative shrink-0",
                    HERO_ASPECT_RATIO_CLASS,
                    !isDesktop && !isActive && " opacity-0 pointer-events-none",
                  )}
                  style={{ width: slideWidth, minWidth: slideWidth }}
                  aria-hidden={!isActive}
                >
                  <HeroSlideCard
                    item={item}
                    isActive={isActive}
                    priority={isActive && realIndex === 0}
                    onActivate={
                      canNavigate && !isActive
                        ? () => setVirtualIndex(loopIndex)
                        : undefined
                    }
                  />
                </div>
              );
            })}
          </motion.div>
        ) : (
          <div
            aria-hidden
            className={cn(
              "w-full overflow-hidden rounded-xl bg-white/5",
              HERO_ASPECT_RATIO_CLASS,
            )}
          />
        )}

        {canNavigate ? (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              aria-label="Önceki hero"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={prev}
              className={cn(
                "absolute top-1/2 z-30 cursor-pointer",
                "left-2 -translate-y-1/2 md:left-[5%] md:-translate-x-1/2 md:-translate-y-1/2",
                "rounded-full bg-black/25 text-white backdrop-blur-[2px]",
                "hover:bg-black/40 hover:text-white",
                "focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white/50",
                "transition-opacity duration-250",
                showLeftNav ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <ChevronLeft className="size-6" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              aria-label="Sonraki hero"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={next}
              className={cn(
                "absolute top-1/2 z-30 cursor-pointer",
                "right-2 -translate-y-1/2 md:right-[5%] md:translate-x-1/2 md:-translate-y-1/2",
                "rounded-full bg-black/25 text-white backdrop-blur-[2px]",
                "hover:bg-black/40 hover:text-white",
                "focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white/50",
                "transition-opacity duration-250",
                showRightNav ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <ChevronRight className="size-6" />
            </Button>
          </>
        ) : null}
      </div>

      <HeroPagination
        count={count}
        activeIndex={realIndex}
        onSelect={goToReal}
      />
    </section>
  );
}

/**
 * Reusable hero carousel with peek slides (desktop), swipe/drag, arrows, and dots.
 * Pass slides via `items` — data fetching stays outside this component.
 */
export function HeroSlider({
  items,
  isLoading = false,
  isError = false,
  onRetry,
  className,
  "aria-label": ariaLabel,
}: HeroSliderProps) {
  if (isLoading) {
    return <HeroSliderSkeleton className={className} />;
  }

  if (isError) {
    return (
      <div className={className}>
        <HeroErrorState onRetry={onRetry} />
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <HeroCarousel
      items={items}
      className={className}
      aria-label={ariaLabel}
    />
  );
}
