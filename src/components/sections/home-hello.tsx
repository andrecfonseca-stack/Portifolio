"use client";

import * as React from "react";
import Image from "next/image";
import { m, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowRight } from "lucide-react";
import { profile } from "@/content/profile";
import { Sheet } from "@/components/layout/sheet";
import { EditorialHeading } from "@/components/marginalia/editorial-heading";
import { MarkedText, PenMark } from "@/components/motion/pen-mark";
import { HandWrite } from "@/components/motion/hand-write";
import { RevealBlock } from "@/components/motion/reveal";
import { MOTION_DURATION, MOTION_EASE, MOTION_SPRING, VIEWPORT_ONCE } from "@/components/motion/tokens";
import { arrowPaths, type Point } from "@/lib/marginalia-paths";

const TRAIT_SPOTS: Array<{ at: Point; a: Point; b: Point; bend: number }> = [
  { at: [96, 42], a: [116, 60], b: [148, 96], bend: 0.22 },
  { at: [406, 40], a: [384, 58], b: [352, 96], bend: -0.22 },
  { at: [62, 236], a: [86, 252], b: [126, 264], bend: -0.28 },
  { at: [438, 294], a: [414, 280], b: [374, 270], bend: -0.26 },
  { at: [108, 486], a: [128, 466], b: [158, 434], bend: 0.24 },
  { at: [396, 488], a: [374, 468], b: [342, 436], bend: -0.24 },
];

export function HomeHello() {
  const prefersReduced = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const layerX = useSpring(rawX, MOTION_SPRING.tactile);
  const layerY = useSpring(rawY, MOTION_SPRING.tactile);
  const picX = useSpring(useMotionValue(0), MOTION_SPRING.tactile);
  const picY = useSpring(useMotionValue(0), MOTION_SPRING.tactile);

  const arrows = React.useMemo(
    () => TRAIT_SPOTS.map((s) => arrowPaths(s.a, s.b, s.bend, 8)),
    [],
  );

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReduced || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    rawX.set(dx * 14);
    rawY.set(dy * 12);
    picX.set(-dx * 6);
    picY.set(-dy * 5);
  };

  const handleLeave = () => {
    rawX.set(0);
    rawY.set(0);
    picX.set(0);
    picY.set(0);
  };

  return (
    <Sheet
      id="apresentacao"
      label="olá"
      tone="paper"
      className="border-t border-[var(--rule)]"
    >
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Left column: portrait inside double sketch boxes + 6 handwritten traits with arrows */}
        <div className="mx-auto w-full max-w-[540px]">
          <div
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            className="relative mx-auto aspect-[500/520] w-full"
          >
            <m.div
              style={prefersReduced ? undefined : { x: picX, y: picY }}
              className="group absolute top-[17%] left-[26%] h-[66%] w-[48%]"
            >
              <div className="relative h-full w-full overflow-hidden rounded-[4px] bg-[var(--rule)]">
                <Image
                  src={profile.portraitPath}
                  alt={profile.portraitAlt}
                  fill
                  sizes="(max-width: 768px) 60vw, 280px"
                  priority
                  className="object-cover grayscale contrast-[1.04] transition-all duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
                />
              </div>
              <PenMark kind="box" seed={21} padX={9} padY={9} delay={0.18} />
              <PenMark kind="box" seed={22} padX={15} padY={15} delay={0.32} />
            </m.div>

            {/* Desktop & tablet spatial marginalia arrows around portrait */}
            <m.div
              style={prefersReduced ? undefined : { x: layerX, y: layerY }}
              className="pointer-events-none absolute inset-0 hidden sm:block"
            >
              <svg
                viewBox="0 0 500 520"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full overflow-visible"
              >
                {arrows.map((arrow, idx) => (
                  <g
                    key={idx}
                    fill="none"
                    stroke="var(--pen)"
                    strokeWidth={1.7}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <m.path
                      d={arrow.shaft}
                      initial={prefersReduced ? false : { pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={VIEWPORT_ONCE}
                      transition={{
                        duration: prefersReduced ? 0 : MOTION_DURATION.ink,
                        delay: 0.14 + idx * 0.08,
                        ease: MOTION_EASE.ink,
                      }}
                    />
                    <m.path
                      d={arrow.head}
                      initial={prefersReduced ? false : { pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={VIEWPORT_ONCE}
                      transition={{
                        duration: prefersReduced ? 0 : 0.35,
                        delay: 0.48 + idx * 0.08,
                        ease: MOTION_EASE.ink,
                      }}
                    />
                  </g>
                ))}
              </svg>

              {profile.traits.map((trait, idx) => (
                <span
                  key={trait}
                  className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
                  style={{
                    left: `${(TRAIT_SPOTS[idx].at[0] / 500) * 100}%`,
                    top: `${(TRAIT_SPOTS[idx].at[1] / 520) * 100}%`,
                  }}
                >
                  <HandWrite
                    delay={0.1 + idx * 0.07}
                    className="font-marginalia text-2xl text-[var(--pen)] lg:text-[1.7rem]"
                  >
                    {trait}
                  </HandWrite>
                </span>
              ))}
            </m.div>
          </div>

          {/* Mobile clean trait list (prevents overlapping text on narrow screens) */}
          <ul
            aria-label="Atributos de atuação"
            className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 sm:hidden"
          >
            {profile.traits.map((trait) => (
              <li
                key={trait}
                className="font-marginalia text-xl text-[var(--pen)]"
              >
                · {trait}
              </li>
            ))}
          </ul>
        </div>

        {/* Right column: editorial greeting + marked-up interdisciplinary bio */}
        <div className="max-w-[58ch]">
          <EditorialHeading text={profile.greeting} seed={10} />

          <RevealBlock delay={0.12}>
            <p className="mt-7 text-[clamp(1rem,1.25vw,1.15rem)] leading-[1.75] text-[var(--fg)]">
              <MarkedText text={profile.bio} seed={100} />
            </p>
          </RevealBlock>

          <RevealBlock delay={0.22}>
            <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-[var(--rule)] pt-6">
              <a
                href="#atuacao"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--fg)] transition-colors hover:text-[var(--pen)]"
              >
                <span>Ver eixos e método</span>
                <ArrowRight className="h-4 w-4 text-[var(--pen)]" aria-hidden="true" />
              </a>
              <a
                href="#projetos"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--pen)]"
              >
                <span>Ir direto aos projetos</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </RevealBlock>
        </div>
      </div>
    </Sheet>
  );
}
