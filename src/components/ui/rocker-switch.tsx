/*
 * From Uiverse.io by r7chardgh - https://uiverse.io/r7chardgh/dry-rabbit-69
 * MIT License, Copyright (c) r7chardgh (Richard Tsang)
 *
 * Adapted to React/TypeScript with scoped CSS classes (.uiv-rocker-*)
 * to prevent style collisions while preserving the exact look, 3D bevels,
 * animation and behaviour.
 */
"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type RockerSwitchProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  ariaLabel?: string;
  className?: string;
};

export function RockerSwitch({
  checked,
  onChange,
  ariaLabel = "Ligar ou desligar a abertura do portfólio",
  className,
}: RockerSwitchProps) {
  return (
    <label className={cn("uiv-rocker-switch", className)}>
      <input
        className="uiv-rocker-cb"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={ariaLabel}
      />
      <span className="uiv-rocker-toggle" aria-hidden="true">
        <span className="uiv-rocker-left">off</span>
        <span className="uiv-rocker-right">on</span>
      </span>
    </label>
  );
}
