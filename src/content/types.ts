export type Locale = "en" | "pt";

export type ProjectTag = "accessibility" | "frontend" | "research" | "data";

export type SectionId = "about" | "experience" | "projects" | "skills" | "education" | "contact";

export interface Role {
  title: string;
  org: string;
  /** Machine-readable start, e.g. "2026-07". */
  start: string;
  /** Machine-readable end; omit while the role is current. */
  end?: string;
  /** Human-readable period in the page language. */
  period: string;
  highlights: string[];
  tools?: string[];
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  tags: ProjectTag[];
  href: string;
  /** Where the link leads, e.g. "Google Patents". Read out as part of the link. */
  source: string;
}

export interface Degree {
  title: string;
  school: string;
  period: string;
  note?: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Content {
  locale: Locale;
  /** BCP 47 tag for the `lang` attribute. */
  lang: string;
  path: string;
  meta: { title: string; description: string };
  ui: {
    skipToContent: string;
    primaryNav: string;
    languageSwitch: { label: string; href: string; hreflang: string; lang: string };
    darkTheme: string;
    preferences: string;
    filterLabel: string;
    filterAll: string;
    /** `{count}` is replaced with the number of visible projects. */
    filterStatus: string;
    toolsLabel: string;
    profiles: string;
    menu: string;
    close: string;
    emailMe: string;
    copyEmail: string;
    copyFailed: string;
    emailCopied: string;
    cv: string;
    cvPrint: string;
    cvBack: string;
    cvSummary: string;
    location: string;
  };
  nav: { id: SectionId; label: string }[];
  hero: {
    name: string;
    role: string;
    intro: string;
    portraitAlt: string;
    facts: { value: string; label: string }[];
  };
  about: { heading: string; paragraphs: string[] };
  experience: { heading: string; roles: Role[]; volunteeringHeading: string; volunteering: Role[] };
  projects: {
    heading: string;
    intro: string;
    tagLabels: Record<ProjectTag, string>;
    items: Project[];
  };
  skills: { heading: string; groups: SkillGroup[] };
  education: {
    heading: string;
    degrees: Degree[];
    coursesHeading: string;
    courses: string[];
    languagesHeading: string;
    languages: string[];
  };
  contact: { heading: string; body: string; emailLabel: string };
  footer: string;
}

export const profile = {
  email: "joaovictor.ne@gmail.com",
  links: [
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/joao-victor-araujo-lima/" },
    { id: "github", label: "GitHub", href: "https://github.com/xuaun" },
    { id: "frontendmentor", label: "Frontend Mentor", href: "https://www.frontendmentor.io/profile/xuaun" },
    { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@xuaun/" },
  ],
} as const;
