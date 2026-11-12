import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import { alternatesOf, notFoundRoute, routes, type Route } from "./content";
import { profile } from "./content/types";

export const SITE = profile.site;

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function head(route: Route): string {
  const { content, view } = route;
  const url = SITE + route.path;
  if (view === "notFound") {
    return [`<title>Page not found: ${escapeHtml(content.hero.name)}</title>`, `<meta name="robots" content="noindex" />`].join(
      "\n    ",
    );
  }

  const title = escapeHtml(view === "cv" ? `${content.ui.cv}: ${content.hero.name}` : content.meta.title);
  const description = escapeHtml(content.meta.description);
  const person = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    inLanguage: content.lang,
    mainEntity: {
      "@type": "Person",
      name: content.hero.name,
      jobTitle: content.hero.role,
      url: `${SITE}/`,
      email: `mailto:${profile.email}`,
      sameAs: profile.links.map((link) => link.href),
      knowsLanguage: ["pt-BR", "en", "bzs"],
    },
  };

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    ...alternatesOf(route).map(
      (other) => `<link rel="alternate" hreflang="${other.content.lang}" href="${SITE + other.path}" />`,
    ),
    `<meta property="og:type" content="profile" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:locale" content="${content.locale === "pt" ? "pt_BR" : "en_US"}" />`,
    `<meta property="og:image" content="${SITE}/og.png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeHtml(`${content.hero.name}. ${content.hero.role}.`)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    ...(view === "home"
      ? [`<script type="application/ld+json">${JSON.stringify(person).replace(/</g, "\\u003c")}</script>`]
      : []),
  ].join("\n    ");
}

export interface RenderedPage {
  /** URL path, e.g. "/pt/cv/", or a file path such as "/404.html". */
  path: string;
  /** False for pages that must stay out of the sitemap. */
  indexable: boolean;
  lang: string;
  head: string;
  html: string;
}

export function renderAll(): RenderedPage[] {
  return [...routes, notFoundRoute].map((route) => ({
    path: route.path,
    indexable: route.view !== "notFound",
    lang: route.content.lang,
    head: head(route),
    html: renderToString(
      <StrictMode>
        <App route={route} />
      </StrictMode>,
    ),
  }));
}
