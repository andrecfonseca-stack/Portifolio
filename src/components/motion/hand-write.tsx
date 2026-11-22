"use client";

import * as React from "react";
import { m, useInView } from "motion/react";
import { MOTION_DURATION, MOTION_EASE } from "./tokens";
import { useSafeMotion } from "./use-safe-reduced-motion";
import { cn } from "@/lib/cn";

/**
 * Reveals handwritten marginalia left-to-right via clip-path observed from an unclipped outer span.
 * Renders fully visible on SSR and when prefers-reduced-motion is active.
 */
export function HandWrite({
  children,
  className,
  delay = 0.06,
  immediate = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: "some" });
  const { mounted, reduced } = useSafeMotion();

  const visible = immediate || reduced || !mounted || isInView;

  return (
    <span ref={ref} className={cn("inline-block", className)}>
      <m.span
        className="inline-block"
        initial={false}
        animate={
          visible
            ? { clipPath: "inset(-30% -10% -30% -4%)", opacity: 1 }
            : { clipPath: "inset(-30% 100% -30% -4%)", opacity: 0.25 }
        }
        transition={{
          duration: reduced ? 0 : MOTION_DURATION.ink,
          delay: reduced ? 0 : delay,
          ease: MOTION_EASE.ink,
        }}
      >
        {children}
      </m.span>
    </span>
  );
}
