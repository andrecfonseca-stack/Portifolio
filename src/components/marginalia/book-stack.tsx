"use client";

import * as React from "react";
import { AnimatePresence, m } from "motion/react";
import type { BookReference } from "@/content/schemas";
import {
  arrowPaths,
  handLinePath,
  isLightHex,
  seededRandom,
} from "@/lib/marginalia-paths";
import { HandWrite } from "@/components/motion/hand-write";
import {
  MOTION_DURATION,
  MOTION_EASE,
  VIEWPORT_ONCE,
} from "@/components/motion/tokens";
import { useSafeMotion } from "@/components/motion/use-safe-reduced-motion";
import { cn } from "@/lib/cn";

export function BookStack({
  books,
  note,
  activeAxisId = null,
  onHoverAxis,
  onSelectAxis,
}: {
  books: BookReference[];
  note: string;
  activeAxisId?: string | null;
  onHoverAxis?: (axisId: string | null) => void;
  onSelectAxis?: (axisId: string | null) => void;
}) {
  const { reduced: prefersReduced } = useSafeMotion();
  const list = books.slice(0, 6);
  const bh = 32;
  const base = list.length * bh + 66;

  const activeBook = React.useMemo(
    () =>
      activeAxisId
        ? list.find((b) => b.axisId === activeAxisId) ?? null
        : null,
    [activeAxisId, list],
  );

  const geometry = React.useMemo(() => {
    const rand = seededRandom(5);
    const shelf = handLinePath(8, 252, base + 2, 3);
    const noteArrow = arrowPaths([46, 6], [18, 44], -0.35, 8);
    const rects = list.map((book, idx) => {
      const w = 186 + rand() * 44;
      const x = (260 - w) / 2 + (rand() - 0.5) * 16;
      const y = base - (idx + 1) * bh;
      const rot = (rand() - 0.5) * 4.2;
      return { book, w, x, y, rot, dark: !isLightHex(book.color) };
    });
    return { shelf, noteArrow, rects };
  }, [list, base]);

  return (
    <div
      className="relative mx-auto w-full max-w-[265px] sm:max-w-[320px] lg:max-w-[356px]"
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") onHoverAxis?.(null);
      }}
    >
      {/* Dynamic header above coffee cup: default note or active book reference + 1-line synthesis */}
      <div
        aria-live="polite"
        className="mb-1 flex min-h-[4.25rem] items-end justify-end pr-2"
      >
        <AnimatePresence mode="wait">
          {activeBook ? (
            <m.div
              key={activeBook.axisId}
              initial={prefersReduced ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: MOTION_EASE.editorial }}
              className="max-w-[290px] text-right"
            >
              <p className="font-marginalia text-2xl leading-tight text-[var(--pen)]">
                {activeBook.originalRef}
              </p>
              <p className="mt-0.5 text-xs leading-snug text-[var(--fg)]/85">
                {activeBook.synthesis}
              </p>
            </m.div>
          ) : (
            <m.div
              key="default-note"
              initial={prefersReduced ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: MOTION_EASE.editorial }}
              className="flex items-end justify-end gap-2"
            >
              <HandWrite
                delay={0.2}
                className="font-marginalia max-w-[9em] rotate-[4deg] text-right text-2xl text-[var(--pen)]"
              >
                {note}
              </HandWrite>
              <svg
                viewBox="0 0 60 50"
                aria-hidden="true"
                className="h-11 w-12 shrink-0 overflow-visible"
              >
                <m.path
                  d={geometry.noteArrow.shaft}
                  fill="none"
                  stroke="var(--pen)"
                  strokeWidth={1.7}
                  strokeLinecap="round"
                  initial={false}
                  whileInView={{ pathLength: 1 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{
                    duration: prefersReduced ? 0 : MOTION_DURATION.ink,
                    delay: 0.22,
                    ease: MOTION_EASE.ink,
                  }}
                />
                <m.path
                  d={geometry.noteArrow.head}
                  fill="none"
                  stroke="var(--pen)"
                  strokeWidth={1.7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={false}
                  whileInView={{ pathLength: 1 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{
                    duration: prefersReduced ? 0 : 0.4,
                    delay: 0.55,
                    ease: MOTION_EASE.ink,
                  }}
                />
              </svg>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <svg
        viewBox={`0 0 260 ${base + 8}`}
        role="group"
        aria-label={`Pilha interativa de livros de referência: ${list.map((b) => `${b.title} (${b.axisId})`).join(", ")}`}
        className="block h-auto w-full overflow-visible"
      >
        <m.path
          d={geometry.shelf}
          fill="none"
          stroke="var(--pen)"
          strokeWidth={1.7}
          strokeLinecap="round"
          initial={false}
          whileInView={{ pathLength: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{
            duration: prefersReduced ? 0 : MOTION_DURATION.ink,
            ease: MOTION_EASE.ink,
          }}
        />

        {geometry.rects.map(({ book, w, x, y, rot, dark }) => {
          const title = book.title.toUpperCase();
          const isActive = activeAxisId === book.axisId;
          const isDimmed = activeAxisId !== null && !isActive;

          return (
            <g
              key={book.title}
              transform={`rotate(${rot.toFixed(2)} ${(x + w / 2).toFixed(1)} ${(y + bh / 2).toFixed(1)})`}
            >
              <g
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={`${book.title} (${book.originalRef}) — eixo ${book.axisId}: ${book.synthesis}`}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") onHoverAxis?.(book.axisId);
                }}
                onClick={() => onSelectAxis?.(book.axisId)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectAxis?.(book.axisId);
                  }
                }}
                className={cn(
                  "cursor-pointer outline-none transition-all duration-300 ease-out",
                  isActive && !prefersReduced && "-translate-x-3",
                  isDimmed ? "opacity-65" : "opacity-100",
                )}
              >
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={bh - 3}
                  rx={3.5}
                  fill={book.color}
                  stroke={isActive ? "var(--pen)" : "rgba(0,0,0,0.34)"}
                  strokeWidth={isActive ? 1.6 : 0.8}
                />
                {/* Left spine groove */}
                <rect
                  x={x + 8}
                  y={y}
                  width={3.5}
                  height={bh - 3}
                  fill={dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)"}
                />
                {/* Spine title in Portuguese */}
                <text
                  x={x + (w - 22) / 2 + 4}
                  y={y + bh / 2 + 2}
                  textAnchor="middle"
                  fontSize={7.8}
                  fill={dark ? "#F4F1EA" : "#1F1E1C"}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 650,
                    letterSpacing: "0.055em",
                  }}
                >
                  {title.length > 25 ? `${title.slice(0, 24)}…` : title}
                </text>

                {/* Discrete axis badge on the right corner of the spine */}
                <rect
                  x={x + w - 25}
                  y={y + 5.5}
                  width={18}
                  height={bh - 14}
                  rx={3.2}
                  fill={
                    isActive
                      ? "var(--pen)"
                      : dark
                        ? "rgba(255,255,255,0.14)"
                        : "rgba(24,24,26,0.12)"
                  }
                  stroke={
                    isActive
                      ? "rgba(255,255,255,0.45)"
                      : dark
                        ? "rgba(255,255,255,0.18)"
                        : "rgba(24,24,26,0.18)"
                  }
                  strokeWidth={0.6}
                />
                <text
                  x={x + w - 16}
                  y={y + bh / 2 + 1.8}
                  textAnchor="middle"
                  fontSize={6.8}
                  fill={
                    isActive
                      ? "#FFFFFF"
                      : dark
                        ? "rgba(244,241,234,0.9)"
                        : "rgba(31,30,28,0.88)"
                  }
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                  }}
                >
                  {book.axisId}
                </text>
              </g>
            </g>
          );
        })}

        {/* Hand-drawn coffee cup resting atop the reading stack */}
        <g
          transform={`translate(104 ${base - list.length * bh - 52})`}
          fill="none"
          stroke="var(--pen)"
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <m.path
            d="M10 22h30v10c0 8-6 13-15 13S10 40 10 32z"
            initial={false}
            whileInView={{ pathLength: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: prefersReduced ? 0 : 0.7, delay: 0.25 }}
          />
          <m.path
            d="M40 25c6 0 7 3 7 5s-2 6-7 6"
            initial={false}
            whileInView={{ pathLength: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: prefersReduced ? 0 : 0.4, delay: 0.45 }}
          />
          <m.path
            d="M19 16c-3-3 3-6 0-10M29 16c-3-3 3-6 0-10"
            initial={false}
            whileInView={{ pathLength: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: prefersReduced ? 0 : 0.5, delay: 0.55 }}
          />
        </g>
      </svg>
    </div>
  );
}
