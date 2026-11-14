import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionStyle, type MotionValue } from "motion/react";
import { useEffect } from "react";
import { springs } from "../lib/motion";

interface Star {
  /** Position as a percentage of the sky box. */
  left: number;
  top: number;
  /** Size in px. */
  size: number;
  opacity: number;
  /** Dots are the quiet majority; sparks are four-pointed and a few are warm. */
  kind: "dot" | "spark" | "warm-spark";
}

// Fixed, hand-placed positions so server and client render the same sky.
const STARS: Star[] = [
  { left: 6, top: 9, size: 2, opacity: 0.7, kind: "dot" },
  { left: 11, top: 24, size: 9, opacity: 0.8, kind: "spark" },
  { left: 17, top: 37, size: 1.5, opacity: 0.45, kind: "dot" },
  { left: 23, top: 6, size: 1.5, opacity: 0.55, kind: "dot" },
  { left: 29, top: 19, size: 11, opacity: 0.9, kind: "warm-spark" },
  { left: 35, top: 31, size: 2, opacity: 0.5, kind: "dot" },
  { left: 41, top: 11, size: 1.5, opacity: 0.4, kind: "dot" },
  { left: 47, top: 4, size: 8, opacity: 0.75, kind: "spark" },
  { left: 53, top: 27, size: 1.5, opacity: 0.5, kind: "dot" },
  { left: 59, top: 14, size: 2.5, opacity: 0.85, kind: "dot" },
  { left: 65, top: 34, size: 9, opacity: 0.7, kind: "warm-spark" },
  { left: 71, top: 8, size: 2, opacity: 0.6, kind: "dot" },
  { left: 77, top: 21, size: 12, opacity: 0.9, kind: "spark" },
  { left: 82, top: 5, size: 1.5, opacity: 0.5, kind: "dot" },
  { left: 87, top: 30, size: 2, opacity: 0.75, kind: "dot" },
  { left: 92, top: 13, size: 8, opacity: 0.7, kind: "warm-spark" },
  { left: 96, top: 38, size: 2, opacity: 0.55, kind: "dot" },
];

/** How close the cursor has to be, in px, before a star reacts. */
const REACH = 150;
/** How far a star is pushed, in px, when the cursor is right on top of it. */
const PUSH = 16;
const FAR_AWAY = -10_000;

interface Pointer {
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** Sky width and height in px, so percentages can be compared with the cursor. */
  width: MotionValue<number>;
  height: MotionValue<number>;
}

function SkyStar({ star, index, pointer }: { star: Star; index: number; pointer: Pointer }) {
  // 0 when the cursor is out of reach, 1 when it is on the star.
  const closeness = useTransform(() => {
    const dx = (star.left / 100) * pointer.width.get() - pointer.x.get();
    const dy = (star.top / 100) * pointer.height.get() - pointer.y.get();
    return Math.max(0, 1 - Math.hypot(dx, dy) / REACH);
  });
  // The star leans away from the cursor, further the closer it gets.
  const pushX = useTransform(() => {
    const dx = (star.left / 100) * pointer.width.get() - pointer.x.get();
    const dy = (star.top / 100) * pointer.height.get() - pointer.y.get();
    return (dx / (Math.hypot(dx, dy) || 1)) * PUSH * closeness.get() ** 2;
  });
  const pushY = useTransform(() => {
    const dx = (star.left / 100) * pointer.width.get() - pointer.x.get();
    const dy = (star.top / 100) * pointer.height.get() - pointer.y.get();
    return (dy / (Math.hypot(dx, dy) || 1)) * PUSH * closeness.get() ** 2;
  });
  const grow = useTransform(closeness, [0, 1], [1, star.kind === "dot" ? 2.2 : 1.5]);
  const turn = useTransform(closeness, [0, 1], [0, star.kind === "dot" ? 0 : 45]);

  // Springs give each star some weight: it overshoots a little and settles.
  const x = useSpring(pushX, springs.bouncy);
  const y = useSpring(pushY, springs.bouncy);
  const scale = useSpring(grow, springs.bouncy);
  const rotate = useSpring(turn, springs.bouncy);

  return (
    <motion.i
      className={star.kind === "dot" ? undefined : star.kind}
      style={
        // MotionStyle has no index signature for custom properties, hence the cast.
        {
          left: `${star.left}%`,
          top: `${star.top}%`,
          width: star.size,
          height: star.size,
          "--o": star.opacity,
          transitionDelay: `${index * 40}ms`,
          x,
          y,
          scale,
          rotate,
        } as MotionStyle
      }
    />
  );
}

/**
 * The decorative backdrop behind the top of the page: dawn in the light theme,
 * dusk with stars in the dark one. Stars near the cursor lean away and swell,
 * then spring back. Nothing moves on its own, on touch, or under reduced motion.
 */
export function Sky() {
  const reduceMotion = useReducedMotion();
  const pointer: Pointer = {
    x: useMotionValue(FAR_AWAY),
    y: useMotionValue(FAR_AWAY),
    width: useMotionValue(0),
    height: useMotionValue(0),
  };

  useEffect(() => {
    if (reduceMotion) return;
    const sky = document.querySelector<HTMLElement>(".sky");
    if (!sky) return;

    const measure = () => {
      pointer.width.set(sky.offsetWidth);
      pointer.height.set(sky.offsetHeight);
    };
    const follow = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      // The sky sits at the top of the page, so page coordinates are sky coordinates.
      pointer.x.set(event.pageX);
      pointer.y.set(event.pageY);
    };
    const leave = () => {
      pointer.x.set(FAR_AWAY);
      pointer.y.set(FAR_AWAY);
    };

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("pointermove", follow, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", follow);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
    // The motion values keep their identity for the life of the component, so they are not dependencies.
  }, [reduceMotion]);

  return (
    <div aria-hidden="true" className="sky">
      {STARS.map((star, index) => (
        <SkyStar key={index} star={star} index={index} pointer={pointer} />
      ))}
    </div>
  );
}
