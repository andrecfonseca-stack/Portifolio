"use client";

import * as React from "react";
import { animate, m, useInView } from "motion/react";
import { MOTION_DURATION, MOTION_EASE } from "./tokens";
import { useSafeMotion } from "./use-safe-reduced-motion";
import { formatPtNumber } from "@/lib/marginalia-paths";
import { cn } from "@/lib/cn";

export function RevealBlock({
  children,
  className,
  delay = 0,
  y = 18,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: "some" });
  const { mounted, reduced } = useSafeMotion();

  const shouldAnimateIn = !mounted || reduced || isInView;

  return (
    <div ref={ref} className={className}>
      <m.div
        initial={false}
        animate={
          shouldAnimateIn ? { opacity: 1, y: 0 } : { opacity: 0, y }
        }
        transition={{
          duration: reduced ? 0 : MOTION_DURATION.editorial,
          delay: reduced ? 0 : delay,
          ease: MOTION_EASE.editorial,
        }}
      >
        {children}
      </m.div>
    </div>
  );
}

/**
 * Splits a display heading into masked characters driven by an unclipped outer IntersectionObserver.
 * Guarantees headings always reveal reliably on scroll and stay SSR/hydration-safe.
 */
export function SplitDisplayText({
  text,
  className,
  immediate = false,
}: {
  text: string;
  className?: string;
  immediate?: boolean;
}) {
  const containerRef = React.useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: "some" });
  const { mounted, reduced } = useSafeMotion();
  const words = text.split(" ");

  const visible = immediate || reduced || !mounted || isInView;
  let charIndex = 0;

  return (
    <span ref={containerRef} className={cn("inline-block", className)} aria-label={text}>
      {words.map((word, wi) => (
        <React.Fragment key={wi}>
          <span className="inline-block whitespace-nowrap" aria-hidden="true">
            {Array.from(word).map((ch, ci) => {
              const idx = charIndex++;
              return (
                <span
                  key={ci}
                  className="inline-block overflow-hidden py-[0.06em] -my-[0.06em] px-[0.01em] -mx-[0.01em]"
                >
                  <m.span
                    className="inline-block"
                    initial={false}
                    animate={
                      visible
                        ? { y: "0%", rotate: 0, opacity: 1 }
                        : { y: "105%", rotate: 3, opacity: 0.2 }
                    }
                    transition={{
                      duration: reduced ? 0 : 0.78,
                      delay: reduced ? 0 : 0.03 + idx * 0.028,
                      ease: MOTION_EASE.editorial,
                    }}
                  >
                    {ch}
                  </m.span>
                </span>
              );
            })}
          </span>
          {wi < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </span>
  );
}

export function AnimatedCounter({
  value,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
}) {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: "some" });
  const { reduced } = useSafeMotion();
  const [display, setDisplay] = React.useState(() =>
    formatPtNumber(value, decimals),
  );

  React.useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, value, {
      duration: 0.85,
      ease: MOTION_EASE.editorial,
      onUpdate: (latest) => {
        setDisplay(formatPtNumber(latest, decimals));
      },
    });
    return () => controls.stop();
  }, [inView, reduced, value, decimals]);

  const rendered = reduced ? formatPtNumber(value, decimals) : display;

  return (
    <span ref={ref} className="tabular-metrics">
      {rendered}
      {suffix}
    </span>
  );
}
