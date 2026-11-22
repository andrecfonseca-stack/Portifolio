"use client";

import * as React from "react";
import { m, useReducedMotion } from "motion/react";
import { MOTION_DURATION, MOTION_EASE, VIEWPORT_ONCE } from "./tokens";
import { cn } from "@/lib/cn";

/**
 * Reveals handwritten marginalia left-to-right like ink flowing from a pen.
 * Renders fully visible immediately when prefers-reduced-motion is active.
 */
export function HandWrite({
  children,
  className,
  delay = 0.08,
  immediate = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <span className={cn("inline-block", className)}>{children}</span>;
  }

  return (
    <m.span
      className={cn("inline-block", className)}
      initial={{ clipPath: "inset(-30% 100% -30% -4%)", opacity: 0.4 }}
      animate={
        immediate
          ? { clipPath: "inset(-30% -10% -30% -4%)", opacity: 1 }
          : undefined
      }
      whileInView={
        immediate
          ? undefined
          : { clipPath: "inset(-30% -10% -30% -4%)", opacity: 1 }
      }
      viewport={immediate ? undefined : VIEWPORT_ONCE}
      transition={{
        duration: MOTION_DURATION.ink,
        delay,
        ease: MOTION_EASE.ink,
      }}
    >
      {children}
    </m.span>
  );
}
