import { Briefcase, GraduationCap } from "lucide-react";
import { TimelineLine } from "@/components/motion/timeline-line";
import { SectionHeading } from "@/components/section-heading";
import { education, experience, type TimelineEntry } from "@/data/experience";

export function Experience() {
  return (
    <section aria-labelledby="experience-title" id="experience" className="relative py-24 md:py-36">
      <div className="container-page">
        <SectionHeading
          index="04"
          label="Experience"
          id="experience-title"
          aside={<p>Professional work first, then the degrees behind it.</p>}
        >
          Where I have <span className="serif-accent text-accent">worked</span> and studied.
        </SectionHeading>

        <TimelineLine>
          <TimelineGroup title="Work" entries={experience} />
          <TimelineGroup title="Education" entries={education} />
        </TimelineLine>
      </div>
    </section>
  );
}

function TimelineGroup({ title, entries }: { title: string; entries: TimelineEntry[] }) {
  return (
    <div className="relative">
      <h3 className="eyebrow reveal relative pb-6 pl-10 pt-4 md:pl-[calc(25%+2.5rem)]" data-reveal="left">
        {title}
      </h3>
      <ol>
        {entries.map((entry) => (
          <TimelineItem key={`${entry.organisation}-${entry.role}`} entry={entry} />
        ))}
      </ol>
    </div>
  );
}

function TimelineItem({ entry }: { entry: TimelineEntry }) {
  const isWork = entry.kind === "work";
  const Icon = isWork ? Briefcase : GraduationCap;

  return (
    <li className="relative grid gap-5 pb-14 pl-10 md:grid-cols-12 md:gap-10 md:pb-20 md:pl-0">
      {/* Marker on the line; it fills once the line passes it. */}
      <span
        data-timeline-marker
        aria-hidden="true"
        className={`timeline-marker absolute left-0 top-1.5 grid size-[1.375rem] -translate-x-1/2 place-items-center rounded-full border-2 bg-ink transition-colors duration-500 md:left-1/4 ${
          isWork ? "border-accent" : "border-white/40"
        }`}
      >
        <span
          className={`size-2 rounded-full transition-transform duration-500 ${isWork ? "bg-accent" : "bg-white/70"}`}
        />
      </span>

      <div className="reveal md:col-span-3 md:pr-10 md:text-right" data-reveal="left">
        <p className="font-mono text-sm text-fg">
          <time dateTime={entry.startDate}>{entry.period}</time>
        </p>
        <p className="eyebrow mt-2 flex items-center gap-2 md:justify-end">
          <Icon className="size-3.5 text-accent" aria-hidden="true" />
          {isWork ? "Work" : "Education"}
        </p>
      </div>

      <div className="md:col-span-4 md:col-start-4 md:pl-10">
        <h4 className="reveal text-2xl font-medium tracking-tight md:text-3xl" data-reveal="right">
          {entry.role}
        </h4>
        <p
          className="reveal mt-2 text-lg text-fg-muted"
          data-reveal="right"
          style={{ "--reveal-step": 1 } as React.CSSProperties}
        >
          {entry.organisation}
        </p>
        {entry.projects?.length ? (
          <p
            className="reveal mt-4 text-sm text-fg-muted"
            data-reveal="right"
            style={{ "--reveal-step": 2 } as React.CSSProperties}
          >
            <span className="eyebrow mr-2">In-house projects</span>
            {entry.projects.join(", ")}
          </p>
        ) : null}
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Topics">
          {entry.tags.map((tag, index) => (
            <li
              key={tag}
              className="reveal rounded-full border border-line px-3 py-1 font-mono text-xs text-fg-muted"
              data-reveal="scale"
              style={{ "--reveal-step": 2 + index } as React.CSSProperties}
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <ul className="space-y-3 text-fg-muted md:col-span-5">
        {entry.points.map((point, index) => (
          <li
            key={point}
            className="reveal flex gap-3 leading-relaxed"
            style={{ "--reveal-step": 1 + index } as React.CSSProperties}
          >
            <span className="mt-2.5 h-px w-3 shrink-0 bg-accent" aria-hidden="true" />
            {point}
          </li>
        ))}
      </ul>
    </li>
  );
}
