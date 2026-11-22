"use client";

import * as React from "react";
import { m, useScroll, useTransform } from "motion/react";
import { profile } from "@/content/profile";
import { Sheet } from "@/components/layout/sheet";
import { PenMark } from "@/components/motion/pen-mark";
import { MOTION_EASE } from "@/components/motion/tokens";
import { useSafeMotion } from "@/components/motion/use-safe-reduced-motion";
import { CoverSwitchStage } from "@/components/marginalia/cover-switch-stage";
import {
  clampNumber,
  heartPath,
  orbitPoint,
  sparklePath,
} from "@/lib/marginalia-paths";

const ORBIT_TILT = (-18 * Math.PI) / 180;

export function HomeCover() {
  const sectionRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const starGroupRef = React.useRef<SVGGElement | null>(null);
  const { mounted, reduced: prefersReduced } = useSafeMotion();

  const [switchOn, setSwitchOn] = React.useState(false);
  const [hoverName, setHoverName] = React.useState(false);

  const showCover = prefersReduced || switchOn;

  const handleSwitchToggle = React.useCallback((next: boolean) => {
    setSwitchOn(next);
    window.dispatchEvent(
      new CustomEvent("portfolio:cover-switch", { detail: { isOn: next } }),
    );
  }, []);

  const chars = React.useMemo(() => Array.from(profile.coverWord), []);
  const orbitIndex = React.useMemo(() => {
    const idx = profile.coverWord.toLowerCase().lastIndexOf("o");
    return idx >= 0 ? idx : chars.length - 1;
  }, [chars.length]);

  const sparkle = React.useMemo(() => sparklePath(0, 0, 13), []);
  const heart = React.useMemo(() => heartPath(0, 0, 13), []);
  const initialStarPos = React.useMemo(
    () => orbitPoint(0.15, 92, 30, ORBIT_TILT),
    [],
  );

  // Continuous 3D orbit around the last "o" (dims when passing behind the letter, brightens in front)
  React.useEffect(() => {
    if (!mounted || prefersReduced || !showCover) return;
    let raf = 0;
    const start = performance.now();
    const PERIOD_MS = 7000;

    const spin = (now: number) => {
      const star = starGroupRef.current;
      if (star) {
        const phase = (0.15 + (now - start) / PERIOD_MS) % 1;
        const pos = orbitPoint(phase, 92, 30, ORBIT_TILT);
        star.setAttribute(
          "transform",
          `translate(${pos.x.toFixed(2)} ${pos.y.toFixed(2)})`,
        );
        star.style.opacity = pos.front ? "1" : "0.28";
      }
      raf = window.requestAnimationFrame(spin);
    };

    raf = window.requestAnimationFrame(spin);
    return () => window.cancelAnimationFrame(raf);
  }, [mounted, prefersReduced, showCover]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -54]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.2]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const host = sectionRef.current;
    if (!canvas || !host || prefersReduced || !switchOn) return;
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
  }, [prefersReduced, switchOn]);

  const d = (sec: number) => (prefersReduced || !mounted ? 0 : sec);

  return (
    <Sheet
      id="capa"
      label="capa"
      tone="paper"
      className="flex min-h-[100svh] flex-col justify-between pt-24 pb-10 md:pt-28 md:pb-12"
    >
      <div
        ref={sectionRef}
        className="relative flex min-h-[calc(100svh-8.5rem)] flex-col items-center justify-between"
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

        {/* Central monumental cover word + signature + below-left stickman switch & below-right subtitle */}
        <m.div
          style={
            mounted && !prefersReduced
              ? { scale: heroScale, y: heroY, opacity: heroOpacity }
              : undefined
          }
          className="relative z-[2] my-auto flex flex-col items-center py-6"
        >
          <div className="relative inline-flex flex-col items-center">
            {/* Beat 2: Handwritten Name "André Cavalcanti" (curly arrow removed as requested) */}
            <div
              onPointerEnter={() => setHoverName(true)}
              onPointerLeave={() => setHoverName(false)}
              className="relative z-[2] mb-2 self-end pr-1 sm:absolute sm:-top-12 sm:right-0 sm:mb-0 md:-top-16"
            >
              <m.span
                initial={false}
                animate={
                  showCover
                    ? { clipPath: "inset(-30% -10% -30% -4%)", opacity: 1 }
                    : { clipPath: "inset(-30% 100% -30% -4%)", opacity: 0 }
                }
                transition={{
                  duration: d(0.68),
                  delay: showCover ? d(0.75) : 0,
                  ease: MOTION_EASE.ink,
                }}
                className="font-marginalia inline-block -rotate-[6deg] cursor-default text-3xl text-[var(--pen)] sm:text-4xl md:text-5xl"
              >
                {profile.shortName}
              </m.span>
            </div>

            {/* Beat 1: Monumental word "Portfólio" rises letter-by-letter */}
            <h1
              aria-label={`${profile.coverWord} — ${profile.name}, ${profile.rolePill}`}
              className="font-editorial relative z-[1] m-0 flex whitespace-nowrap text-[clamp(3.6rem,15.5vw,13rem)] leading-[0.9] text-[var(--fg)] select-none"
            >
              {chars.map((char, idx) => (
                <span key={idx} className="relative inline-block" aria-hidden="true">
                  <span className="inline-block overflow-hidden py-[0.08em] -my-[0.08em] px-[0.015em] -mx-[0.015em]">
                    <m.span
                      className="inline-block"
                      initial={false}
                      animate={
                        showCover
                          ? { y: "0%", rotate: 0, opacity: 1 }
                          : { y: "115%", rotate: 5, opacity: 0 }
                      }
                      transition={{
                        duration: d(0.72),
                        delay: showCover ? d(0.05 + idx * 0.05) : 0,
                        ease: MOTION_EASE.editorial,
                      }}
                    >
                      {char}
                    </m.span>
                  </span>

                  {/* Beat 4a: 3D Split Elliptical Orbit + Continuously Revolving Star around the last "o" */}
                  {idx === orbitIndex && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-[52%] left-1/2 h-0 w-0"
                    >
                      {/* Back half of the orbit ring (passes BEHIND the letter "o") */}
                      <svg
                        viewBox="-100 -100 200 200"
                        className="absolute -top-[0.66em] -left-[0.66em] -z-10 h-[1.32em] w-[1.32em] overflow-visible"
                      >
                        <g transform="rotate(-18)">
                          <m.path
                            d="M-92 0A92 30 0 0 1 92 0"
                            fill="none"
                            stroke="var(--pen)"
                            strokeWidth={1.7}
                            strokeLinecap="round"
                            initial={false}
                            animate={{
                              pathLength: showCover ? 1 : 0,
                              opacity: showCover ? 1 : 0,
                            }}
                            transition={{
                              duration: d(0.55),
                              delay: showCover ? d(2.0) : 0,
                              ease: MOTION_EASE.ink,
                            }}
                          />
                        </g>
                      </svg>

                      {/* Front half of the orbit ring + Revolving Star (passes IN FRONT of the letter "o") */}
                      <svg
                        viewBox="-100 -100 200 200"
                        className="absolute -top-[0.66em] -left-[0.66em] z-[2] h-[1.32em] w-[1.32em] overflow-visible"
                      >
                        <g transform="rotate(-18)">
                          <m.path
                            d="M92 0A92 30 0 0 1 -92 0"
                            fill="none"
                            stroke="var(--pen)"
                            strokeWidth={1.7}
                            strokeLinecap="round"
                            initial={false}
                            animate={{
                              pathLength: showCover ? 1 : 0,
                              opacity: showCover ? 1 : 0,
                            }}
                            transition={{
                              duration: d(0.55),
                              delay: showCover ? d(2.35) : 0,
                              ease: MOTION_EASE.ink,
                            }}
                          />
                        </g>
                        <g
                          ref={starGroupRef}
                          transform={`translate(${initialStarPos.x.toFixed(2)} ${initialStarPos.y.toFixed(2)})`}
                        >
                          <m.g
                            initial={false}
                            animate={{
                              scale: showCover ? (hoverName ? 1.15 : 1) : 0,
                              rotate: showCover ? 0 : -180,
                              opacity: showCover ? 1 : 0,
                            }}
                            transition={{
                              duration: d(0.55),
                              delay: showCover ? d(2.65) : 0,
                              ease: MOTION_EASE.editorial,
                            }}
                          >
                            <path
                              d={hoverName ? heart : sparkle}
                              fill="var(--pen)"
                            />
                          </m.g>
                        </g>
                      </svg>
                    </span>
                  )}
                </span>
              ))}
            </h1>

            {/* Below "Portfólio": Stickman + 3D Rocker Switch on the left, Subtitle Pill on the right */}
            <div className="mt-2 flex w-full flex-col-reverse items-center justify-between gap-6 sm:mt-3 sm:flex-row sm:items-start sm:px-2">
              <div className="sm:-mt-2 sm:ml-2">
                <CoverSwitchStage
                  isOn={showCover}
                  onToggle={handleSwitchToggle}
                />
              </div>

              {/* Beat 3: Subtitle with all disciplines -> Beat 4b: Red/Terracotta pen oval draws around it */}
              <m.div
                initial={false}
                animate={
                  showCover ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }
                }
                transition={{
                  duration: d(0.58),
                  delay: showCover ? d(1.38) : 0,
                  ease: MOTION_EASE.editorial,
                }}
                className="sm:mt-5 sm:mr-2"
              >
                <span className="relative inline-block rounded-full border border-[var(--control-border)] px-5 py-2 text-center text-xs font-medium tracking-[0.03em] text-[var(--fg)] sm:text-sm md:text-base">
                  {profile.rolePill}
                  <PenMark
                    kind="oval"
                    seed={9}
                    padX={12}
                    padY={7}
                    hoverOnly
                    active={showCover}
                    delay={showCover ? d(2.65) : 0}
                  />
                </span>
              </m.div>
            </div>
          </div>
        </m.div>

        {/* Bottom cover metadata bar */}
        <div className="relative z-[1] flex w-full flex-wrap items-end justify-between gap-4 border-t border-[var(--rule)] pt-4 text-xs tracking-[0.06em] text-[var(--muted)]">
          <span>
            {profile.location} — {profile.year}
          </span>

          <m.a
            href="#apresentacao"
            initial={false}
            animate={
              showCover ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }
            }
            transition={{
              duration: d(0.55),
              delay: showCover ? d(3.15) : 0,
              ease: MOTION_EASE.editorial,
            }}
            className="font-marginalia text-2xl tracking-normal text-[var(--pen)] transition-opacity hover:opacity-80"
          >
            descer escalando
          </m.a>

          <span className="hidden sm:inline">{profile.docLabel}</span>
        </div>
      </div>
    </Sheet>
  );
}
