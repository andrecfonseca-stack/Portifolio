"use client";

import * as React from "react";
import { m, useScroll, useTransform } from "motion/react";
import { profile } from "@/content/profile";
import { Sheet } from "@/components/layout/sheet";
import { PenMark } from "@/components/motion/pen-mark";
import { MOTION_EASE } from "@/components/motion/tokens";
import { useSafeMotion } from "@/components/motion/use-safe-reduced-motion";
import { CoverSwitchStage } from "@/components/marginalia/cover-switch-stage";
import { clampNumber, sparklePath } from "@/lib/marginalia-paths";

/**
 * Interactive Cover Choreography:
 *  - Initial State (Switch OFF): Stickman waits beside the OFF 3D rocker switch (NO lightbulb yet!).
 *  - When the user clicks/presses the 3D switch button (OFF -> ON):
 *      1. Stickman presses the button with terracotta sparks (0.0s..0.35s)
 *      2. "Portfólio" rises letter-by-letter (0.05s..0.75s)
 *      3. "André Cavalcanti" writes in (0.75s..1.40s) AND the mini lightbulb pops above the stickman's head ("tive uma ideia!")
 *      4. Subtitle pill ("Medicina · IA · Pesquisa · Educação · Tecnologia") appears (1.38s..1.90s)
 *      5. Red/terracotta pen markings draw in sequentially (curly arrow, orbit+star, oval) (1.95s..2.85s)
 *      6. Central curly-loop red arrow (Attachment 3) descends down the center of the portfolio as the climbing rope!
 */
export function HomeCover() {
  const sectionRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const { mounted, reduced: prefersReduced } = useSafeMotion();

  // Switch starts OFF; the lightbulb and cover sequence trigger ONLY after pressing the switch button!
  const [switchOn, setSwitchOn] = React.useState(false);

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

  const sparkle = React.useMemo(() => sparklePath(0, 0, 12), []);

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
      getComputedStyle(host).getPropertyValue("--pen-paper").trim() || "#7d84ef";
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
            {/* Beat 2: Handwritten Name "André Cavalcanti" + Beat 4a: Red Curly Arrow */}
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
                    initial={false}
                    animate={{
                      pathLength: showCover ? 1 : 0,
                      opacity: showCover ? 1 : 0,
                    }}
                    transition={{
                      duration: d(0.75),
                      delay: showCover ? d(1.95) : 0,
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
                    initial={false}
                    animate={{
                      pathLength: showCover ? 1 : 0,
                      opacity: showCover ? 1 : 0,
                    }}
                    transition={{
                      duration: d(0.32),
                      delay: showCover ? d(2.55) : 0,
                      ease: MOTION_EASE.ink,
                    }}
                  />
                </svg>

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
                  className="font-marginalia inline-block -rotate-[5deg] text-3xl text-[var(--pen)] sm:text-4xl md:text-5xl"
                >
                  {profile.shortName}
                </m.span>
              </div>
            </div>

            {/* Beat 1: Monumental word "Portfólio" rises letter-by-letter */}
            <h1
              aria-label={`${profile.coverWord} — ${profile.name}, ${profile.rolePill}`}
              className="font-editorial m-0 flex whitespace-nowrap text-[clamp(3.6rem,15.5vw,13rem)] leading-[0.9] text-[var(--fg)] select-none"
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

                  {/* Beat 4b: Red orbital ellipse + 4-point star around the last "o" */}
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
                            initial={false}
                            animate={{
                              pathLength: showCover ? 1 : 0,
                              opacity: showCover ? 1 : 0,
                            }}
                            transition={{
                              duration: d(0.85),
                              delay: showCover ? d(2.35) : 0,
                              ease: MOTION_EASE.ink,
                            }}
                          />
                        </g>
                        <m.g
                          initial={false}
                          animate={{
                            scale: showCover ? 1 : 0,
                            opacity: showCover ? 1 : 0,
                          }}
                          transition={{
                            duration: d(0.45),
                            delay: showCover ? d(2.95) : 0,
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

            {/* Below "Portfólio": Stickman + 3D Rocker Switch on the left, Subtitle Pill on the right */}
            <div className="mt-2 flex w-full flex-col-reverse items-center justify-between gap-6 sm:mt-3 sm:flex-row sm:items-start sm:px-2">
              <div className="sm:-mt-2 sm:ml-2">
                <CoverSwitchStage
                  isOn={showCover}
                  onToggle={handleSwitchToggle}
                />
              </div>

              {/* Beat 3: Subtitle with all disciplines -> Beat 4c: Red pen oval draws around it */}
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
                    delay={showCover ? d(2.75) : 0}
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
              delay: showCover ? d(3.25) : 0,
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
