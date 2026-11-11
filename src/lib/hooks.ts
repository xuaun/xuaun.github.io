import { useCallback, useEffect, useState } from "react";

/**
 * Tracks which section is currently being read, for the sidebar indicator.
 * Sections are observed against a thin line 30% down the viewport, so a
 * section becomes active when its heading reaches reading position, and
 * exactly one section crosses the line at a time.
 */
export function useActiveSection<T extends string>(ids: readonly T[]): T | null {
  const [active, setActive] = useState<T | null>(null);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // At a boundary two sections can touch the line; the later one is being entered.
        setActive(ids.findLast((id) => visible.has(id)) ?? null);
      },
      { rootMargin: "-30% 0px -69% 0px" },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

type Theme = "light" | "dark";

function resolveTheme(): Theme {
  const saved = document.documentElement.dataset.theme;
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * The theme follows the system until the visitor picks one; the choice is then
 * stored and applied before first paint by the inline script in index.html.
 * `isDark` is null until mounted so server and client markup match.
 */
export function useTheme(): { isDark: boolean | null; setDark: (dark: boolean) => void } {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    setIsDark(resolveTheme() === "dark");
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setIsDark(resolveTheme() === "dark");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const setDark = useCallback((dark: boolean) => {
    const theme: Theme = dark ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Storage can be blocked (private mode); the theme still applies for this visit.
    }
    setIsDark(dark);
  }, []);

  return { isDark, setDark };
}

/**
 * "Boop": a brief nudge that springs back, after Josh W. Comeau's pattern.
 * Returns the current state and a trigger to call on hover.
 */
export function useBoop(durationMs = 150): [boolean, () => void] {
  const [isBooped, setIsBooped] = useState(false);

  useEffect(() => {
    if (!isBooped) return;
    const id = window.setTimeout(() => setIsBooped(false), durationMs);
    return () => window.clearTimeout(id);
  }, [isBooped, durationMs]);

  const trigger = useCallback(() => setIsBooped(true), []);
  return [isBooped, trigger];
}

/**
 * Fades in `.reveal` elements the first time they scroll into view.
 * Only elements that start below the fold are hidden, and only after hydration,
 * so the prerendered page is fully readable without JavaScript.
 */
export function useScrollReveal(): void {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pending = new Set(
      [...document.querySelectorAll<HTMLElement>(".reveal")].filter(
        (el) => el.getBoundingClientRect().top > window.innerHeight,
      ),
    );
    if (pending.size === 0) return;

    const observer = new IntersectionObserver(
      () => {
        // Sweep everything at or above the fold, not only the reported entries:
        // an in-page jump can carry elements past the viewport without them ever intersecting.
        for (const el of pending) {
          if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
            el.dataset.reveal = "in";
            pending.delete(el);
            observer.unobserve(el);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    for (const el of pending) {
      el.dataset.reveal = "out";
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
      for (const el of document.querySelectorAll<HTMLElement>(".reveal[data-reveal]")) delete el.dataset.reveal;
    };
  }, []);
}
