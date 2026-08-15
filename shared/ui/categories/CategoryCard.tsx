"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";

import { Link } from "@/core/i18n/navigation";
import { cn } from "@/lib/utils";

import {
  CATEGORIES_CARD_CLASS,
  CATEGORIES_MOTION,
  CATEGORY_TITLE_COLOR,
  CATEGORY_TITLE_HOVER_COLOR,
  getCategoryHref,
} from "./constants";
import type { CategoryCardProps } from "./types";

function isHoverPointer(event: PointerEvent<HTMLAnchorElement>) {
  return event.pointerType === "mouse" || event.pointerType === "pen";
}

export function CategoryCard({ category }: CategoryCardProps) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [centerX, setCenterX] = useState(0);

  const isActive = hovered || focused;

  const updateCenter = useCallback(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const next = Math.max(0, (container.clientWidth - text.offsetWidth) / 2);
    setCenterX(next);
  }, []);

  useLayoutEffect(() => {
    updateCenter();

    const container = containerRef.current;
    const text = textRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(updateCenter);
    observer.observe(container);
    if (text) observer.observe(text);

    return () => observer.disconnect();
  }, [category.name, updateCenter]);

  const duration = reduceMotion ? 0 : CATEGORIES_MOTION.duration;

  return (
    <Link
      href={getCategoryHref(category.slug)}
      className={cn(
        CATEGORIES_CARD_CLASS,
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "touch-manipulation",
      )}
      onPointerEnter={(event) => {
        if (isHoverPointer(event)) setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <span ref={containerRef} className="relative block w-full min-w-0">
        <motion.span
          ref={textRef}
          className="inline-block max-w-full text-sm font-medium leading-snug text-white sm:text-sm lg:text-base"
          initial={false}
          animate={{
            x: isActive && !reduceMotion ? centerX : 0,
            color: isActive ? CATEGORY_TITLE_HOVER_COLOR : CATEGORY_TITLE_COLOR,
          }}
          transition={{ duration, ease: CATEGORIES_MOTION.ease }}
        >
          {category.name}
        </motion.span>
      </span>

      <motion.span
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 sm:right-5"
        initial={false}
        animate={{
          opacity: isActive ? 1 : 0,
          x: isActive && !reduceMotion ? 0 : 8,
        }}
        transition={{ duration, ease: CATEGORIES_MOTION.ease }}
      >
        <ChevronRight className="size-4 text-primary sm:size-5 lg:size-6" />
      </motion.span>
    </Link>
  );
}
