"use client";

import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

const DRAG_THRESHOLD_PX = 6;

type UseSliderScrollOptions = {
  /** Disable drag-to-scroll (e.g. while loading). */
  enabled?: boolean;
};

export function useSliderScroll({ enabled = true }: UseSliderScrollOptions = {}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragState = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });
  const suppressClickRef = useRef(false);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < maxScroll - 2);
  }, []);

  const onScrollStateChange = useEffectEvent(() => {
    updateScrollState();
  });

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    onScrollStateChange();

    const onScroll = () => onScrollStateChange();
    el.addEventListener("scroll", onScroll, { passive: true });

    const resizeObserver = new ResizeObserver(() => onScrollStateChange());
    resizeObserver.observe(el);

    window.addEventListener("resize", onScrollStateChange);

    return () => {
      el.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      window.removeEventListener("resize", onScrollStateChange);
    };
  }, []);

  const scrollByPage = useCallback((direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction * el.clientWidth,
      behavior: "smooth",
    });
  }, []);

  const scrollLeft = useCallback(() => scrollByPage(-1), [scrollByPage]);
  const scrollRight = useCallback(() => scrollByPage(1), [scrollByPage]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!enabled) return;
      // Touch/pen already scroll natively; mouse needs drag support.
      if (event.pointerType !== "mouse") return;
      if (event.button !== 0) return;

      const el = scrollerRef.current;
      if (!el) return;

      dragState.current = {
        active: true,
        pointerId: event.pointerId,
        startX: event.clientX,
        startScrollLeft: el.scrollLeft,
        moved: false,
      };

      el.setPointerCapture(event.pointerId);
      setIsDragging(true);
    },
    [enabled],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const state = dragState.current;
      if (!state.active || state.pointerId !== event.pointerId) return;

      const el = scrollerRef.current;
      if (!el) return;

      const deltaX = event.clientX - state.startX;
      if (Math.abs(deltaX) > DRAG_THRESHOLD_PX) {
        state.moved = true;
      }

      el.scrollLeft = state.startScrollLeft - deltaX;
    },
    [],
  );

  const endDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragState.current;
    if (!state.active || state.pointerId !== event.pointerId) return;

    const el = scrollerRef.current;
    if (el?.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }

    if (state.moved) {
      suppressClickRef.current = true;
    }

    dragState.current = {
      active: false,
      pointerId: -1,
      startX: 0,
      startScrollLeft: 0,
      moved: false,
    };
    setIsDragging(false);
  }, []);

  const onClickCapture = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  }, []);

  return {
    scrollerRef,
    canScrollLeft,
    canScrollRight,
    isDragging,
    scrollLeft,
    scrollRight,
    updateScrollState,
    pointerHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onClickCapture,
    },
  };
}
