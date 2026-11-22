"use client";

import * as React from "react";
import { AnimatePresence, m } from "motion/react";
import { Layers, X } from "lucide-react";
import { featuredProjects } from "@/content/projects";
import type { Project } from "@/content/schemas";
import { profile } from "@/content/profile";
import { Sheet } from "@/components/layout/sheet";
import { EditorialHeading } from "@/components/marginalia/editorial-heading";
import { PhoneMockup, TiltPhone } from "@/components/marginalia/phone-mockup";
import { MarkedText, PenMark } from "@/components/motion/pen-mark";
import { HandWrite } from "@/components/motion/hand-write";
import { AnimatedCounter, RevealBlock } from "@/components/motion/reveal";
import {
  MOTION_DURATION,
  MOTION_EASE,
  VIEWPORT_ONCE,
} from "@/components/motion/tokens";
import { useSafeMotion } from "@/components/motion/use-safe-reduced-motion";
import { arrowPaths } from "@/lib/marginalia-paths";
import { cn } from "@/lib/cn";

export function HomeProjects() {
  const { reduced: prefersReduced } = useSafeMotion();
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(
    null,
  );
  const closeBtnRef = React.useRef<HTMLButtonElement | null>(null);

  const headerArrow = React.useMemo(
    () => arrowPaths([40, 4], [22, 46], 0.3, 8),
    [],
  );
  const tagArrows = React.useMemo(
    () =>
      featuredProjects.map((_, i) =>
        arrowPaths([12, 2], [12, 27], i % 2 ? 0.25 : -0.25, 6),
      ),
    [],
  );
  const noteArrow = React.useMemo(
    () => arrowPaths([8, 44], [46, 6], -0.3, 8),
    [],
  );

  // Close STAR modal on Escape and lock body scroll while open
  React.useEffect(() => {
    if (!selectedProject) return;
    closeBtnRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject]);

  const jumpToCase = (index: number) => {
    const el = document.getElementById(`case-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    }
  };

  return (
    <>
      {/* 1. Dark "Projetos." Sheet with the 5-Phone Mockup Row */}
      <Sheet
        id="projetos"
        label="projetos"
        tone="night"
        morph
        className="flex min-h-[92svh] flex-col justify-center"
      >
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-start">
          <EditorialHeading text="Projetos." seed={14} />

          <div className="flex flex-col items-start md:items-end">
            <HandWrite
              delay={0.15}
              className="font-marginalia max-w-[14em] -rotate-[3deg] text-2xl text-[var(--pen)] md:text-right md:text-[1.75rem]"
            >
              {profile.projectsNote}
            </HandWrite>
            <svg
              viewBox="0 0 60 50"
              aria-hidden="true"
              className="mt-1 hidden h-11 w-14 overflow-visible md:mr-[16%] md:block"
            >
              <m.path
                d={headerArrow.shaft}
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
              <m.path
                d={headerArrow.head}
                fill="none"
                stroke="var(--pen)"
                strokeWidth={1.7}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={false}
                whileInView={{ pathLength: 1 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: prefersReduced ? 0 : 0.35, delay: 0.4 }}
              />
            </svg>
          </div>
        </div>

        {/* 5 Phone Mockups Row */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-5 gap-y-12 sm:gap-x-7 lg:mt-16 lg:flex-nowrap lg:gap-x-8">
          {featuredProjects.map((project, i) => (
            <m.div
              key={project.slug}
              initial={false}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{
                duration: prefersReduced ? 0 : 0.65,
                delay: prefersReduced ? 0 : i * 0.08,
                ease: MOTION_EASE.editorial,
              }}
              className="relative flex w-[138px] flex-none flex-col items-center sm:w-[158px] md:w-[178px] lg:w-[194px]"
            >
              {/* Handwritten upper label + curved arrow above phone */}
              <span
                aria-hidden="true"
                className={cn(
                  "font-marginalia mb-1.5 hidden flex-col items-center whitespace-nowrap text-xl text-[var(--pen)] sm:flex",
                  i % 2 === 0 ? "-rotate-[4deg]" : "rotate-[4deg]",
                )}
              >
                <HandWrite delay={0.18 + i * 0.06}>{project.tag}</HandWrite>
                <svg
                  viewBox="0 0 24 30"
                  className="mt-0.5 h-7 w-6 overflow-visible"
                >
                  <path
                    d={tagArrows[i].shaft}
                    fill="none"
                    stroke="var(--pen)"
                    strokeWidth={1.7}
                    strokeLinecap="round"
                  />
                  <path
                    d={tagArrows[i].head}
                    fill="none"
                    stroke="var(--pen)"
                    strokeWidth={1.7}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <button
                type="button"
                onClick={() => jumpToCase(i)}
                aria-label={`Ir para o estudo de caso ${project.title}`}
                className="block w-full rounded-[16%/7.4%] transition-transform duration-300 hover:-translate-y-3 hover:scale-[1.04] focus-visible:-translate-y-3 focus-visible:scale-[1.04]"
              >
                <PhoneMockup project={project} kind="cover" />
              </button>

              <span className="font-marginalia mt-3.5 whitespace-nowrap text-2xl text-[var(--pen)]">
                <HandWrite delay={0.22 + i * 0.06}>
                  {i + 1}. {project.title}
                </HandWrite>
              </span>

              <button
                type="button"
                onClick={() => setSelectedProject(project)}
                className="mt-1 text-[11px] font-medium tracking-[0.06em] uppercase text-[var(--muted)] underline-offset-4 transition-colors hover:text-[var(--pen)] hover:underline"
              >
                ver método STAR
              </button>
            </m.div>
          ))}
        </div>
      </Sheet>

      {/* 2. Five Full-Sheet Case Studies with 3-Phone 3D Trio + STAR Button */}
      {featuredProjects.map((project, i) => {
        const flip = i % 2 === 1;
        const trio = project.screens;
        const meta = [project.kind, project.year].filter(Boolean).join(", ");

        return (
          <Sheet
            key={project.slug}
            id={`case-${i}`}
            label={project.title.toLowerCase()}
            tone={project.tone}
            morph={project.tone === "night" && i > 0}
            className="flex min-h-[95svh] flex-col justify-center"
          >
            <article
              aria-labelledby={`case-title-${project.slug}`}
              className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-24"
            >
              {/* Copy Column */}
              <div className={cn(flip && "lg:order-2")}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-marginalia text-2xl text-[var(--pen)] sm:text-[1.7rem]">
                    <HandWrite delay={0.08}>
                      {project.indexLabel}
                      {meta ? ` — ${meta}` : ""}
                    </HandWrite>
                  </span>
                  <span className="rounded-full border border-[var(--control-border)] px-3 py-0.5 text-[11px] font-semibold tracking-[0.05em] uppercase text-[var(--muted)]">
                    {project.status}
                  </span>
                </div>

                <div className="mt-1">
                  <EditorialHeading
                    text={project.title}
                    seed={40 + i}
                    as="h3"
                    className="text-[clamp(2.9rem,6.6vw,6.5rem)]"
                  />
                </div>

                {/* Stack / Technology Chips */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.methods.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-[var(--rule)] bg-[var(--surface-elevated)] px-2.5 py-1 text-xs font-medium text-[var(--fg)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <RevealBlock delay={0.1}>
                  <p className="mt-6 max-w-[52ch] text-[clamp(0.95rem,1.08vw,1.06rem)] leading-[1.75] text-[var(--fg)]">
                    <MarkedText text={project.summary} seed={200 + i * 11} />
                  </p>
                </RevealBlock>

                {project.challenge && (
                  <RevealBlock delay={0.16}>
                    <div className="mt-7 grid max-w-[36em] items-start gap-4 sm:grid-cols-[auto_1fr]">
                      <span className="font-marginalia relative inline-block justify-self-start px-2 py-0.5 text-2xl whitespace-nowrap text-[var(--pen)] sm:text-[1.7rem]">
                        <HandWrite delay={0.18}>meu desafio:</HandWrite>
                        <PenMark
                          kind="oval"
                          seed={60 + i}
                          padX={6}
                          padY={4}
                          delay={0.22}
                        />
                      </span>
                      <span className="rounded-[4px] border border-[var(--pen)] px-3 py-2 text-sm leading-[1.6] text-[var(--fg)]">
                        {project.challenge}
                      </span>
                    </div>
                  </RevealBlock>
                )}

                {project.stats.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
                    {project.stats.map((s, k) => (
                      <div
                        key={s.label}
                        className="flex max-w-[15em] items-center gap-3.5"
                      >
                        <span className="font-marginalia relative inline-block px-3.5 py-0.5 text-4xl whitespace-nowrap text-[var(--pen)] sm:text-5xl">
                          <AnimatedCounter
                            value={s.value}
                            decimals={s.decimals}
                            suffix={s.suffix}
                          />
                          <PenMark
                            kind="oval"
                            seed={70 + i * 3 + k}
                            padX={8}
                            padY={3}
                            delay={0.24 + k * 0.08}
                          />
                        </span>
                        <span className="text-xs leading-[1.45] text-[var(--muted)] sm:text-sm">
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Button to open the full STAR Method Modal */}
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--pen)] bg-[var(--surface-elevated)] px-5 py-2.5 text-xs font-semibold tracking-[0.06em] uppercase text-[var(--fg)] transition-all hover:-translate-y-0.5 hover:bg-[var(--pen)] hover:text-[#FAF8F3]"
                  >
                    <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Detalhamento STAR (Situação · Tarefa · Ação · Resultado)</span>
                  </button>
                </div>
              </div>

              {/* 3-Phone Trio Column */}
              <div className={cn("relative", flip && "lg:order-1")}>
                <div className="mgn-trio">
                  {trio.map((screenKind, slotIndex) => (
                    <TiltPhone
                      key={slotIndex}
                      slot={slotIndex as 0 | 1 | 2}
                      project={project}
                      kind={screenKind}
                    />
                  ))}

                  {project.marginNote && (
                    <div
                      className={cn(
                        "font-marginalia absolute bottom-[1%] z-[4] max-w-[9.5em] text-2xl leading-[1.05] text-[var(--pen)] sm:text-[1.65rem]",
                        flip
                          ? "right-0 rotate-[5deg] text-right"
                          : "left-0 -rotate-[5deg] text-left",
                      )}
                    >
                      <svg
                        viewBox="0 0 60 46"
                        aria-hidden="true"
                        className={cn(
                          "block h-11 w-14 overflow-visible",
                          flip && "ml-auto -scale-x-100",
                        )}
                      >
                        <path
                          d={noteArrow.shaft}
                          fill="none"
                          stroke="var(--pen)"
                          strokeWidth={1.7}
                          strokeLinecap="round"
                        />
                        <path
                          d={noteArrow.head}
                          fill="none"
                          stroke="var(--pen)"
                          strokeWidth={1.7}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <HandWrite delay={0.24}>{project.marginNote}</HandWrite>
                    </div>
                  )}
                </div>
              </div>
            </article>
          </Sheet>
        );
      })}

      {/* 3. Accessible STAR Method Modal */}
      <AnimatePresence>
        {selectedProject && (
          <m.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-star-titulo"
            data-tone="night"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.22 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          >
            <m.div
              initial={
                prefersReduced
                  ? { opacity: 1 }
                  : { opacity: 0, y: 18, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, y: 12, scale: 0.98 }
              }
              transition={{
                duration: prefersReduced ? 0 : 0.28,
                ease: MOTION_EASE.editorial,
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--rule-night)] bg-[var(--tone-night)] p-6 text-left text-[var(--ink-night)] shadow-2xl md:p-8"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-[var(--rule-night)] pb-5">
                <div>
                  <span className="text-xs font-semibold tracking-[0.08em] uppercase text-[var(--pen-night)]">
                    {selectedProject.status}
                  </span>
                  <h3
                    id="modal-star-titulo"
                    className="font-editorial mt-1 text-3xl text-[var(--ink-night)] sm:text-4xl"
                  >
                    {selectedProject.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--muted-night)]">
                    {selectedProject.tagline}
                  </p>
                </div>

                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  aria-label="Fechar detalhes do projeto"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--rule-night)] bg-[var(--tone-night-elevated)] text-[var(--muted-night)] transition-colors hover:border-[var(--pen-night)] hover:text-[var(--ink-night)]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {/* Stack Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedProject.methods.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-[var(--pen-night)]/30 bg-[var(--pen-night)]/10 px-2.5 py-1 text-xs font-medium text-[var(--pen-night)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* STAR Method Breakdown */}
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-[var(--rule-night)] bg-[var(--tone-night-elevated)] p-4">
                  <h4 className="mb-1 text-xs font-bold tracking-[0.08em] uppercase text-[var(--pen-night)]">
                    S • Situação
                  </h4>
                  <p className="text-sm leading-relaxed text-[var(--ink-night)]/90">
                    {selectedProject.star.situacao}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--rule-night)] bg-[var(--tone-night-elevated)] p-4">
                  <h4 className="mb-1 text-xs font-bold tracking-[0.08em] uppercase text-[var(--pen-night)]">
                    T • Tarefa
                  </h4>
                  <p className="text-sm leading-relaxed text-[var(--ink-night)]/90">
                    {selectedProject.star.tarefa}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--rule-night)] bg-[var(--tone-night-elevated)] p-4">
                  <h4 className="mb-1 text-xs font-bold tracking-[0.08em] uppercase text-[var(--pen-night)]">
                    A • Ação
                  </h4>
                  <p className="text-sm leading-relaxed text-[var(--ink-night)]/90">
                    {selectedProject.star.acao}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--pen-night)]/40 bg-[var(--pen-night)]/10 p-4">
                  <h4 className="mb-1 text-xs font-bold tracking-[0.08em] uppercase text-[var(--pen-night)]">
                    R • Resultado
                  </h4>
                  <p className="text-sm leading-relaxed font-medium text-[var(--ink-night)]">
                    {selectedProject.star.resultado}
                  </p>
                </div>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
