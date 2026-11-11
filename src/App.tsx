import { MotionConfig } from "motion/react";
import { useMemo, type ComponentType } from "react";
import { Cv } from "./components/Cv";
import { MobileMenu } from "./components/MobileMenu";
import { Projects } from "./components/Projects";
import { About, Contact, Education, Experience, Section, Skills } from "./components/Sections";
import { Sidebar } from "./components/Sidebar";
import { Sky } from "./components/Sky";
import type { Route } from "./content";
import type { Content, SectionId } from "./content/types";
import { useActiveSection, usePaintOnView, useScrollReveal } from "./lib/hooks";

const sectionBody: Record<SectionId, ComponentType<{ content: Content }>> = {
  about: About,
  experience: Experience,
  projects: Projects,
  skills: Skills,
  education: Education,
  contact: Contact,
};

function Home({ content }: { content: Content }) {
  useScrollReveal();
  usePaintOnView();
  const sectionIds = useMemo(() => content.nav.map((item) => item.id), [content.nav]);
  const active = useActiveSection(sectionIds);

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 md:grid md:grid-cols-[clamp(14.5rem,30vw,22rem)_minmax(0,1fr)] md:gap-10 lg:gap-16">
      <MobileMenu content={content} active={active} />
      <Sidebar content={content} active={active} />

      {/* A container, so the grids inside respond to this column's width rather than the viewport's. */}
      <div className="@container">
        <main id="main" tabIndex={-1}>
          {content.nav.map((item) => {
            const Body = sectionBody[item.id];
            return (
              <Section key={item.id} id={item.id} heading={item.label}>
                <Body content={content} />
              </Section>
            );
          })}
        </main>
        <footer className="border-t border-line py-8 text-meta text-muted">
          <p>{content.footer}</p>
        </footer>
      </div>
    </div>
  );
}

export function App({ route }: { route: Route }) {
  const { content, view } = route;

  return (
    // reducedMotion="user": under prefers-reduced-motion, Motion keeps opacity
    // and colour changes but drops every transform and layout animation.
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-(--z-skip) focus:rounded-md focus:bg-ink focus:px-4 focus:py-3 focus:font-medium focus:text-bg print:hidden"
      >
        {content.ui.skipToContent}
      </a>
      <Sky />
      {view === "cv" ? <Cv content={content} /> : <Home content={content} />}
    </MotionConfig>
  );
}
