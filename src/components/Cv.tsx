import type { ReactNode } from "react";
import { Button } from "react-aria-components";
import { profile, type Content, type Role } from "../content/types";
import { stripMarks } from "../lib/marks";
import { Icon } from "./Icon";

function CvSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="mt-8 print:mt-3.5">
      <h2 className="mb-3 border-b-2 border-accent pb-1 text-xl font-extrabold tracking-tight print:mb-1.5 print:pb-0.5 print:text-[11.5pt]">
        {heading}
      </h2>
      {children}
    </section>
  );
}

/**
 * Roles laid out for paper: title and dates share a line, bullets run the full
 * width, and the tool tags are dropped because the Skills section lists them.
 */
function CvRoles({ roles }: { roles: Role[] }) {
  return (
    <ol className="space-y-4 print:space-y-2">
      {roles.map((role) => (
        <li key={`${role.org}-${role.start}`} className="break-inside-avoid">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="font-display text-lg font-bold leading-tight print:text-[10.5pt]">
              {role.title}
              <span className="font-sans font-normal">, {role.org}</span>
            </h3>
            <p className="text-meta text-muted print:text-[9pt]">
              <time dateTime={role.end ? `${role.start}/${role.end}` : role.start}>{role.period}</time>
            </p>
          </div>
          <ul className="mt-1 list-disc space-y-1 pl-5 print:mt-0.5 print:space-y-0">
            {role.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

/**
 * A one-column résumé generated from the same data as the portfolio.
 * Visitors save it as PDF from the browser's print dialog, so it never
 * drifts from the site and carries no phone number.
 */
export function Cv({ content }: { content: Content }) {
  const { hero, about, experience, skills, education, ui } = content;

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 print:max-w-none print:p-0 print:text-[9.5pt] print:leading-[1.35]">
      <nav aria-label={ui.cv} className="mb-8 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <a href={content.path} className="inline-flex min-h-11 items-center gap-2 font-medium text-ink">
          <Icon name="arrow-left" />
          <span className="underline decoration-1 underline-offset-4">{ui.cvBack}</span>
        </a>
        <a
          href={`${ui.languageSwitch.href}cv/`}
          lang={ui.languageSwitch.lang}
          hrefLang={ui.languageSwitch.hreflang}
          className="pushable ml-auto inline-flex min-h-11 items-center rounded-full border border-line-strong bg-surface px-4 text-meta font-medium text-ink"
        >
          {ui.languageSwitch.label}
        </a>
        <Button
          onPress={() => window.print()}
          className="pushable inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-surface px-5 font-medium text-ink"
        >
          <Icon name="printer" />
          {ui.cvPrint}
        </Button>
      </nav>

      <main id="main" tabIndex={-1}>
        <header>
          <h1 className="w-fit text-4xl font-extrabold tracking-tight [view-transition-name:site-name] print:text-2xl">{hero.name}</h1>
          <p className="mt-2 font-display text-xl font-semibold text-accent print:text-base">{hero.role}</p>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-meta text-muted print:text-[9.5pt]">
            <li>{ui.location}</li>
            <li>
              <a className="link" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </li>
            <li>
              <a className="link" href="https://xuaun.github.io/">
                xuaun.github.io
              </a>
            </li>
            {profile.links.slice(0, 2).map((link) => (
              <li key={link.id}>
                <a className="link" href={link.href}>
                  {link.href.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "")}
                </a>
              </li>
            ))}
          </ul>
        </header>

        <CvSection heading={ui.cvSummary}>
          <div className="space-y-2 print:space-y-1">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{stripMarks(paragraph)}</p>
            ))}
          </div>
        </CvSection>

        <CvSection heading={skills.heading}>
          <dl className="space-y-1.5 print:space-y-0.5">
            {skills.groups.map((group) => (
              <div key={group.label}>
                <dt className="inline font-bold">{group.label}: </dt>
                <dd className="inline">{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </CvSection>

        <CvSection heading={experience.heading}>
          <CvRoles roles={experience.roles} />
        </CvSection>

        <CvSection heading={experience.volunteeringHeading}>
          <CvRoles roles={experience.volunteering} />
        </CvSection>

        <CvSection heading={education.heading}>
          <ul className="space-y-3 print:space-y-1.5">
            {education.degrees.map((degree) => (
              <li key={degree.title} className="break-inside-avoid">
                <h3 className="font-display text-lg font-bold leading-tight print:text-[10.5pt]">{degree.title}</h3>
                <p>
                  {degree.school} · {degree.period}
                </p>
                {degree.note && <p className="text-muted">{degree.note}</p>}
              </li>
            ))}
          </ul>
        </CvSection>

        <CvSection heading={education.coursesHeading}>
          <ul className="list-disc space-y-1 pl-5 print:columns-2 print:space-y-0">
            {education.courses.map((course) => (
              <li key={course}>{course}</li>
            ))}
          </ul>
        </CvSection>

        <CvSection heading={education.languagesHeading}>
          <p>{education.languages.join(" · ")}</p>
        </CvSection>
      </main>
    </div>
  );
}
