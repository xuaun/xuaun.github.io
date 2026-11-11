import type { ReactNode } from "react";

/**
 * Content strings can flag a key phrase as ==like this==. On the portfolio the
 * phrase becomes a <mark> that is painted in as it scrolls into view; anywhere
 * plain text is needed (the résumé), stripMarks removes the markers.
 */
const MARK = /==(.+?)==/g;

export function withMarks(text: string): ReactNode[] {
  return text.split(MARK).map((part, index) =>
    // split() with one capture group alternates: plain, marked, plain, …
    index % 2 === 1 ? (
      <mark key={index} className="paint">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export function stripMarks(text: string): string {
  return text.replace(MARK, "$1");
}
