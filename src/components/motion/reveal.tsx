"use client";

import * as React from "react";
import { animate, m, useInView, useReducedMotion } from "motion/react";
import { MOTION_DURATION, MOTION_EASE, VIEWPORT_ONCE } from "./tokens";
import { formatPtNumber } from "@/lib/marginalia-paths";
import { cn } from "@/lib/cn";

export function RevealBlock({
  children,
  className,
  delay = 0,
  y = 22,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{
        duration: MOTION_DURATION.editorial,
        delay,
        ease: MOTION_EASE.editorial,
      }}
    >
      {children}
    </m.div>
  );
}

/**
 * Splits a short display title into masked words/characters that rise cleanly.
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
  const prefersReduced = useReducedMotion();
  const words = text.split(" ");

  if (prefersReduced) {
    return <span className={className}>{text}</span>;
  }

  let charIndex = 0;

  return (
    <span className={cn("inline", className)} aria-label={text}>
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
                    initial={{ y: "110%", rotate: 4 }}
                    animate={immediate ? { y: "0%", rotate: 0 } : undefined}
                    whileInView={immediate ? undefined : { y: "0%", rotate: 0 }}
                    viewport={immediate ? undefined : VIEWPORT_ONCE}
                    transition={{
                      duration: 0.9,
                      delay: 0.04 + idx * 0.032,
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
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReduced = useReducedMotion();
  const [display, setDisplay] = React.useState(() =>
    formatPtNumber(value, decimals),
  );

  React.useEffect(() => {
    if (!inView || prefersReduced) return;
    const controls = animate(0, value, {
      duration: 1.35,
      ease: MOTION_EASE.editorial,
      onUpdate: (latest) => {
        setDisplay(formatPtNumber(latest, decimals));
      },
    });
    return () => controls.stop();
  }, [inView, prefersReduced, value, decimals]);

  const rendered = prefersReduced ? formatPtNumber(value, decimals) : display;

  return (
    <span ref={ref} className="tabular-metrics">
      {rendered}
      {suffix}
    </span>
  );
}
