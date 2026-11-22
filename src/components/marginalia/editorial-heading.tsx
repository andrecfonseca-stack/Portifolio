"use client";

import * as React from "react";
import { m, useReducedMotion } from "motion/react";
import { headingSwooshPath } from "@/lib/marginalia-paths";
import { SplitDisplayText } from "@/components/motion/reveal";
import { MOTION_DURATION, MOTION_EASE, VIEWPORT_ONCE } from "@/components/motion/tokens";
import { cn } from "@/lib/cn";

export function EditorialHeading({
  text,
  seed = 10,
  as: Tag = "h2",
  className,
}: {
  text: string;
  seed?: number;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const swoosh = React.useMemo(() => headingSwooshPath(300, seed), [seed]);
  const prefersReduced = useReducedMotion();

  return (
    <div className="inline-block max-w-full">
      <Tag
        className={cn(
          "font-editorial m-0 text-[clamp(2.75rem,6.8vw,6.25rem)] leading-[0.94] text-[var(--fg)]",
          className,
        )}
      >
        <SplitDisplayText text={text} />
      </Tag>
      <svg
        viewBox="0 0 300 26"
        aria-hidden="true"
        className="mt-1.5 block h-auto w-[min(72%,290px)] overflow-visible"
      >
        <m.path
          d={swoosh}
          fill="none"
          stroke="var(--pen)"
          strokeWidth={2.2}
          strokeLinecap="round"
          initial={prefersReduced ? false : { pathLength: 0, opacity: 0.3 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{
            duration: prefersReduced ? 0 : MOTION_DURATION.ink,
            delay: prefersReduced ? 0 : 0.16,
            ease: MOTION_EASE.ink,
          }}
        />
      </svg>
    </div>
  );
}
