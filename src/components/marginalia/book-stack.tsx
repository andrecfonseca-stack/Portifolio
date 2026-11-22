"use client";

import * as React from "react";
import { m } from "motion/react";
import type { BookReference } from "@/content/schemas";
import {
  arrowPaths,
  handLinePath,
  isLightHex,
  seededRandom,
} from "@/lib/marginalia-paths";
import { HandWrite } from "@/components/motion/hand-write";
import { MOTION_DURATION, MOTION_EASE, VIEWPORT_ONCE } from "@/components/motion/tokens";
import { useSafeMotion } from "@/components/motion/use-safe-reduced-motion";

export function BookStack({
  books,
  note,
}: {
  books: BookReference[];
  note: string;
}) {
  const { reduced: prefersReduced } = useSafeMotion();
  const list = books.slice(0, 6);
  const bh = 32;
  const base = list.length * bh + 66;

  const geometry = React.useMemo(() => {
    const rand = seededRandom(5);
    const shelf = handLinePath(8, 252, base + 2, 3);
    const noteArrow = arrowPaths([46, 6], [18, 44], -0.35, 8);
    const rects = list.map((book, idx) => {
      const w = 176 + rand() * 52;
      const x = (260 - w) / 2 + (rand() - 0.5) * 20;
      const y = base - (idx + 1) * bh;
      const rot = (rand() - 0.5) * 4.5;
      return { book, w, x, y, rot, dark: !isLightHex(book.color) };
    });
    return { shelf, noteArrow, rects };
  }, [list, base]);

  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      <div className="mb-1 flex items-end justify-end gap-2 pr-2">
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
            initial={prefersReduced ? false : { pathLength: 0 }}
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
            initial={prefersReduced ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{
              duration: prefersReduced ? 0 : 0.4,
              delay: 0.55,
              ease: MOTION_EASE.ink,
            }}
          />
        </svg>
      </div>

      <svg
        viewBox={`0 0 260 ${base + 8}`}
        role="img"
        aria-label={`Pilha de livros de referência: ${list.map((b) => b.title).join(", ")}`}
        className="block h-auto w-full overflow-visible"
      >
        <m.path
          d={geometry.shelf}
          fill="none"
          stroke="var(--pen)"
          strokeWidth={1.7}
          strokeLinecap="round"
          initial={prefersReduced ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{
            duration: prefersReduced ? 0 : MOTION_DURATION.ink,
            ease: MOTION_EASE.ink,
          }}
        />

        {geometry.rects.map(({ book, w, x, y, rot, dark }) => {
          const title = book.title.toUpperCase();
          return (
            <g
              key={book.title}
              transform={`rotate(${rot.toFixed(2)} ${(x + w / 2).toFixed(1)} ${(y + bh / 2).toFixed(1)})`}
            >
              <rect
                x={x}
                y={y}
                width={w}
                height={bh - 3}
                rx={3.5}
                fill={book.color}
                stroke="rgba(0,0,0,0.28)"
                strokeWidth={0.8}
              />
              <rect
                x={x + 10}
                y={y}
                width={4}
                height={bh - 3}
                fill={dark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.12)"}
              />
              <rect
                x={x + w - 14}
                y={y}
                width={4}
                height={bh - 3}
                fill={dark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.12)"}
              />
              <text
                x={x + w / 2}
                y={y + bh / 2 + 2}
                textAnchor="middle"
                fontSize={8.5}
                fill={dark ? "#F5F2EB" : "#1F1E1C"}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                }}
              >
                {title.length > 24 ? `${title.slice(0, 23)}…` : title}
              </text>
              <title>
                {book.title} — {book.author}
              </title>
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
            initial={prefersReduced ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: prefersReduced ? 0 : 0.7, delay: 0.25 }}
          />
          <m.path
            d="M40 25c6 0 7 3 7 5s-2 6-7 6"
            initial={prefersReduced ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: prefersReduced ? 0 : 0.4, delay: 0.45 }}
          />
          <m.path
            d="M19 16c-3-3 3-6 0-10M29 16c-3-3 3-6 0-10"
            initial={prefersReduced ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: prefersReduced ? 0 : 0.5, delay: 0.55 }}
          />
        </g>
      </svg>
    </div>
  );
}
