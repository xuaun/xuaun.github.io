import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { ToggleButton, ToggleButtonGroup, type Key } from "react-aria-components";
import type { Content, Project, ProjectTag } from "../content/types";
import { useBoop } from "../lib/hooks";
import { BoopIcon } from "./BoopLink";

type Filter = "all" | ProjectTag;

const pillSpring = { type: "spring", duration: 0.4, bounce: 0.2 } as const;
const cardSpring = { type: "spring", duration: 0.45, bounce: 0.15 } as const;

function ProjectCard({ project, tagLabels }: { project: Project; tagLabels: Record<ProjectTag, string> }) {
  const [isBooped, boop] = useBoop();

  return (
    <article
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") boop();
      }}
      onPointerMove={(event) => {
        // Written straight to the element: a glow that tracks the cursor must not re-render React.
        const box = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--glow-x", `${event.clientX - box.left}px`);
        event.currentTarget.style.setProperty("--glow-y", `${event.clientY - box.top}px`);
      }}
      className="card relative flex h-full flex-col gap-3 bg-surface p-5 has-[a:focus-visible]:outline has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-ink"
      style={{ borderRadius: 14 }}
    >
      <h3 className="text-xl font-bold">
        {/* The stretched pseudo-element makes the whole card the click target. */}
        <a href={project.href} className="outline-none after:absolute after:inset-0 after:content-['']">
          {project.title}
        </a>
      </h3>
      <p className="text-muted">{project.summary}</p>
      <ul className="mt-auto flex flex-wrap gap-2 pt-2">
        {project.tags.map((tag) => (
          <li key={tag} className="rounded-full bg-accent-soft px-2.5 py-0.5 text-sm font-medium text-ink">
            {tagLabels[tag]}
          </li>
        ))}
      </ul>
      <p className="flex items-center gap-1.5 text-sm font-medium text-accent">
        {project.source}
        <BoopIcon name="arrow-up-right" size={15} isBooped={isBooped} />
      </p>
    </article>
  );
}

export function Projects({ content }: { content: Content }) {
  const { projects, ui } = content;
  const [filter, setFilter] = useState<Filter>("all");
  const pillId = useId();

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: ui.filterAll },
    ...(Object.keys(projects.tagLabels) as ProjectTag[]).map((tag) => ({ id: tag, label: projects.tagLabels[tag] })),
  ];
  const visible = filter === "all" ? projects.items : projects.items.filter((item) => item.tags.includes(filter));

  return (
    <>
      <p className="max-w-prose text-muted">{projects.intro}</p>

      <ToggleButtonGroup
        aria-label={ui.filterLabel}
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[filter]}
        onSelectionChange={(keys: Set<Key>) => {
          const [next] = keys;
          if (next !== undefined) setFilter(next as Filter);
        }}
        className="mt-6 flex flex-wrap gap-2"
      >
        {filters.map((item) => (
          <ToggleButton
            key={item.id}
            id={item.id}
            className="relative inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line-strong bg-surface px-4 text-meta font-medium text-ink transition-[background-color,scale] duration-150 ease-out hover:bg-accent-soft data-[pressed]:scale-[0.96] data-[selected]:border-accent data-[selected]:text-on-accent-fill"
          >
            {filter === item.id && (
              <motion.span
                layoutId={pillId}
                aria-hidden="true"
                className="absolute -inset-px border border-accent bg-accent-fill"
                style={{ borderRadius: 999 }}
                transition={pillSpring}
              />
            )}
            <span className="relative">{item.label}</span>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* Announces the result of filtering to screen reader users. */}
      <p role="status" className="sr-only">
        {ui.filterStatus.replace("{count}", String(visible.length))}
      </p>

      <ul className="relative mt-6 grid gap-4 @xl:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project) => (
            <motion.li
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={cardSpring}
            >
              <ProjectCard project={project} tagLabels={projects.tagLabels} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </>
  );
}
