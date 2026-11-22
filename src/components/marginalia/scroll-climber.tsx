"use client";

import * as React from "react";
import { useSafeMotion } from "@/components/motion/use-safe-reduced-motion";

type MarginClimberApi = {
  PERCH_IDLE: Record<string, unknown>;
  LANDED_POSE: Record<string, unknown>;
  climbPose: (
    ph: number,
    activity: number,
    dir: number,
    t: number,
  ) => Record<string, unknown>;
  drawClimberOnRope: (
    g: CanvasRenderingContext2D,
    opts: {
      x: number;
      y: number;
      scale: number;
      ropeTop: number;
      ropeBottom: number;
      progress: number;
      pose: Record<string, unknown>;
      ink: string;
      far: string;
      pen: string;
      ropeCol: string;
      knots: number[];
      waveAmt: number;
      waveTime: number;
      sparkK: number;
    },
  ) => void;
  mix: (
    a: Record<string, unknown>,
    b: Record<string, unknown>,
    k: number,
  ) => Record<string, unknown>;
  breathe: (
    p: Record<string, unknown>,
    t: number,
    amt?: number,
  ) => Record<string, unknown>;
  clamp: (v: number, a: number, b: number) => number;
  lerp: (a: number, b: number, k: number) => number;
};

declare global {
  interface Window {
    RIG?: unknown;
    MARGIN_CLIMBER?: MarginClimberApi;
  }
}

function loadScriptOnce(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`,
    );
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(src)), {
        once: true,
      });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    });
    script.addEventListener("error", () => reject(new Error(src)));
    document.head.appendChild(script);
  });
}

function getToneAtViewportY(clientY: number): "paper" | "night" {
  const sheets = document.querySelectorAll<HTMLElement>("section[data-sheet]");
  for (const sheet of sheets) {
    const rect = sheet.getBoundingClientRect();
    if (clientY >= rect.top && clientY <= rect.bottom) {
      return sheet.dataset.tone === "night" ? "night" : "paper";
    }
  }
  return "paper";
}

function getSectionKnotPositions(): number[] {
  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0) return [0, 0.25, 0.5, 0.75, 1];
  const sheets = Array.from(
    document.querySelectorAll<HTMLElement>("section[data-sheet]"),
  );
  if (!sheets.length) return [0, 0.25, 0.5, 0.75, 1];
  return sheets.map((s) => {
    const top = s.getBoundingClientRect().top + window.scrollY;
    return Math.min(1, Math.max(0, top / docHeight));
  });
}

/**
 * Interactive hand-drawn stick figure climber anchored to the right editorial margin.
 * Uses the `stick-scene` runtime (/scenes/stick.js) and descends/ascends the rope
 * hand-over-hand in real time synced to page scroll.
 */
export function ScrollClimber() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const { mounted, reduced } = useSafeMotion();

  React.useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Skip work when hidden on mobile/tablet (< 1024px)
    const desktopMq = window.matchMedia("(min-width: 1024px)");

    let cancelled = false;
    let rafId = 0;

    const state = {
      curProg: 0,
      targetProg: 0,
      phase: 0,
      activity: 0,
      dir: 1,
      lastTime: performance.now(),
      startTime: performance.now(),
      bottomTimer: 0,
      knots: [0, 0.25, 0.5, 0.75, 1],
    };

    const readTargetProgress = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      return Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      state.knots = getSectionKnotPositions();
    };

    const renderFrame = (now: number) => {
      const api = window.MARGIN_CLIMBER;
      if (!api || !desktopMq.matches) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = canvas.width / rect.width;

      const dt = Math.min(0.05, Math.max(0.001, (now - state.lastTime) / 1000));
      state.lastTime = now;
      const t = (now - state.startTime) / 1000;

      state.targetProg = readTargetProgress();
      const prevProg = state.curProg;
      if (reduced) {
        state.curProg = state.targetProg;
        state.activity = 0;
      } else {
        const diff = state.targetProg - state.curProg;
        state.curProg += diff * Math.min(1, dt * 11);
        const deltaProg = state.curProg - prevProg;
        const speedPx = Math.abs(deltaProg * rect.height) / dt;
        if (Math.abs(deltaProg) > 0.00015) {
          state.dir = deltaProg > 0 ? 1 : -1;
          state.phase += (Math.abs(deltaProg * rect.height) / 34);
        }
        const wantActivity = api.clamp(speedPx / 65, 0, 1);
        state.activity += (wantActivity - state.activity) * Math.min(1, dt * 9);
      }

      const ropeTop = 26;
      const ropeBottom = Math.max(120, rect.height - 24);
      const scale = rect.width >= 96 ? 0.56 : 0.5;
      // Figure sits slightly left of the vertical rope running near the right edge
      const figureX = rect.width - 34;
      // Head is ~115*scale above figure y; keep head cleanly below the top anchor ring
      const minY = ropeTop + 124 * scale;
      const maxY = ropeBottom;
      const climberY = api.lerp(minY, maxY, state.curProg);

      // Detect whether the climber's torso is over a paper or night sheet
      const torsoClientY = rect.top + climberY - 56 * scale;
      const tone = getToneAtViewportY(torsoClientY);
      const isNight = tone === "night";

      const palette = isNight
        ? {
            ink: "#EFECE6",
            far: "#8D9CA1",
            pen: "#F08A65",
            ropeCol: "rgba(239, 236, 230, 0.28)",
          }
        : {
            ink: "#1F1E1C",
            far: "#746E65",
            pen: "#A93F21",
            ropeCol: "rgba(31, 30, 28, 0.26)",
          };

      // Blend smoothly into cheerful landed wave when reaching the bottom sheet
      const atBottom = api.clamp((state.curProg - 0.94) / 0.055, 0, 1);
      if (atBottom > 0.6 && !reduced) {
        state.bottomTimer = Math.min(2.2, state.bottomTimer + dt);
      } else {
        state.bottomTimer = Math.max(0, state.bottomTimer - dt * 2);
      }

      const climbingPose = api.climbPose(
        state.phase,
        state.activity,
        state.dir,
        t,
      );
      const landedBreathing = api.breathe(api.LANDED_POSE, t, 0.7);
      const finalPose =
        atBottom > 0.01
          ? api.mix(climbingPose, landedBreathing, atBottom)
          : climbingPose;

      const waveAmt =
        !reduced && atBottom > 0.75
          ? Math.sin(Math.min(1, state.bottomTimer / 1.4) * Math.PI) * 0.9
          : 0;
      const sparkK =
        !reduced && atBottom > 0.85 && state.bottomTimer < 1.1
          ? api.clamp(state.bottomTimer / 0.9, 0, 1)
          : 0;

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      api.drawClimberOnRope(ctx, {
        x: figureX,
        y: climberY,
        scale,
        ropeTop,
        ropeBottom,
        progress: state.curProg,
        pose: finalPose,
        ink: palette.ink,
        far: palette.far,
        pen: palette.pen,
        ropeCol: palette.ropeCol,
        knots: state.knots,
        waveAmt,
        waveTime: t,
        sparkK,
      });

      ctx.restore();
    };

    const tick = (now: number) => {
      if (cancelled) return;
      renderFrame(now);
      if (!reduced) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const onScrollOrResize = () => {
      resize();
      if (reduced) {
        renderFrame(performance.now());
      }
    };

    loadScriptOnce("/scenes/stick.js")
      .then(() => loadScriptOnce("/scenes/margin-climber.js"))
      .then(() => {
        if (cancelled) return;
        resize();
        state.curProg = readTargetProgress();
        state.targetProg = state.curProg;
        renderFrame(performance.now());
        if (!reduced) {
          rafId = window.requestAnimationFrame(tick);
        }
        window.addEventListener("scroll", onScrollOrResize, { passive: true });
        window.addEventListener("resize", onScrollOrResize, { passive: true });
      })
      .catch(() => {
        // Decorative companion degrades silently if scripts fail
      });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [mounted, reduced]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-14 right-1 bottom-4 z-40 hidden w-[88px] lg:block xl:right-2 xl:w-[100px]"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
