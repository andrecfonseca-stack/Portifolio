export const MOTION_DURATION = {
  micro: 0.18,
  ui: 0.38,
  editorial: 0.72,
  ink: 0.85,
} as const;

export const MOTION_EASE = {
  editorial: [0.22, 1, 0.36, 1] as const,
  ink: [0.45, 0, 0.2, 1] as const,
} as const;

export const MOTION_SPRING = {
  tactile: {
    type: "spring" as const,
    stiffness: 260,
    damping: 24,
    mass: 0.8,
  },
};

export const VIEWPORT_ONCE = {
  once: true,
  amount: 0.22,
} as const;
