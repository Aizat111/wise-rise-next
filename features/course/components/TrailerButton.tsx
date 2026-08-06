"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

import { cn } from "@/lib/utils";

import type { TrailerButtonProps } from "../types";
import { useState } from "react";

/**
 * Large circular play CTA with an animated outer ring.
 */
export function TrailerButton({
  onClick,
  label,
  className,
}: TrailerButtonProps) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 text-center",
        className,
      )}
    >
      <motion.button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="relative flex h-24 w-24 items-center justify-center rounded-full"
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow */}
        <motion.div
          className="absolute inset-2 rounded-full bg-primary/30 blur-xl"
          animate={{
            opacity: hover ? 1 : 0,
            scale: hover ? 1.1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Circle Border */}
        <svg
          className="absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 100 100"
        >
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className="text-primary"
            initial={{
              pathLength: 0,
            }}
            animate={{
              pathLength: hover ? 1 : 0,
            }}
            transition={{
              duration: 0.7,
              ease: "easeInOut",
            }}
          />
        </svg>

        {/* Play Icon */}
        <motion.div
          animate={{
            scale: hover ? 1.2 : 1,
            rotate: hover ? 8 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 15,
          }}
        >
          <Play
            size={42}
            fill="currentColor"
            className={
              hover
                ? "text-primary"
                : "text-white"
            }
          />
        </motion.div>
      </motion.button>

      <p className="max-w-40 text-sm font-medium tracking-wide text-white/90 md:text-base">
        {label}
      </p>
    </div>
  );
}
