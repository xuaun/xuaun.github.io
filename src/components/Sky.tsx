import type { CSSProperties } from "react";

// Fixed positions (percent of the sky box) so server and client render the same stars.
const STARS: [left: number, top: number, size: number, opacity: number][] = [
  [6, 9, 2, 0.7],
  [14, 31, 1.5, 0.45],
  [23, 6, 1.5, 0.55],
  [31, 22, 2, 0.8],
  [38, 12, 1.5, 0.4],
  [47, 4, 2, 0.65],
  [52, 27, 1.5, 0.5],
  [61, 10, 2.5, 0.85],
  [68, 33, 1.5, 0.4],
  [74, 16, 2, 0.6],
  [81, 5, 1.5, 0.5],
  [87, 24, 2, 0.75],
  [93, 12, 1.5, 0.45],
  [97, 36, 2, 0.55],
];

/** The decorative backdrop behind the top of the page: dawn in light theme, dusk with stars in dark. */
export function Sky() {
  return (
    <div aria-hidden="true" className="sky">
      {STARS.map(([left, top, size, opacity], index) => (
        <i
          key={index}
          style={
            // CSSProperties has no index signature for custom properties, hence the cast.
            {
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              "--o": opacity,
              transitionDelay: `${index * 40}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
