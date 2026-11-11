import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import { alternatesOf, routes, type Route } from "./content";
import { profile } from "./content/types";

const SITE = "https://xuaun.github.io";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function head(route: Route): string {
  const { content, view } = route;
  const url = SITE + route.path;
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
    `<meta name="twitter:card" content="summary" />`,
    ...(view === "home"
      ? [`<script type="application/ld+json">${JSON.stringify(person).replace(/</g, "\\u003c")}</script>`]
      : []),
  ].join("\n    ");
}

export interface RenderedPage {
  path: string;
  lang: string;
  head: string;
  html: string;
}

export function renderAll(): RenderedPage[] {
  return routes.map((route) => ({
    path: route.path,
    lang: route.content.lang,
    head: head(route),
    html: renderToString(
      <StrictMode>
        <App route={route} />
      </StrictMode>,
    ),
  }));
}
