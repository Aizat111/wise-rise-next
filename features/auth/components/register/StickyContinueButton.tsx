"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StickyContinueButtonProps = {
  label: string;
  loadingLabel?: string;
  formId?: string;
  type?: "submit" | "button";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
};

type ButtonMode = "fixed-full" | "inline" | "floating";

export function StickyContinueButton({
  label,
  loadingLabel,
  formId,
  type = "submit",
  disabled,
  loading,
  onClick,
  className,
}: StickyContinueButtonProps) {
  const [mode, setMode] = useState<ButtonMode>("fixed-full");
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const updateMode = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      lastScrollY.current = y;

      if (y < 16) {
        setMode("fixed-full");
      } else if (delta > 4) {
        setMode("inline");
      } else if (delta < -4) {
        setMode("floating");
      }

      ticking.current = false;
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(updateMode);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const text = loading ? (loadingLabel ?? label) : label;

  const button = (
    <Button
      type={type}
      form={formId}
      nativeButton
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        "font-semibold transition-all duration-300 ease-out",
        mode === "floating"
          ? "h-11 min-w-36 rounded-full px-6 text-sm shadow-lg shadow-black/40"
          : "h-12 w-full text-sm md:text-base",
        className,
      )}
    >
      {text}
    </Button>
  );

  return (
    <>
      {/* Inline slot — keeps layout height when button is not fixed */}
      <div
        className={cn(
          "w-full transition-all duration-300",
          mode === "inline" ? "opacity-100" : "pointer-events-none h-12 opacity-0",
        )}
        aria-hidden={mode !== "inline"}
      >
        {mode === "inline" ? button : null}
      </div>

      {/* Fixed full-width (initial / top of page) */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 transition-all duration-300 ease-out md:px-10",
          "bg-gradient-to-t from-black via-black/95 to-transparent",
          mode === "fixed-full"
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <div className="mx-auto w-full max-w-lg">{mode === "fixed-full" ? button : null}</div>
      </div>

      {/* Floating compact (scroll up) */}
      <div
        className={cn(
          "fixed bottom-6 left-1/2 z-40 -translate-x-1/2 transition-all duration-300 ease-out",
          mode === "floating"
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-95 opacity-0",
        )}
      >
        {mode === "floating" ? button : null}
      </div>
    </>
  );
}
