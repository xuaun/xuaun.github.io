import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { routeForPath } from "./content";
import "./styles.css";

const container = document.getElementById("root")!;
const route = routeForPath(window.location.pathname);
const app = (
  <StrictMode>
    <App route={route} />
  </StrictMode>
);

// The template leaves a comment placeholder in #root, so test for elements, not nodes.
if (container.firstElementChild) {
  // Production: the HTML was prerendered, so attach to it.
  hydrateRoot(container, app);
} else {
  // Dev server: nothing was prerendered, so set what the prerender step would have.
  document.documentElement.lang = route.content.lang;
  document.title = route.content.meta.title;
  createRoot(container).render(app);
}
