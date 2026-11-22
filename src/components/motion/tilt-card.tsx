"use client";

import * as React from "react";
import { m, useMotionValue, useSpring } from "motion/react";
import { MOTION_SPRING } from "./tokens";
import { useSafeMotion } from "./use-safe-reduced-motion";
import { cn } from "@/lib/cn";

/**
 * Selective 3D tilt wrapper for tactile project artifacts.
 * Strictly active on fine pointers (desktop) after hydration and disabled under prefers-reduced-motion.
 */
export function InteractiveTilt3D({
  children,
  className,
  maxRotate = 7,
}: {
  children: React.ReactNode;
  className?: string;
  maxRotate?: number;
}) {
  const { mounted, reduced } = useSafeMotion();
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, MOTION_SPRING.tactile);
  const rotateY = useSpring(rawRotateY, MOTION_SPRING.tactile);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width - 0.5;
    const dy = (e.clientY - rect.top) / rect.height - 0.5;
    rawRotateY.set(dx * maxRotate * 2);
    rawRotateX.set(-dy * maxRotate * 1.6);
  };

  const handlePointerLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
  };

  return (
    <div style={{ perspective: "1200px" }} className={cn("w-full", className)}>
      <m.div
        style={
          mounted && !reduced
            ? {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }
            : undefined
        }
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="will-change-transform"
      >
        {children}
      </m.div>
    </div>
  );
}
