"use client";

import * as React from "react";
import { m } from "motion/react";
import { ChevronDown } from "lucide-react";
import { featuredProjects } from "@/content/projects";
import { profile } from "@/content/profile";
import { Sheet } from "@/components/layout/sheet";
import { EditorialHeading } from "@/components/marginalia/editorial-heading";
import { ProjectArtifactFrame } from "@/components/marginalia/project-artifact";
import { MarkedText, PenMark } from "@/components/motion/pen-mark";
import { HandWrite } from "@/components/motion/hand-write";
import { AnimatedCounter, RevealBlock } from "@/components/motion/reveal";
import { MOTION_DURATION, MOTION_EASE, VIEWPORT_ONCE } from "@/components/motion/tokens";
import { useSafeMotion } from "@/components/motion/use-safe-reduced-motion";
import { arrowPaths } from "@/lib/marginalia-paths";
import { cn } from "@/lib/cn";

export function HomeProjects() {
  const { reduced: prefersReduced } = useSafeMotion();
  const headerArrow = React.useMemo(() => arrowPaths([42, 4], [20, 44], 0.3, 8), []);
  const noteArrow = React.useMemo(() => arrowPaths([10, 40], [46, 8], -0.28, 8), []);

  return (
    <Sheet id="projetos" label="projetos" tone="paper">
      {/* Section Header */}
      <div className="flex flex-col items-start justify-between gap-6 border-b border-[var(--rule)] pb-12 md:flex-row md:items-end">
        <EditorialHeading text="Projetos." seed={14} />

        <div className="flex items-center gap-3 md:max-w-[16rem] md:flex-col md:items-end">
          <HandWrite
            delay={0.18}
            className="font-marginalia -rotate-[2deg] text-2xl text-[var(--pen)] md:text-right md:text-[1.75rem]"
          >
            {profile.projectsNote}
          </HandWrite>
          <svg
            viewBox="0 0 60 50"
            aria-hidden="true"
            className="hidden h-11 w-12 overflow-visible md:block"
          >
            <m.path
              d={headerArrow.shaft}
              fill="none"
              stroke="var(--pen)"
              strokeWidth={1.7}
              strokeLinecap="round"
              initial={prefersReduced ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: prefersReduced ? 0 : MOTION_DURATION.ink, ease: MOTION_EASE.ink }}
            />
            <m.path
              d={headerArrow.head}
              fill="none"
              stroke="var(--pen)"
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={prefersReduced ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: prefersReduced ? 0 : 0.35, delay: 0.45 }}
            />
          </svg>
        </div>
      </div>

      {/* Alternating editorial case-study blocks */}
      <div className="divide-y divide-[var(--rule)]">
        {featuredProjects.map((project, index) => {
          const flipped = index % 2 === 1;
          return (
            <article
              key={project.slug}
              aria-labelledby={`projeto-${project.slug}`}
              className="grid items-center gap-10 py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-24"
            >
              {/* Copy Column */}
              <div className={cn(flipped && "lg:order-2")}>
                <HandWrite
                  delay={0.08}
                  className="font-marginalia text-2xl text-[var(--pen)]"
                >
                  {project.indexLabel} — {project.kind}, {project.year}
                </HandWrite>

                <h3
                  id={`projeto-${project.slug}`}
                  className="font-editorial mt-2 text-[clamp(2.25rem,4.8vw,4.25rem)] leading-[0.96] text-[var(--fg)]"
                >
                  {project.title}
                </h3>

                <p className="mt-2 text-sm font-medium text-[var(--muted)]">
                  {project.role} · {project.tagline}
                </p>

                <RevealBlock delay={0.1}>
                  <p className="mt-6 max-w-[54ch] text-base leading-[1.75] text-[var(--fg)]">
                    <MarkedText text={project.summary} seed={200 + index * 19} />
                  </p>
                </RevealBlock>

                {/* Highlighted challenge box with hand-drawn oval label */}
                <RevealBlock delay={0.16}>
                  <div className="mt-6 grid max-w-[34rem] items-start gap-3 sm:grid-cols-[auto_1fr] sm:gap-4">
                    <span className="font-marginalia relative inline-block justify-self-start px-2 py-0.5 text-2xl text-[var(--pen)]">
                      meu desafio:
                      <PenMark kind="oval" seed={60 + index} padX={6} padY={3} delay={0.22} />
                    </span>
                    <p className="rounded-md border border-[var(--pen)] bg-[var(--surface-elevated)] px-3.5 py-2.5 text-sm leading-relaxed text-[var(--fg)]">
                      {project.challenge}
                    </p>
                  </div>
                </RevealBlock>

                {/* Counting stats circled in pen ovals */}
                <div className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
                  {project.stats.map((stat, statIdx) => (
                    <div key={stat.label} className="flex items-center gap-3.5">
                      <span className="font-marginalia relative inline-block px-3 py-0.5 text-3xl text-[var(--pen)] sm:text-4xl">
                        <AnimatedCounter
                          value={stat.value}
                          decimals={stat.decimals}
                          suffix={stat.suffix}
                        />
                        <PenMark
                          kind="oval"
                          seed={80 + index * 5 + statIdx}
                          padX={8}
                          padY={3}
                          delay={0.24 + statIdx * 0.1}
                        />
                      </span>
                      <span className="max-w-[14rem] text-xs leading-snug text-[var(--muted)] sm:text-sm">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Accessible progressive-disclosure technical brief (full route /projetos/[slug] arrives in Etapa 5) */}
                <details className="group mt-8 max-w-[54ch] rounded-xl border border-[var(--rule)] bg-[var(--surface-elevated)]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-semibold text-[var(--fg)] transition-colors hover:text-[var(--pen)] [&::-webkit-details-marker]:hidden">
                    <span>Ler ficha metodológica resumida</span>
                    <ChevronDown
                      className="h-4 w-4 shrink-0 text-[var(--pen)] transition-transform duration-200 group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="space-y-3 border-t border-[var(--rule)] px-4 py-4 text-sm leading-relaxed text-[var(--muted)]">
                    <p>
                      <strong className="font-semibold text-[var(--fg)]">Contexto:</strong>{" "}
                      {project.context}
                    </p>
                    <p>
                      <strong className="font-semibold text-[var(--fg)]">Abordagem:</strong>{" "}
                      {project.approach}
                    </p>
                    <p>
                      <strong className="font-semibold text-[var(--fg)]">Impacto:</strong>{" "}
                      {project.impact}
                    </p>
                    <p>
                      <strong className="font-semibold text-[var(--fg)]">Limitações:</strong>{" "}
                      {project.limitations}
                    </p>
                  </div>
                </details>
              </div>

              {/* Artifact Column with selective 3D tilt + handwritten margin note */}
              <div className={cn("relative", flipped && "lg:order-1")}>
                <ProjectArtifactFrame project={project} />

                <div
                  className={cn(
                    "mt-4 flex items-center gap-2",
                    flipped ? "justify-end text-right" : "justify-start text-left",
                  )}
                >
                  {!flipped && (
                    <svg
                      viewBox="0 0 60 46"
                      aria-hidden="true"
                      className="h-9 w-11 shrink-0 overflow-visible"
                    >
                      <m.path
                        d={noteArrow.shaft}
                        fill="none"
                        stroke="var(--pen)"
                        strokeWidth={1.7}
                        strokeLinecap="round"
                        initial={prefersReduced ? false : { pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={VIEWPORT_ONCE}
                        transition={{ duration: prefersReduced ? 0 : 0.7 }}
                      />
                      <m.path
                        d={noteArrow.head}
                        fill="none"
                        stroke="var(--pen)"
                        strokeWidth={1.7}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={prefersReduced ? false : { pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={VIEWPORT_ONCE}
                        transition={{ duration: prefersReduced ? 0 : 0.3, delay: 0.35 }}
                      />
                    </svg>
                  )}
                  <HandWrite
                    delay={0.22}
                    className={cn(
                      "font-marginalia text-xl text-[var(--pen)] sm:text-2xl",
                      flipped ? "rotate-[2deg]" : "-rotate-[2deg]",
                    )}
                  >
                    {project.marginNote}
                  </HandWrite>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Editorial bridge noting Etapa 5 expansion */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule)] pt-8 text-sm text-[var(--muted)]">
        <p>
          Galeria filtrável completa (<code className="text-[var(--fg)]">/projetos</code>) e
          estudos de caso dedicados serão expandidos na Etapa 5 após aprovação desta Home piloto.
        </p>
        <a
          href="#contato"
          className="font-marginalia text-2xl text-[var(--pen)] underline-offset-4 hover:underline"
        >
          vamos conversar →
        </a>
      </div>
    </Sheet>
  );
}
