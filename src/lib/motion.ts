/**
 * The site's three springs. Every Motion animation uses one of these, so
 * movement feels like it comes from one hand.
 */
export const springs = {
  /** Follows the cursor: settles fast, never overshoots. */
  snappy: { type: "spring", duration: 0.25, bounce: 0 },
  /** State changes: indicators, filters, icon swaps. A slight overshoot. */
  smooth: { type: "spring", duration: 0.45, bounce: 0.2 },
  /** Playful nudges on rare hovers: the boop. */
  bouncy: { type: "spring", stiffness: 300, damping: 10 },
} as const;
