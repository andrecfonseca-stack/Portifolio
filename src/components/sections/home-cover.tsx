"use client";

import * as React from "react";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { profile } from "@/content/profile";
import { Sheet } from "@/components/layout/sheet";
import { PenMark } from "@/components/motion/pen-mark";
import { HandWrite } from "@/components/motion/hand-write";
import { MOTION_EASE } from "@/components/motion/tokens";
import { clampNumber, sparklePath } from "@/lib/marginalia-paths";

export function HomeCover() {
  const sectionRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const prefersReduced = useReducedMotion();

  const chars = React.useMemo(() => Array.from(profile.coverWord), []);
  const orbitIndex = React.useMemo(() => {
    const idx = profile.coverWord.toLowerCase().lastIndexOf("o");
    return idx >= 0 ? idx : chars.length - 1;
  }, [chars.length]);

  const sparkle = React.useMemo(() => sparklePath(0, 0, 12), []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -54]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.2]);

  // Subtle fading ink trail on fine pointers (desktop) — disabled under prefers-reduced-motion
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const host = sectionRef.current;
    if (!canvas || !host || prefersReduced) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = Math.round(host.clientWidth * dpr);
      canvas.height = Math.round(host.clientHeight * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const penColor =
      getComputedStyle(host).getPropertyValue("--pen-paper").trim() || "#A93F21";
    const LIFE = 850;
    const pts: Array<{ x: number; y: number; t: number; gap: boolean }> = [];
    let raf = 0;

    const draw = () => {
      raf = 0;
      const now = performance.now();
      while (pts.length && now - pts[0].t > LIFE) pts.shift();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = penColor;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        if (b.gap) continue;
        const life = 1 - (now - b.t) / LIFE;
        ctx.globalAlpha = clampNumber(life, 0, 1) * 0.55;
        ctx.lineWidth = (0.5 + 1.8 * life) * dpr;
        ctx.beginPath();
        ctx.moveTo(a.x * dpr, a.y * dpr);
        ctx.lineTo(b.x * dpr, b.y * dpr);
        ctx.stroke();
      }
      if (pts.length) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const rect = host.getBoundingClientRect();
      const now = performance.now();
      const last = pts[pts.length - 1];
      pts.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        t: now,
        gap: !last || now - last.t > 90,
      });
      if (!raf) raf = requestAnimationFrame(draw);
    };

    host.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      host.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [prefersReduced]);

  return (
    <Sheet
      id="capa"
      label="capa"
      tone="paper"
      className="flex min-h-[100svh] flex-col justify-between pt-28 pb-10 md:pt-32 md:pb-12"
    >
      <div
        ref={sectionRef}
        className="relative flex min-h-[calc(100svh-10rem)] flex-col items-center justify-between"
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-10 -inset-y-16 z-[2] h-[calc(100%+8rem)] w-[calc(100%+5rem)]"
        />

        {/* Top subtle thesis eyebrow */}
        <p className="relative z-[1] self-start text-xs font-medium tracking-[0.08em] uppercase text-[var(--muted)] sm:self-center">
          Caderno Editorial · Ciência, Clínica &amp; Sistemas
        </p>

        {/* Central monumental cover word + handwritten signature + circled role */}
        <m.div
          style={
            prefersReduced
              ? undefined
              : { scale: heroScale, y: heroY, opacity: heroOpacity }
          }
          className="relative z-[1] my-auto flex flex-col items-center py-12"
        >
          <div className="relative inline-flex flex-col items-center">
            {/* Handwritten signature with curly arrow pointing to the cover title */}
            <div className="relative z-[2] mb-2 self-end pr-1 sm:absolute sm:-top-12 sm:right-0 sm:mb-0 md:-top-16">
              <div className="relative inline-flex items-center">
                <svg
                  viewBox="0 0 150 110"
                  aria-hidden="true"
                  className="pointer-events-none mr-1 hidden h-auto w-20 overflow-visible sm:block md:w-28"
                >
                  <m.path
                    d="M146 14C128 34 104 30 101 17C98 4 120 2 117 24C114 48 70 74 24 96"
                    fill="none"
                    stroke="var(--pen)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    initial={prefersReduced ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: prefersReduced ? 0 : 0.9,
                      delay: 0.45,
                      ease: MOTION_EASE.ink,
                    }}
                  />
                  <m.path
                    d="M30 80L22 97L41 99"
                    fill="none"
                    stroke="var(--pen)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={prefersReduced ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: prefersReduced ? 0 : 0.35,
                      delay: 1.15,
                      ease: MOTION_EASE.ink,
                    }}
                  />
                </svg>
                <HandWrite
                  immediate
                  delay={0.35}
                  className="font-marginalia -rotate-[6deg] text-3xl text-[var(--pen)] sm:text-4xl md:text-5xl"
                >
                  {profile.shortName}
                </HandWrite>
              </div>
            </div>

            <h1
              aria-label={`${profile.coverWord} — ${profile.name}, ${profile.rolePill}`}
              className="font-editorial m-0 flex whitespace-nowrap text-[clamp(3.75rem,16vw,13.5rem)] leading-[0.9] text-[var(--fg)] select-none"
            >
              {chars.map((char, idx) => (
                <span key={idx} className="relative inline-block" aria-hidden="true">
                  <span className="inline-block overflow-hidden py-[0.08em] -my-[0.08em] px-[0.015em] -mx-[0.015em]">
                    <m.span
                      className="inline-block"
                      initial={prefersReduced ? false : { y: "112%", rotate: 6 }}
                      animate={{ y: "0%", rotate: 0 }}
                      transition={{
                        duration: prefersReduced ? 0 : 0.95,
                        delay: prefersReduced ? 0 : 0.06 + idx * 0.045,
                        ease: MOTION_EASE.editorial,
                      }}
                    >
                      {char}
                    </m.span>
                  </span>

                  {/* Editorial pen orbit + four-point sparkle around the last "o" */}
                  {idx === orbitIndex && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-[52%] left-1/2 h-0 w-0"
                    >
                      <svg
                        viewBox="-100 -100 200 200"
                        className="absolute -top-[0.65em] -left-[0.65em] h-[1.3em] w-[1.3em] overflow-visible"
                      >
                        <g transform="rotate(-18)">
                          <m.path
                            d="M-90 0 A 90 29 0 1 1 90 0 A 90 29 0 1 1 -90 0"
                            fill="none"
                            stroke="var(--pen)"
                            strokeWidth={1.7}
                            strokeLinecap="round"
                            initial={prefersReduced ? false : { pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{
                              duration: prefersReduced ? 0 : 1.0,
                              delay: 0.75,
                              ease: MOTION_EASE.ink,
                            }}
                          />
                        </g>
                        <m.g
                          initial={prefersReduced ? false : { scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            duration: prefersReduced ? 0 : 0.55,
                            delay: 1.05,
                            ease: MOTION_EASE.editorial,
                          }}
                        >
                          <g transform="translate(76 -26)">
                            <path d={sparkle} fill="var(--pen)" />
                          </g>
                        </m.g>
                      </svg>
                    </span>
                  )}
                </span>
              ))}
            </h1>

            {/* Circled interdisciplinary role pill */}
            <m.div
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReduced ? 0 : 0.65,
                delay: prefersReduced ? 0 : 0.55,
                ease: MOTION_EASE.editorial,
              }}
              className="mt-5 self-center sm:mt-4 sm:self-end sm:mr-4"
            >
              <span className="relative inline-block rounded-full border border-[var(--control-border)] px-5 py-2 text-xs font-medium tracking-[0.04em] text-[var(--fg)] sm:text-sm md:text-base">
                {profile.rolePill}
                <PenMark kind="oval" seed={9} padX={11} padY={7} delay={0.85} />
              </span>
            </m.div>
          </div>
        </m.div>

        {/* Bottom cover metadata bar */}
        <div className="relative z-[1] flex w-full flex-wrap items-end justify-between gap-4 border-t border-[var(--rule)] pt-4 text-xs tracking-[0.06em] text-[var(--muted)]">
          <span>
            {profile.location} — {profile.year}
          </span>

          <a
            href="#apresentacao"
            className="font-marginalia group inline-flex items-center gap-2 text-2xl tracking-normal text-[var(--pen)] transition-opacity hover:opacity-80"
          >
            <span>explorar folhas</span>
            <svg
              viewBox="0 0 22 36"
              aria-hidden="true"
              className="animate-marginalia-bob h-8 w-5 overflow-visible"
            >
              <path
                d="M11 2c-4 6 4 10 0 16s4 8 0 14"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.7}
                strokeLinecap="round"
              />
              <path
                d="M5 27l6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.7}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          <span className="hidden sm:inline">{profile.docLabel}</span>
        </div>
      </div>
    </Sheet>
  );
}
