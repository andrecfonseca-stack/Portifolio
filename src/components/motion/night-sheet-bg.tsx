"use client";

import * as React from "react";
import { m, useScroll, useTransform } from "motion/react";
import { useSafeMotion } from "./use-safe-reduced-motion";

/**
 * Night sheet background that smoothly expands from a rounded editorial card
 * into full bleed as it enters the viewport on scroll.
 * Hydration-safe: applies scroll-linked clipPath only after client mount.
 */
export function NightSheetBg({ morph }: { morph: boolean }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const { mounted, reduced } = useSafeMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 16%"],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(44px 3.2% 0px 3.2% round 38px)", "inset(0px 0% 0px 0% round 0px)"],
  );

  return (
    <m.div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        backgroundColor: "var(--tone-night)",
        clipPath: morph && mounted && !reduced ? clipPath : undefined,
      }}
    />
  );
}
