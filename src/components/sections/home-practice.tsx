"use client";

import * as React from "react";
import { AnimatePresence, m } from "motion/react";
import { profile } from "@/content/profile";
import { Sheet } from "@/components/layout/sheet";
import { EditorialHeading } from "@/components/marginalia/editorial-heading";
import { BookStack } from "@/components/marginalia/book-stack";
import { PenMark } from "@/components/motion/pen-mark";
import { RevealBlock } from "@/components/motion/reveal";
import { MOTION_EASE } from "@/components/motion/tokens";
import { useSafeMotion } from "@/components/motion/use-safe-reduced-motion";
import { cn } from "@/lib/cn";

export function HomePractice() {
  const [eixoAtivo, setEixoAtivo] = React.useState<string | null>(null);
  const { reduced: prefersReduced } = useSafeMotion();

  const activeTile = React.useMemo(
    () =>
      eixoAtivo
        ? profile.pillarTiles.find((t) => t.id === eixoAtivo) ?? null
        : null,
    [eixoAtivo],
  );
  const noteTitle = activeTile ? activeTile.name : profile.defaultTileNote;
  const dynamicDescription = activeTile
    ? activeTile.note
    : profile.practiceIntro;

  const leftColumnCompetencies = profile.competencies.slice(0, 5);
  const rightColumnCompetencies = profile.competencies.slice(5, 10);

  const isCompetencyHighlighted = (comp: string) =>
    activeTile ? activeTile.relatedCompetencies.includes(comp) : false;

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
              onPointerLeave={() => setEixoAtivo(null)}
            >
              {profile.pillarTiles.map((tile) => {
                const isSelected = eixoAtivo === tile.id;
                return (
                  <button
                    key={tile.id}
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={`${tile.name}: ${tile.note}`}
                    onPointerEnter={() => setEixoAtivo(tile.id)}
                    onFocus={() => setEixoAtivo(tile.id)}
                    onBlur={() => setEixoAtivo(null)}
                    onClick={() =>
                      setEixoAtivo((cur) => (cur === tile.id ? null : tile.id))
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

            {/* Live handwritten marginalia title of the focused/hovered pillar */}
            <div
              aria-live="polite"
              className="mt-4 min-h-[2.6rem] max-w-[44ch] pl-2"
            >
              <AnimatePresence mode="wait">
                <m.p
                  key={eixoAtivo ?? "default"}
                  initial={prefersReduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReduced ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.22, ease: MOTION_EASE.editorial }}
                  className="font-marginalia text-2xl text-[var(--pen)] sm:text-[1.75rem]"
                >
                  {noteTitle}
                </m.p>
              </AnimatePresence>
            </div>
          </div>

          <BookStack
            books={profile.books}
            note={profile.booksNote}
            activeAxisId={eixoAtivo}
            onSelectAxis={setEixoAtivo}
          />
        </div>

        {/* Bottom half: Dynamic axis description on left | 2-column 10-competency matrix on right */}
        <div className="grid items-start gap-10 border-t border-[var(--rule)] pt-12 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
          <RevealBlock>
            <div className="min-h-[116px]">
              <AnimatePresence mode="wait">
                <m.p
                  key={activeTile ? activeTile.id : "default"}
                  initial={prefersReduced ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReduced ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.2, ease: MOTION_EASE.editorial }}
                  className="max-w-[50ch] text-base leading-[1.75] text-[var(--muted)] sm:text-[1.03rem]"
                >
                  {dynamicDescription}
                </m.p>
              </AnimatePresence>
            </div>
            <p className="font-marginalia mt-6 text-2xl text-[var(--pen)]">
              rigor clínico + engenharia limpa + clareza pedagógica
            </p>
          </RevealBlock>

          <RevealBlock delay={0.12}>
            <div className="grid gap-x-10 gap-y-0 sm:grid-cols-2">
              {[leftColumnCompetencies, rightColumnCompetencies].map(
                (col, colIdx) => (
                  <ul key={colIdx} className="divide-y divide-[var(--rule)]">
                    {col.map((item) => {
                      const highlighted = isCompetencyHighlighted(item);
                      const dimmed = activeTile !== null && !highlighted;
                      return (
                        <li
                          key={item}
                          className={cn(
                            "group relative border-b border-[var(--rule)] py-3 pl-5 text-sm transition-all duration-200 sm:text-[0.95rem]",
                            highlighted
                              ? "translate-x-1 font-semibold text-[var(--fg)]"
                              : dimmed
                                ? "text-[var(--muted)] opacity-45"
                                : "font-medium text-[var(--fg)] hover:text-[var(--pen)]",
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              "absolute top-1/2 left-0 h-1.5 w-1.5 -translate-y-1/2 rounded-full transition-transform duration-200",
                              highlighted
                                ? "scale-150 bg-[var(--pen)]"
                                : "bg-[var(--clinical)] group-hover:scale-150 group-hover:bg-[var(--pen)]",
                            )}
                          />
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                ),
              )}
            </div>
          </RevealBlock>
        </div>
      </div>
    </Sheet>
  );
}
