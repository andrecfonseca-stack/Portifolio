"use client";

import * as React from "react";
import { m, useInView } from "motion/react";
import {
  ovalPath,
  parseMarginaliaMarks,
  sketchBoxPath,
  underlinePath,
} from "@/lib/marginalia-paths";
import { MOTION_DURATION, MOTION_EASE } from "./tokens";
import { useSafeMotion } from "./use-safe-reduced-motion";

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
 * Observed on the SVG host with amount="some" so marks always draw cleanly into view.
 */
export function PenMark({
  kind,
  seed = 1,
  padX = 11,
  padY = 6,
  delay = 0.1,
  strokeWidth = 1.7,
  hoverOnly = false,
  active = false,
}: PenMarkProps) {
  const ref = React.useRef<SVGSVGElement | null>(null);
  const [box, setBox] = React.useState({ w: 0, h: 0 });
  const isInView = useInView(ref, { once: true, amount: "some" });
  const { reduced } = useSafeMotion();

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

  const drawn = hoverOnly ? active : reduced || isInView;

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox={viewBox}
      className="pointer-events-none absolute overflow-visible"
      style={{ left: -padX, top: -padY, width: W, height: H }}
    >
      {d && (
        <m.path
          d={d}
          fill="none"
          stroke="var(--pen)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={
            hoverOnly
              ? false
              : reduced
                ? false
                : { pathLength: 0, opacity: 0.2 }
          }
          animate={{
            pathLength: drawn ? 1 : 0,
            opacity: hoverOnly ? (active ? 1 : 0) : drawn ? 1 : 0.2,
          }}
          transition={{
            duration: reduced
              ? 0
              : hoverOnly
                ? 0.42
                : MOTION_DURATION.ink,
            delay: reduced || hoverOnly ? 0 : delay,
            ease: MOTION_EASE.ink,
          }}
        />
      )}
    </svg>
  );
}

/**
 * Renders prose with inline "*sublinhado*" and "[circulado]" pen annotations.
 * Circled phrases use whitespace-nowrap-friendly padding so ovals never collide with glyphs.
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
          <span
            key={idx}
            className={
              run.mark === "oval"
                ? "relative mx-1 inline-block px-1.5"
                : "relative inline-block"
            }
          >
            <span className="relative z-[1]">{run.text}</span>
            <PenMark
              kind={run.mark}
              seed={seed + idx * 7}
              padX={run.mark === "oval" ? 10 : 1}
              padY={run.mark === "oval" ? 5 : 6}
              delay={0.12 + idx * 0.08}
            />
          </span>
        ) : (
          <React.Fragment key={idx}>{run.text}</React.Fragment>
        ),
      )}
    </>
  );
}
