import { motion, useReducedMotion } from "motion/react";
import { useCallback, useState } from "react";

const COLORS = ["var(--accent-fill)", "var(--accent)", "var(--ink)"];
const PARTICLES = 10;

interface Particle {
  x: number;
  y: number;
  rotate: number;
  color: string;
  width: number;
}

function makeParticles(): Particle[] {
  return Array.from({ length: PARTICLES }, (_, index) => {
    // Spread evenly around the circle, then jitter so it never looks mechanical.
    const angle = (index / PARTICLES) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const distance = 30 + Math.random() * 22;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      rotate: (angle * 180) / Math.PI,
      color: COLORS[index % COLORS.length]!,
      width: 6 + Math.random() * 6,
    };
  });
}

/**
 * A short burst of brush-dash particles for rare, deliberate actions
 * (switching theme, copying the email). Purely decorative: hidden from
 * assistive tech, unable to take clicks, and skipped entirely when the
 * visitor prefers reduced motion.
 */
export function useBurst() {
  const reduceMotion = useReducedMotion();
  const [bursts, setBursts] = useState<{ id: number; particles: Particle[] }[]>([]);

  const fire = useCallback(() => {
    if (reduceMotion) return;
    setBursts((current) => [...current, { id: Date.now(), particles: makeParticles() }]);
  }, [reduceMotion]);

  const element = (
    <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 select-none">
      {bursts.map((burst) =>
        burst.particles.map((particle, index) => (
          <motion.span
            key={`${burst.id}-${index}`}
            className="absolute -left-1 -top-0.5 h-1 rounded-full"
            style={{ width: particle.width, backgroundColor: particle.color, rotate: particle.rotate }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
            animate={{ x: particle.x, y: particle.y, opacity: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1], opacity: { duration: 0.6, ease: "easeIn" } }}
            onAnimationComplete={
              index === 0 ? () => setBursts((current) => current.filter((item) => item.id !== burst.id)) : undefined
            }
          />
        )),
      )}
    </span>
  );

  return [element, fire] as const;
}
