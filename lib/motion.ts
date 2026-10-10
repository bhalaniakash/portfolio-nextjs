// Shared motion vocabulary. CSS mirrors these values in globals.css
// (--ease-out-expo, reveal durations) so GSAP, Motion and CSS feel alike.

export const ease = {
  /** Entrances: fast start, long settle. */
  out: "expo.out",
  /** Scroll-linked movement: linear progress maps directly to scroll. */
  scrub: "none",
  /** Elements that travel and land. */
  land: "power3.out",
  /** Elements leaving or receding. */
  in: "power2.in",
} as const;

export const duration = {
  quick: 0.35,
  base: 0.7,
  slow: 1.1,
} as const;

/** Scrub smoothing in seconds. Small enough to stay tied to the scroll. */
export const scrub = 0.6;

/**
 * Breakpoint conditions used with gsap.matchMedia(). Large spatial effects
 * only run on desktop without a reduced-motion preference.
 */
export const media = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  tablet: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;
