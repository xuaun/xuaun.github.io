import { en } from "./en";
import { pt } from "./pt";
import type { Content } from "./types";

export type View = "home" | "cv";

export interface Route {
  /** URL path with a trailing slash, e.g. "/pt/cv/". */
  path: string;
  view: View;
  content: Content;
}

export const routes: Route[] = [en, pt].flatMap((content): Route[] => [
  { path: content.path, view: "home", content },
  { path: `${content.path}cv/`, view: "cv", content },
]);

/** Only prerendered paths are served in production; the dev server falls back to the home page for anything else. */
export function routeForPath(pathname: string): Route {
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return routes.find((route) => route.path === normalized) ?? routes[0]!;
}

/** The same view in the other languages, for hreflang and the language switch. */
export function alternatesOf(route: Route): Route[] {
  return routes.filter((other) => other.view === route.view);
}
