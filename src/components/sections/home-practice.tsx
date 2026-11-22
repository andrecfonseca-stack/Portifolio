"use client";

import * as React from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { profile } from "@/content/profile";
import { Sheet } from "@/components/layout/sheet";
import { EditorialHeading } from "@/components/marginalia/editorial-heading";
import { BookStack } from "@/components/marginalia/book-stack";
import { PenMark } from "@/components/motion/pen-mark";
import { RevealBlock } from "@/components/motion/reveal";
import { MOTION_EASE } from "@/components/motion/tokens";
import { cn } from "@/lib/cn";

export function HomePractice() {
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);
  const prefersReduced = useReducedMotion();

  const activeTile = activeIndex >= 0 ? profile.pillarTiles[activeIndex] : null;
  const noteText = activeTile
    ? `${activeTile.name} — ${activeTile.note}`
    : profile.defaultTileNote;

  return (
    <Sheet id="atuacao" label="atuação" tone="night" morph>
      <div className="space-y-16 lg:space-y-20">
        {/* Top half: heading + interactive domain tiles inside oval | reading stack */}
        <div className="grid items-end gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <EditorialHeading text="Atuação." seed={12} />

            {/* Interactive 5-pillar tiles circled by a hand-drawn oval */}
            <div
              className="relative mt-9 inline-flex max-w-full flex-wrap gap-3 px-4 py-4 sm:gap-4 sm:px-5"
              onPointerLeave={() => setActiveIndex(-1)}
            >
              {profile.pillarTiles.map((tile, idx) => {
                const isSelected = activeIndex === idx;
                return (
                  <button
                    key={tile.id}
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={`${tile.name}: ${tile.note}`}
                    onPointerEnter={() => setActiveIndex(idx)}
                    onFocus={() => setActiveIndex(idx)}
                    onClick={() =>
                      setActiveIndex((cur) => (cur === idx ? -1 : idx))
                    }
                    style={{ backgroundColor: tile.bg, color: tile.fg }}
                    className={cn(
                      "relative grid h-14 w-14 place-items-center rounded-[24%] text-lg font-bold tracking-tight shadow-[0_12px_24px_-14px_rgba(0,0,0,0.7)] transition-transform duration-300 sm:h-16 sm:w-16 sm:text-xl",
                      !prefersReduced &&
                        "hover:-translate-y-2 hover:-rotate-3 hover:scale-105 focus-visible:-translate-y-2 focus-visible:-rotate-3",
                      isSelected &&
                        !prefersReduced &&
                        "-translate-y-2 -rotate-3 scale-105 ring-2 ring-[var(--pen)]",
                    )}
                  >
                    <span>{tile.code}</span>
                  </button>
                );
              })}
              <PenMark kind="oval" seed={13} padX={6} padY={6} delay={0.22} />
            </div>

            {/* Live handwritten marginalia note describing the focused/hovered pillar */}
            <div
              aria-live="polite"
              className="mt-4 min-h-[3.5rem] max-w-[44ch] pl-2"
            >
              <AnimatePresence mode="wait">
                <m.p
                  key={activeIndex}
                  initial={prefersReduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReduced ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.24, ease: MOTION_EASE.editorial }}
                  className="font-marginalia text-2xl text-[var(--pen)] sm:text-[1.75rem]"
                >
                  {noteText}
                </m.p>
              </AnimatePresence>
            </div>
          </div>

          <BookStack books={profile.books} note={profile.booksNote} />
        </div>

        {/* Bottom half: methodology prose + 2-column transversal competencies */}
        <div className="grid items-start gap-10 border-t border-[var(--rule)] pt-12 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
          <RevealBlock>
            <p className="max-w-[48ch] text-base leading-[1.75] text-[var(--muted)]">
              {profile.practiceIntro}
            </p>
            <p className="font-marginalia mt-6 text-2xl text-[var(--pen)]">
              rigor clínico + engenharia limpa + clareza pedagógica
            </p>
          </RevealBlock>

          <RevealBlock delay={0.12}>
            <ul className="grid gap-x-10 gap-y-0 sm:grid-cols-2">
              {profile.competencies.map((item) => (
                <li
                  key={item}
                  className="group relative border-b border-[var(--rule)] py-3 pl-5 text-sm font-medium text-[var(--fg)] transition-colors hover:text-[var(--pen)] sm:text-[0.95rem]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 left-0 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[var(--clinical)] transition-transform duration-200 group-hover:scale-150 group-hover:bg-[var(--pen)]"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </RevealBlock>
        </div>
      </div>
    </Sheet>
  );
}
