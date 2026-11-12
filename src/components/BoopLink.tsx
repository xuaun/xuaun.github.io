import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { Link } from "react-aria-components";
import { useBoop } from "../lib/hooks";
import { springs } from "../lib/motion";
import { Icon, type IconName } from "./Icon";

// The arrow at rest, and stretched: the shaft reaches further while the head
// gets narrower, so it reads as being pulled rather than merely moved.
const ARROW = {
  rest: { shaft: "M7 17 17 7", head: "M8 7h9v9" },
  stretched: { shaft: "M7 17 20 4", head: "M12.5 4h7.5v7.5" },
};

function StretchArrow({ size = 16, isBooped }: { size?: number; isBooped: boolean }) {
  // MotionConfig's reduced-motion handling covers transforms, not path morphs.
  const reduceMotion = useReducedMotion();
  const shape = isBooped && !reduceMotion ? ARROW.stretched : ARROW.rest;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 overflow-visible"
    >
      <motion.path initial={false} animate={{ d: shape.shaft }} transition={springs.bouncy} />
      <motion.path initial={false} animate={{ d: shape.head }} transition={springs.bouncy} />
    </svg>
  );
}

/** An icon that reacts while `isBooped` is true (see useBoop): arrows stretch, other icons get a nudge. */
export function BoopIcon({ name, size, isBooped }: { name: IconName; size?: number; isBooped: boolean }) {
  if (name === "arrow-up-right") return <StretchArrow size={size} isBooped={isBooped} />;

  return (
    <motion.span
      className="inline-flex"
      animate={isBooped ? { y: -2, rotate: 8 } : { y: 0, rotate: 0 }}
      transition={springs.bouncy}
    >
      <Icon name={name} size={size} />
    </motion.span>
  );
}

interface BoopLinkProps {
  href: string;
  children: ReactNode;
  icon?: IconName;
  className?: string;
}

/**
 * A text link whose trailing icon reacts on mouse hover.
 * React Aria's hover events ignore touch, so the effect never sticks on phones.
 */
export function BoopLink({ href, children, icon = "arrow-up-right", className }: BoopLinkProps) {
  const [isBooped, boop] = useBoop();

  return (
    <Link
      href={href}
      onHoverStart={boop}
      className={`inline-flex min-h-11 items-center gap-1.5 transition-colors duration-150 hover:text-ink md:min-h-10 ${className ?? ""}`}
    >
      <span className="link-paint underline decoration-1 underline-offset-4">{children}</span>
      <BoopIcon name={icon} size={16} isBooped={isBooped} />
    </Link>
  );
}
