import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "react-aria-components";
import { profile, type Content, type Role } from "../content/types";
import { BoopLink } from "./BoopLink";
import { withMarks } from "../lib/marks";
import { useBurst } from "./Burst";
import { Icon } from "./Icon";

/**
 * A page section with a heading the sidebar links to. `tabIndex={-1}` lets the
 * skip link and in-page links move keyboard focus here, not only the scroll position.
 */
export function Section({ id, heading, children }: { id: string; heading: string; children: ReactNode }) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} tabIndex={-1} className="scroll-mt-8 py-12 first:pt-10 lg:py-16 lg:first:pt-16">
      <h2 id={headingId} className="brush-rule reveal mb-6 text-3xl font-extrabold tracking-tight">
        {heading}
      </h2>
      {children}
    </section>
  );
}

export function About({ content }: { content: Content }) {
  const { about, hero } = content;
  return (
    <>
      <div className="max-w-prose space-y-4">
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{withMarks(paragraph)}</p>
        ))}
      </div>
      <p className="mt-8 flex flex-wrap gap-3">
        <a
          href={`mailto:${profile.email}`}
          className="pushable pushable-primary inline-flex min-h-11 items-center gap-2 rounded-full border border-accent bg-accent-fill px-5 font-medium text-on-accent-fill"
        >
          <Icon name="mail" />
          {content.ui.emailMe}
        </a>
        <a
          href={`${content.path}cv/`}
          className="pushable inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-5 font-medium text-ink"
        >
          <Icon name="file-text" />
          {content.ui.cv}
        </a>
      </p>
      <dl className="mt-10 grid gap-6 @lg:grid-cols-3">
        {hero.facts.map((fact) => (
          <div key={fact.label} className="reveal flex flex-col gap-2 border-t-2 border-accent pt-4">
            <dt className="order-2 text-meta leading-snug text-muted">{fact.label}</dt>
            <dd className="order-1 font-display text-5xl font-extrabold leading-none tabular-nums">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

/** `as` keeps the outline honest: roles are h3 under a section, h4 under a subsection. */
export function RoleList({ roles, toolsLabel, as: Heading = "h3" }: { roles: Role[]; toolsLabel: string; as?: "h3" | "h4" }) {
  return (
    <ol className="space-y-10">
      {roles.map((role) => (
        <li key={`${role.org}-${role.start}`} className="grid gap-x-8 gap-y-2 @2xl:grid-cols-[11rem_minmax(0,1fr)]">
          <p className="pt-0.5 text-meta font-medium text-muted">
            <time dateTime={role.end ? `${role.start}/${role.end}` : role.start}>{role.period}</time>
          </p>
          <div>
            <Heading className="font-display text-xl font-bold leading-tight">{role.title}</Heading>
            <p className="mt-1 font-medium text-accent">{role.org}</p>
            <ul className="mt-3 max-w-prose list-disc space-y-2 pl-5 marker:text-accent-fill">
              {role.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            {role.tools && (
              <ul aria-label={toolsLabel} className="mt-4 flex flex-wrap gap-2">
                {role.tools.map((tool) => (
                  <li key={tool} className="rounded-full border border-line px-2.5 py-0.5 text-sm text-muted">
                    {tool}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Experience({ content }: { content: Content }) {
  const { experience, ui } = content;
  return (
    <>
      <RoleList roles={experience.roles} toolsLabel={ui.toolsLabel} />
      <h3 className="mb-6 mt-14 text-2xl font-extrabold tracking-tight">{experience.volunteeringHeading}</h3>
      <RoleList roles={experience.volunteering} toolsLabel={ui.toolsLabel} as="h4" />
    </>
  );
}

export function Skills({ content }: { content: Content }) {
  return (
    <div className="grid gap-x-8 gap-y-8 @xl:grid-cols-2">
      {content.skills.groups.map((group) => (
        <div key={group.label}>
          <h3 className="text-lg font-bold">{group.label}</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li key={item} className="rounded-full border border-line bg-surface px-3 py-1 text-meta">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Education({ content }: { content: Content }) {
  const { education } = content;
  return (
    <>
      <ol className="space-y-8">
        {education.degrees.map((degree) => (
          <li key={degree.title} className="grid gap-x-8 gap-y-2 @2xl:grid-cols-[11rem_minmax(0,1fr)]">
            <p className="pt-0.5 text-meta font-medium text-muted">{degree.period}</p>
            <div>
              <h3 className="text-xl font-bold">{degree.title}</h3>
              <p className="mt-1 font-medium text-accent">{degree.school}</p>
              {degree.note && <p className="mt-2 max-w-prose text-muted">{degree.note}</p>}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-12 grid gap-10 @xl:grid-cols-2">
        <div>
          <h3 className="text-lg font-bold">{education.coursesHeading}</h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 marker:text-accent-fill">
            {education.courses.map((course) => (
              <li key={course}>{course}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold">{education.languagesHeading}</h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 marker:text-accent-fill">
            {education.languages.map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function CopyEmail({ content }: { content: Content }) {
  const { ui } = content;
  const [outcome, setOutcome] = useState<"idle" | "copied" | "failed">("idle");
  const [burst, fireBurst] = useBurst();
  const copied = outcome === "copied";

  useEffect(() => {
    if (outcome === "idle") return;
    const id = window.setTimeout(() => setOutcome("idle"), 3000);
    return () => window.clearTimeout(id);
  }, [outcome]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // Browsers can deny clipboard access (permissions, insecure context).
      setOutcome("failed");
      return;
    }
    setOutcome("copied");
    fireBurst();
  };

  return (
    <>
      <Button
        onPress={copy}
        className="pushable inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-meta font-medium text-ink"
      >
        <span className="relative inline-flex size-[18px]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={copied ? "check" : "copy"}
              className="absolute inset-0 inline-flex"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0.3 }}
            >
              <Icon name={copied ? "check" : "copy"} />
            </motion.span>
          </AnimatePresence>
          {burst}
        </span>
        {ui.copyEmail}
      </Button>
      <span role="status" className="min-h-6 basis-full text-meta text-muted">
        {outcome === "copied" ? ui.emailCopied : outcome === "failed" ? ui.copyFailed : ""}
      </span>
    </>
  );
}

export function Contact({ content }: { content: Content }) {
  const { contact } = content;
  return (
    <>
      <p className="max-w-prose">{contact.body}</p>
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
        <BoopLink href={`mailto:${profile.email}`} icon="mail" className="font-display text-2xl font-bold text-accent">
          {profile.email}
        </BoopLink>
        <CopyEmail content={content} />
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-6 text-muted">
        <li>
          <BoopLink href={`${content.path}cv/`} icon="file-text">
            {content.ui.cv}
          </BoopLink>
        </li>
        {profile.links.map((link) => (
          <li key={link.id}>
            <BoopLink href={link.href}>
              {link.label}
            </BoopLink>
          </li>
        ))}
      </ul>
    </>
  );
}
