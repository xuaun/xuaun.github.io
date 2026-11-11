import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Link } from "react-aria-components";
import { useBoop } from "../lib/hooks";
import { Icon, type IconName } from "./Icon";

const boopSpring = { type: "spring", stiffness: 300, damping: 10 } as const;

/** An icon that gets a springy nudge while `isBooped` is true (see useBoop). */
export function BoopIcon({ name, size, isBooped }: { name: IconName; size?: number; isBooped: boolean }) {
  return (
    <motion.span
      className="inline-flex"
      animate={isBooped ? { x: 3, y: -3, rotate: 8 } : { x: 0, y: 0, rotate: 0 }}
      transition={boopSpring}
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
 * A text link whose trailing icon is nudged on mouse hover.
 * React Aria's hover events ignore touch, so the nudge never sticks on phones,
 * and MotionConfig drops the movement under prefers-reduced-motion.
 */
export function BoopLink({ href, children, icon = "arrow-up-right", className }: BoopLinkProps) {
  const [isBooped, boop] = useBoop();

  return (
    <Link
      href={href}
      onHoverStart={boop}
      className={`inline-flex min-h-11 items-center gap-1.5 transition-colors duration-150 hover:text-ink md:min-h-10 ${className ?? ""}`}
    >
      <span className="underline decoration-1 underline-offset-4 [a:hover_&]:decoration-accent-fill [a:hover_&]:decoration-2">
        {children}
      </span>
      <BoopIcon name={icon} size={16} isBooped={isBooped} />
    </Link>
  );
}
