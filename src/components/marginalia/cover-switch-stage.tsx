"use client";

import * as React from "react";
import { RockerSwitch } from "@/components/ui/rocker-switch";
import { useSafeMotion } from "@/components/motion/use-safe-reduced-motion";

type SwitchOpenerApi = {
  drawSwitchOpener: (
    g: CanvasRenderingContext2D,
    opts: {
      T: number;
      t: number;
      xStart: number;
      xPress: number;
      y: number;
      scale: number;
      ink: string;
      far: string;
      pen: string;
    },
  ) => void;
  FLIP_AT_SEC: number;
};

declare global {
  interface Window {
    SWITCH_OPENER?: SwitchOpenerApi;
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

/**
 * Opening stage where the hand-drawn stickman walks up to the 3D Uiverse rocker switch
 * and physically presses the "ON" side, flipping the switch and triggering the sequential cover reveal.
 */
export function CoverSwitchStage({
  isOn,
  onToggle,
  playKey,
}: {
  isOn: boolean;
  onToggle: (next: boolean) => void;
  playKey: number;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const { mounted, reduced } = useSafeMotion();
  const flippedRef = React.useRef(false);
  const onToggleRef = React.useRef(onToggle);

  React.useEffect(() => {
    onToggleRef.current = onToggle;
  }, [onToggle]);

  React.useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let rafId = 0;
    flippedRef.current = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    };

    const startTime = performance.now();

    const drawFrame = (now: number) => {
      const api = window.SWITCH_OPENER;
      if (!api) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = canvas.width / rect.width;

      const elapsed = (now - startTime) / 1000;
      const T = reduced ? 2.2 : elapsed;

      if (!reduced && !flippedRef.current && T >= api.FLIP_AT_SEC) {
        flippedRef.current = true;
        onToggleRef.current(true);
      }

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Hand-drawn ground baseline beneath the stickman
      ctx.strokeStyle = "rgba(31, 30, 28, 0.22)";
      ctx.lineWidth = 1.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(8, rect.height - 6);
      ctx.lineTo(rect.width - 6, rect.height - 6);
      ctx.stroke();

      api.drawSwitchOpener(ctx, {
        T,
        t: elapsed,
        xStart: 28,
        xPress: rect.width - 36,
        y: rect.height - 6,
        scale: 0.7,
        ink: "#1F1E1C",
        far: "#746E65",
        pen: "#A93F21",
      });

      ctx.restore();
    };

    const tick = (now: number) => {
      if (cancelled) return;
      drawFrame(now);
      if (!reduced) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    loadScriptOnce("/scenes/stick.js")
      .then(() => loadScriptOnce("/scenes/switch-opener.js"))
      .then(() => {
        if (cancelled) return;
        resize();
        drawFrame(performance.now());
        if (reduced) {
          onToggleRef.current(true);
        } else {
          rafId = window.requestAnimationFrame(tick);
        }
        window.addEventListener("resize", resize, { passive: true });
      })
      .catch(() => {
        // Fallback: ensure the cover still turns ON even if script fails
        onToggleRef.current(true);
      });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [mounted, reduced, playKey]);

  return (
    <div className="relative z-[3] flex items-end justify-center gap-0">
      {/* Stickman canvas positioned right beside the 3D rocker switch */}
      <div
        aria-hidden="true"
        className="pointer-events-none -mr-3 h-[96px] w-[124px] shrink-0"
      >
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>

      {/* Physical 3D Uiverse Rocker Switch aligned to the stickman's pressing hand */}
      <div className="mb-8 flex flex-col items-center gap-1.5">
        <RockerSwitch
          checked={isOn}
          onChange={onToggle}
          ariaLabel="Interruptor da apresentação inicial do portfólio"
        />
      </div>
    </div>
  );
}
