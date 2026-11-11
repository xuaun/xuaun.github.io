import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ToggleButton } from "react-aria-components";
import portrait from "../assets/portrait.webp";
import { profile, type Content, type SectionId } from "../content/types";
import { useTheme } from "../lib/hooks";
import { BoopLink } from "./BoopLink";
import { useBurst } from "./Burst";
import { Icon } from "./Icon";

const indicatorSpring = { type: "spring", duration: 0.45, bounce: 0.25 } as const;
// Hover follows the cursor many times a minute, so it settles fast and never overshoots.
const hoverSpring = { type: "spring", duration: 0.25, bounce: 0 } as const;

function SectionNav({ content, active }: { content: Content; active: SectionId | null }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <nav aria-label={content.ui.primaryNav} className="hidden md:block">
      <ul className="flex flex-col" onPointerLeave={() => setHovered(null)}>
        {content.nav.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setHovered(item.id);
                }}
                className={`relative flex min-h-10 items-center pl-6 pr-3 font-display text-meta font-semibold transition-colors duration-150 ${
                  isActive || hovered === item.id ? "text-ink" : "text-muted"
                }`}
              >
                {hovered === item.id && (
                  <motion.span
                    layoutId="nav-hover"
                    aria-hidden="true"
                    className="absolute inset-y-1 left-3 right-0 bg-accent-soft"
                    style={{ borderRadius: 8 }}
                    transition={hoverSpring}
                  />
                )}
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    aria-hidden="true"
                    className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 bg-accent"
                    style={{ borderRadius: 2 }}
                    transition={indicatorSpring}
                  />
                )}
                <span className="relative">{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function ThemeToggle({ label }: { label: string }) {
  const { isDark, setDark } = useTheme();
  const [burst, fireBurst] = useBurst();

  return (
    <ToggleButton
      isSelected={isDark === true}
      onChange={(dark) => {
        setDark(dark);
        fireBurst();
      }}
      className="pushable relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-meta font-medium text-ink data-[selected]:bg-ink data-[selected]:text-bg"
    >
      <span className="relative inline-flex size-[18px]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            className="absolute inset-0 inline-flex"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
          >
            <Icon name={isDark ? "moon" : "sun"} />
          </motion.span>
        </AnimatePresence>
        {burst}
      </span>
      {label}
    </ToggleButton>
  );
}

function Portrait({ alt }: { alt: string }) {
  return (
    <img
      src={portrait}
      alt={alt}
      width={96}
      height={96}
      className="size-24 shrink-0 rounded-full bg-white shadow-raised md:size-20 lg:size-[4.5rem]"
    />
  );
}

export function Sidebar({ content, active }: { content: Content; active: SectionId | null }) {
  const { hero, ui } = content;

  return (
    <header
      id="top"
      className="sidebar flex flex-col gap-5 py-8"
    >
      <div>
        {/* Stacked where the column is narrow, side by side once the name fits next to the portrait. */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <Portrait alt={hero.portraitAlt} />
          <h1 className="text-[clamp(2rem,4.4vw,2.375rem)] font-extrabold tracking-tight [view-transition-name:site-name]">
          <span className="relative inline-block">
            {hero.name}
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 300 14"
              preserveAspectRatio="none"
              className="pointer-events-none absolute -bottom-2 left-0 h-3 w-full text-accent-fill"
            >
              <path
                className="brush-draw"
                pathLength="1"
                d="M3 9 C 60 2, 120 12, 175 6 S 265 3, 297 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
            </span>
          </h1>
        </div>
        <p className="mt-5 font-display text-xl font-semibold leading-snug text-accent md:text-lg lg:text-xl">
          {hero.role}
        </p>
        <p className="mt-3 max-w-prose text-muted md:max-lg:hidden">{hero.intro}</p>
      </div>

      <SectionNav content={content} active={active} />

      <div className="flex flex-col gap-2 md:mt-auto">
        <div role="group" aria-label={ui.preferences} className="flex flex-wrap items-center gap-3 pb-1">
          <ThemeToggle label={ui.darkTheme} />
          <a
            href={ui.languageSwitch.href}
            lang={ui.languageSwitch.lang}
            hrefLang={ui.languageSwitch.hreflang}
            className="pushable inline-flex min-h-11 items-center rounded-full border border-line-strong bg-surface px-4 text-meta font-medium text-ink"
          >
            {ui.languageSwitch.label}
          </a>
        </div>
        <nav aria-label={ui.profiles}>
          <ul className="flex flex-wrap gap-x-5 text-meta text-muted">
            <li>
              <BoopLink href={`${content.path}cv/`} icon="file-text">
                {ui.cv}
              </BoopLink>
            </li>
            {/* The sidebar keeps the two main profiles; the Contact section lists all of them. */}
            {profile.links.slice(0, 2).map((link) => (
              <li key={link.id}>
                <BoopLink href={link.href}>{link.label}</BoopLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
