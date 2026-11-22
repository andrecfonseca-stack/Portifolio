"use client";

import * as React from "react";
import { m } from "motion/react";
import { featuredProjects } from "@/content/projects";
import { profile } from "@/content/profile";
import { Sheet } from "@/components/layout/sheet";
import { EditorialHeading } from "@/components/marginalia/editorial-heading";
import { PhoneMockup, TiltPhone } from "@/components/marginalia/phone-mockup";
import { MarkedText, PenMark } from "@/components/motion/pen-mark";
import { HandWrite } from "@/components/motion/hand-write";
import { AnimatedCounter, RevealBlock } from "@/components/motion/reveal";
import { MOTION_DURATION, MOTION_EASE, VIEWPORT_ONCE } from "@/components/motion/tokens";
import { useSafeMotion } from "@/components/motion/use-safe-reduced-motion";
import { arrowPaths } from "@/lib/marginalia-paths";
import { cn } from "@/lib/cn";

export function HomeProjects() {
  const { reduced: prefersReduced } = useSafeMotion();
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

  const jumpToCase = (index: number) => {
    const el = document.getElementById(`case-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    }
  };

  return (
    <>
      {/* 1. Dark "Projetos." Sheet with the 5-Phone Mockup Row (Attachment 2) */}
      <Sheet
        id="projetos"
        label="projetos"
        tone="night"
        morph
        className="min-h-[92svh] flex flex-col justify-center"
      >
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-start">
          <EditorialHeading text="Projetos." seed={14} />

          <div className="flex flex-col items-start md:items-end">
            <HandWrite
              delay={0.15}
              className="font-marginalia max-w-[13em] -rotate-[3deg] text-2xl text-[var(--pen)] md:text-right md:text-[1.75rem]"
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
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-5 gap-y-12 sm:gap-x-7 lg:mt-16 lg:flex-nowrap lg:gap-x-9">
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
              className="relative flex w-[132px] flex-none flex-col items-center sm:w-[156px] md:w-[176px] lg:w-[196px]"
            >
              {/* Handwritten tag + arrow above phone */}
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
                aria-label={`Abrir estudo de caso ${project.title}`}
                className="block w-full rounded-[16%/7.4%] transition-transform duration-300 hover:-translate-y-3 hover:scale-[1.04] focus-visible:-translate-y-3 focus-visible:scale-[1.04]"
              >
                <PhoneMockup project={project} kind="cover" />
              </button>

              <span className="font-marginalia mt-3.5 whitespace-nowrap text-2xl text-[var(--pen)]">
                <HandWrite delay={0.22 + i * 0.06}>
                  {i + 1}. {project.title}
                </HandWrite>
              </span>
            </m.div>
          ))}
        </div>
      </Sheet>

      {/* 2. Five Full-Sheet Case Studies with 3-Phone Trio (Attachments 3, 4, 5, 6, 7) */}
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
            className="min-h-[95svh] flex flex-col justify-center"
          >
            <article
              aria-labelledby={`case-title-${project.slug}`}
              className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-24"
            >
              {/* Copy Column */}
              <div className={cn(flip && "lg:order-2")}>
                <div className="font-marginalia text-2xl text-[var(--pen)] sm:text-[1.7rem]">
                  <HandWrite delay={0.08}>
                    {project.indexLabel}
                    {meta ? ` — ${meta}` : ""}
                  </HandWrite>
                </div>

                <div className="mt-1">
                  <EditorialHeading
                    text={project.title}
                    seed={40 + i}
                    as="h3"
                    className="text-[clamp(3.25rem,7.5vw,7.5rem)]"
                  />
                </div>

                <RevealBlock delay={0.1}>
                  <p className="mt-6 max-w-[50ch] text-[clamp(0.95rem,1.08vw,1.06rem)] leading-[1.75] text-[var(--fg)]">
                    <MarkedText text={project.summary} seed={200 + i * 11} />
                  </p>
                </RevealBlock>

                {project.challenge && (
                  <RevealBlock delay={0.16}>
                    <div className="mt-7 grid max-w-[34em] items-start gap-4 sm:grid-cols-[auto_1fr]">
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
    </>
  );
}
