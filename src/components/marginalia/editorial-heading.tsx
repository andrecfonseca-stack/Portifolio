"use client";

import * as React from "react";
import { m, useInView } from "motion/react";
import { headingSwooshPath } from "@/lib/marginalia-paths";
import { SplitDisplayText } from "@/components/motion/reveal";
import { MOTION_DURATION, MOTION_EASE } from "@/components/motion/tokens";
import { useSafeMotion } from "@/components/motion/use-safe-reduced-motion";
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
  const ref = React.useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: "some" });
  const { mounted, reduced } = useSafeMotion();

  const drawn = !mounted || reduced || isInView;

  return (
    <div ref={ref} className="inline-block max-w-full">
      <Tag
        className={cn(
          "font-editorial m-0 text-4xl leading-[0.96] text-[var(--fg)] sm:text-5xl lg:text-[clamp(3.25rem,6.8vw,6.25rem)] lg:leading-[0.94]",
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
          initial={false}
          animate={{ pathLength: drawn ? 1 : 0, opacity: drawn ? 1 : 0.25 }}
          transition={{
            duration: reduced ? 0 : MOTION_DURATION.ink,
            delay: reduced ? 0 : 0.14,
            ease: MOTION_EASE.ink,
          }}
        />
      </svg>
    </div>
  );
}
