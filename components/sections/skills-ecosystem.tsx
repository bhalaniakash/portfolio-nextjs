"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  Briefcase,
  FileText,
  FlaskConical,
  FolderGit2,
  GraduationCap,
  X,
  type LucideIcon,
} from "lucide-react";
import { contextLabels, type Skill, type SkillContext, type SkillGroup } from "@/data/skills";
import { gsap, useGSAP } from "@/lib/gsap";
import { media, scrub } from "@/lib/motion";
import { whenIdle } from "@/lib/idle";

const contextIcons: Record<SkillContext, LucideIcon> = {
  professional: Briefcase,
  project: FolderGit2,
  "hands-on": FlaskConical,
  coursework: GraduationCap,
  listed: FileText,
};

// Wider panels for the two largest groups.
const spans: Record<string, string> = {
  backend: "lg:col-span-2",
  foundations: "lg:col-span-3",
};

/**
 * Technology groups slide in from alternating sides, then their tiles drop
 * into place, tied to scroll progress. Selecting a tile opens a short,
 * sourced note with links to the real projects that use it.
 */
export function SkillsEcosystem({ groups }: { groups: SkillGroup[] }) {
  const scope = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState<{ group: string; name: string } | null>(null);
  const [highlight, setHighlight] = useState<SkillContext | null>(null);

  useGSAP(
    // Set up once the main thread is idle, so hydration stays short.
    (context) =>
      whenIdle(() =>
        context.add(() => {
          const mm = gsap.matchMedia();
          mm.add({ tablet: media.tablet, motion: media.motion }, (context) => {
            const { tablet, motion } = context.conditions as Record<string, boolean>;
            if (!motion) return;

            gsap.utils.toArray<HTMLElement>("[data-skill-group]").forEach((panel) => {
              const from = panel.dataset.from;
              const tiles = panel.querySelectorAll("[data-skill-tile]");
              // The panel slides in with the scroll; the tiles then drop as a short
              // sequence that always completes, so they never hang mid-air.
              gsap.from(panel, {
                xPercent: tablet && from === "left" ? -10 : tablet && from === "right" ? 10 : 0,
                y: from === "below" || !tablet ? 60 : 0,
                // Position only: the panel's text stays at full contrast throughout.
                ease: "none",
                scrollTrigger: { trigger: panel, start: "top bottom", end: "top 60%", scrub },
              });
              const tl = gsap.timeline({
                scrollTrigger: { trigger: panel, start: "top 75%", toggleActions: "play none none none" },
              });
              tl.from(
                tiles,
                {
                  // Each tile starts at its own height and angle, then lands flat.
                  y: () => -(tablet ? 140 + Math.random() * 180 : 70 + Math.random() * 70),
                  rotation: () => (Math.random() - 0.5) * (tablet ? 26 : 12),
                  opacity: 0,
                  duration: 0.75,
                  ease: "power3.out",
                  stagger: { each: 0.04, from: "random" },
                },
                0,
              );
            });
          });
        }),
      ),
    { scope },
  );

  return (
    <div ref={scope}>
      <div
        className="mb-10 flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Highlight skills by how they were used"
      >
        {(Object.keys(contextLabels) as SkillContext[]).map((context) => {
          const Icon = contextIcons[context];
          const active = highlight === context;
          return (
            <button
              key={context}
              type="button"
              aria-pressed={active}
              onClick={() => setHighlight(active ? null : context)}
              title={contextLabels[context].description}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${
                active ? "border-accent bg-accent-soft text-fg" : "border-line-strong text-fg-muted hover:text-fg"
              }`}
            >
              <Icon className="size-4 text-accent" aria-hidden="true" />
              {contextLabels[context].label}
            </button>
          );
        })}
        <p className="sr-only" aria-live="polite">
          {highlight ? `Highlighting skills marked ${contextLabels[highlight].label}` : ""}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => {
          const openSkill =
            selected?.group === group.id ? group.skills.find((skill) => skill.name === selected.name) : undefined;
          const detailId = `skill-detail-${group.id}`;
          return (
            <section
              key={group.id}
              data-skill-group
              data-from={group.from}
              aria-labelledby={`skill-group-${group.id}`}
              className={`rounded-2xl border p-6 md:p-7 ${spans[group.id] ?? ""} ${
                group.id === "python"
                  ? "border-accent/40 bg-[linear-gradient(160deg,rgb(139_120_255/0.12),transparent_55%)]"
                  : "border-line bg-ink-2"
              }`}
            >
              <header className="mb-6 flex items-baseline justify-between gap-4">
                <div>
                  <h3 id={`skill-group-${group.id}`} className="text-xl font-medium tracking-tight">
                    {group.label}
                  </h3>
                  <p className="mt-1 text-sm text-fg-muted">{group.description}</p>
                </div>
                <span className="font-mono text-xs text-fg-subtle">{String(group.skills.length).padStart(2, "0")}</span>
              </header>

              {/* Tiles land inside this clipped tray, never over the group heading. */}
              <ul className="-m-1 flex flex-wrap gap-2 overflow-clip p-1">
                {group.skills.map((skill) => {
                  const isOpen = openSkill?.name === skill.name;
                  const Icon = contextIcons[skill.contexts[0]];
                  const dimmed = highlight !== null && !skill.contexts.includes(highlight);
                  return (
                    <li key={skill.name} data-skill-tile>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={detailId}
                        onClick={() => setSelected(isOpen ? null : { group: group.id, name: skill.name })}
                        className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3.5 text-left text-sm transition-[opacity,background-color,border-color] duration-300 ${
                          isOpen
                            ? "border-accent bg-accent-soft text-fg"
                            : "border-line-strong bg-ink/60 text-fg hover:border-white/30"
                        } ${dimmed ? "opacity-35" : ""}`}
                      >
                        <Icon className="size-3.5 shrink-0 text-accent" aria-hidden="true" />
                        {skill.name}
                        <span className="sr-only">
                          , {skill.contexts.map((context) => contextLabels[context].label).join(" and ")}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div id={detailId} aria-live="polite">
                <AnimatePresence initial={false}>
                  {openSkill ? (
                    <motion.div
                      key={openSkill.name}
                      initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <SkillDetail skill={openSkill} onClose={() => setSelected(null)} />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function SkillDetail({ skill, onClose }: { skill: Skill; onClose: () => void }) {
  return (
    <div className="mt-6 rounded-xl border border-line-strong bg-ink p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-lg font-medium">{skill.name}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close details for ${skill.name}`}
          className="-mr-2 -mt-2 grid size-10 shrink-0 place-items-center rounded-full text-fg-muted hover:text-fg"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <ul className="mt-2 flex flex-wrap gap-2">
        {skill.contexts.map((context) => {
          const Icon = contextIcons[context];
          return (
            <li key={context} className="inline-flex items-center gap-1.5 font-mono text-xs text-fg-muted">
              <Icon className="size-3.5 text-accent" aria-hidden="true" />
              {contextLabels[context].label}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-fg-muted">{skill.note}</p>
      {skill.links?.length ? (
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
          {skill.links.map((link) => {
            const external = link.href.startsWith("http");
            const className =
              "inline-flex min-h-11 items-center gap-1.5 text-sm underline decoration-line-strong underline-offset-4 hover:decoration-accent";
            return (
              <li key={link.href}>
                {external ? (
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
                    {link.label}
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ) : (
                  <Link href={link.href} className={className}>
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
