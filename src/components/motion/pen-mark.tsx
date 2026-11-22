"use client";

import * as React from "react";
import { m, useReducedMotion } from "motion/react";
import {
  ovalPath,
  parseMarginaliaMarks,
  sketchBoxPath,
  underlinePath,
} from "@/lib/marginalia-paths";
import { MOTION_DURATION, MOTION_EASE, VIEWPORT_ONCE } from "./tokens";

export type PenMarkKind = "oval" | "under" | "box";

type PenMarkProps = {
  kind: PenMarkKind;
  seed?: number;
  padX?: number;
  padY?: number;
  delay?: number;
  strokeWidth?: number;
  hoverOnly?: boolean;
  active?: boolean;
};

/**
 * Deterministic hand-drawn SVG pen mark sized to its parent element.
 * Animates via SVG pathLength once on scroll (or on hover/focus when hoverOnly=true).
 */
export function PenMark({
  kind,
  seed = 1,
  padX = 10,
  padY = 6,
  delay = 0.12,
  strokeWidth = 1.7,
  hoverOnly = false,
  active = false,
}: PenMarkProps) {
  const ref = React.useRef<SVGSVGElement | null>(null);
  const [box, setBox] = React.useState({ w: 0, h: 0 });
  const prefersReduced = useReducedMotion();

  React.useLayoutEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    const measure = () => {
      const w = host.offsetWidth;
      const h = host.offsetHeight;
      setBox((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  const W = Math.max(1, box.w + padX * 2);
  const H = Math.max(1, box.h + padY * 2);
  const d =
    box.w > 0
      ? kind === "oval"
        ? ovalPath(W, H, seed)
        : kind === "under"
          ? underlinePath(W, H, seed)
          : sketchBoxPath(box.w, box.h, seed)
      : "";

  const viewBox =
    kind === "box" ? `${-padX} ${-padY} ${W} ${H}` : `0 0 ${W} ${H}`;

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox={viewBox}
      className="pointer-events-none absolute overflow-visible"
      style={{ left: -padX, top: -padY, width: W, height: H }}
    >
      {d &&
        (hoverOnly ? (
          <m.path
            d={d}
            fill="none"
            stroke="var(--pen)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{
              pathLength: active ? 1 : 0,
              opacity: active ? 1 : 0,
            }}
            transition={{
              duration: prefersReduced ? 0 : 0.42,
              ease: MOTION_EASE.ink,
            }}
          />
        ) : (
          <m.path
            d={d}
            fill="none"
            stroke="var(--pen)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={prefersReduced ? false : { pathLength: 0, opacity: 0.25 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{
              duration: prefersReduced ? 0 : MOTION_DURATION.ink,
              delay: prefersReduced ? 0 : delay,
              ease: MOTION_EASE.ink,
            }}
          />
        ))}
    </svg>
  );
}

/**
 * Renders prose with inline "*sublinhado*" and "[circulado]" pen annotations.
 */
export function MarkedText({
  text,
  seed = 10,
}: {
  text: string;
  seed?: number;
}) {
  const runs = React.useMemo(() => parseMarginaliaMarks(text), [text]);
  return (
    <>
      {runs.map((run, idx) =>
        run.mark ? (
          <span key={idx} className="relative inline-block">
            <span className="relative z-[1]">{run.text}</span>
            <PenMark
              kind={run.mark}
              seed={seed + idx * 7}
              padX={run.mark === "oval" ? 8 : 1}
              padY={run.mark === "oval" ? 3 : 6}
              delay={0.14 + idx * 0.08}
            />
          </span>
        ) : (
          <React.Fragment key={idx}>{run.text}</React.Fragment>
        ),
      )}
    </>
  );
}
