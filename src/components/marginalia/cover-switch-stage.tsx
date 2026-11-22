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
      isOn: boolean;
      xPress: number;
      y: number;
      scale: number;
      ink: string;
      far: string;
      pen: string;
    },
  ) => void;
};

declare global {
  interface Window {
    SWITCH_OPENER?: SwitchOpenerApi;
  }
}

function loadScriptOnce(src: string): Promise<void> {
  if (typeof window !== "undefined") {
    if (src.endsWith("/stick.js") && window.RIG) return Promise.resolve();
    if (src.endsWith("/switch-opener.js") && window.SWITCH_OPENER) {
      return Promise.resolve();
    }
  }
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`,
    );
    if (existing) {
      if (
        existing.dataset.loaded === "true" ||
        (src.endsWith("/stick.js") && window.RIG) ||
        (src.endsWith("/switch-opener.js") && window.SWITCH_OPENER)
      ) {
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
 * Stickman + 3D Uiverse Rocker Switch.
 * The lightbulb ONLY appears after the user clicks/presses the switch button to turn it ON!
 * When the switch is OFF, the stickman waits calmly with NO lightbulb.
 */
export function CoverSwitchStage({
  isOn,
  onToggle,
}: {
  isOn: boolean;
  onToggle: (next: boolean) => void;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const { mounted, reduced } = useSafeMotion();
  const isOnRef = React.useRef(isOn);
  const pressedAtRef = React.useRef<number>(0);

  React.useEffect(() => {
    isOnRef.current = isOn;
    if (isOn) {
      pressedAtRef.current = performance.now();
    }
  }, [isOn]);

  React.useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let rafId = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    };

    const mountTime = performance.now();

    const drawFrame = (now: number) => {
      const api = window.SWITCH_OPENER;
      if (!api) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = canvas.width / rect.width;

      const t = (now - mountTime) / 1000;
      const activeOn = isOnRef.current;
      const T = activeOn
        ? reduced
          ? 2.2
          : Math.max(0, (now - pressedAtRef.current) / 1000)
        : 0;

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Hand-drawn ground baseline beneath the stickman
      ctx.strokeStyle = "rgba(31, 30, 28, 0.24)";
      ctx.lineWidth = 1.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(6, rect.height - 6);
      ctx.lineTo(rect.width - 4, rect.height - 6);
      ctx.stroke();

      api.drawSwitchOpener(ctx, {
        T,
        t,
        isOn: activeOn,
        xPress: rect.width - 36,
        y: rect.height - 6,
        scale: 0.68,
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
        if (!reduced) {
          rafId = window.requestAnimationFrame(tick);
        }
        window.addEventListener("resize", resize, { passive: true });
      })
      .catch(() => {
        // Fallback if canvas scripts fail
      });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [mounted, reduced]);

  return (
    <div className="relative z-[3] flex flex-col items-center">
      <div className="flex items-end justify-center gap-0">
        <div
          aria-hidden="true"
          className="pointer-events-none -mr-3 h-[118px] w-[124px] shrink-0"
        >
          <canvas ref={canvasRef} className="h-full w-full" />
        </div>

        <div className="mb-7 flex flex-col items-center">
          <RockerSwitch
            checked={isOn}
            onChange={onToggle}
            ariaLabel="Interruptor da apresentação inicial do portfólio"
          />
        </div>
      </div>

      <span className="mt-0.5 text-[11px] font-medium tracking-[0.06em] uppercase text-[var(--muted)]">
        {isOn ? "interruptor ligado" : "aperte o botão para iniciar"}
      </span>
    </div>
  );
}
