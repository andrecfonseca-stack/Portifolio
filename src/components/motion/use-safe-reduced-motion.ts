"use client";

import * as React from "react";

/**
 * Hydration-safe hook for prefers-reduced-motion.
 * Always returns { reduced: false, mounted: false } during SSR and initial client hydration,
 * then synchronizes reactively with the user's OS setting on mount.
 */
export function useSafeMotion() {
  const [state, setState] = React.useState({ mounted: false, reduced: false });

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setState({ mounted: true, reduced: mq.matches });
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return state;
}
