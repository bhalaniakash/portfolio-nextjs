import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { GitHubIcon } from "@/components/icons/brand-icons";
import { ProjectVisual } from "@/components/projects/project-visual";
import { WorkGallery } from "@/components/projects/work-gallery";
import { SectionHeading } from "@/components/section-heading";
import { projects, resumeProjects, type Project } from "@/data/projects";
import { socialLinks } from "@/data/social-links";

// Each project sits on its own backdrop so the sequence reads as distinct
// pieces rather than a uniform card grid.
const backdrops: Record<string, string> = {
  walletwise: "bg-[radial-gradient(120%_120%_at_0%_0%,#3a2a1f_0%,#16121a_55%,#101018_100%)]",
  "realtime-chat": "bg-[radial-gradient(120%_120%_at_100%_0%,#2a2350_0%,#14131f_55%,#101018_100%)]",
  "tic-tac-toe": "bg-[radial-gradient(120%_120%_at_50%_100%,#243064_0%,#131424_55%,#101018_100%)]",
};

export function Work() {
  const github = socialLinks.find((link) => link.id === "github");

  return (
    <section aria-labelledby="work-title" id="work" className="relative pt-24 md:pt-36">
      <div className="container-page">
        <SectionHeading
          index="02"
          label="Selected work"
          id="work-title"
          aside={
            <p>
              Three projects from my public repositories, each described from its source code and with a full case
              study, followed by in-house platforms I worked on at Brainer Hub.
            </p>
          }
        >
          Things I have <span className="serif-accent text-accent">built</span>.
        </SectionHeading>
      </div>

      <WorkGallery count={projects.length}>
        {projects.map((project, index) => (
          <ProjectPanel key={project.slug} project={project} index={index} />
        ))}
      </WorkGallery>

      <div className="container-page pt-24 md:pt-32">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h3 className="reveal text-3xl font-medium tracking-tight md:text-4xl" data-reveal="left">
            In-house work at <span className="serif-accent text-accent">Brainer Hub</span>
          </h3>
          <p className="reveal max-w-md text-sm text-fg-muted" data-reveal="right">
            Office projects I worked on to company requirements. The code and products belong to Brainer Hub Solution
            and its clients, so there are no screenshots or source links.
          </p>
        </div>
        <ul className="grid gap-4 md:grid-cols-2">
          {resumeProjects.map((item, index) => (
            <li
              key={item.title}
              className="reveal flex flex-col rounded-2xl border border-line bg-ink-2 p-6 md:p-8"
              data-reveal="scale"
              style={{ "--reveal-step": index } as React.CSSProperties}
            >
              <p className="eyebrow">{item.kicker}</p>
              <p className="mt-2 text-sm text-fg-subtle">{item.owner}</p>
              <h4 className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">{item.title}</h4>
              <p className="mt-3 text-fg-muted">{item.summary}</p>
              <ul className="mt-5 space-y-2 text-sm text-fg-muted">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-2 h-px w-3 shrink-0 bg-accent" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
              <ul className="mt-6 flex flex-wrap gap-2 pt-1" aria-label={`${item.title} technology`}>
                {item.stack.map((tech) => (
                  <li key={tech} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-fg-muted">
                    {tech}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {github ? (
        <div className="container-page pb-24 md:pb-36">
          <p className="reveal flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-10 text-fg-muted">
            More projects, including a Docker deployment and a versioned REST API, live on
            <a
              href={github.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-fg underline decoration-line-strong underline-offset-4 hover:decoration-accent"
            >
              <GitHubIcon className="size-4" />
              github.com/{github.handle}
              <ArrowUpRight className="size-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </p>
        </div>
      ) : null}
    </section>
  );
}

function ProjectPanel({ project, index }: { project: Project; index: number }) {
  const reversed = index % 2 === 1;
  const href = `/projects/${project.slug}`;
  const textDelay = (step: number) => ({ "--reveal-step": step }) as React.CSSProperties;

  return (
    <article
      data-panel
      aria-labelledby={`project-${project.slug}`}
      className="work-panel container-page grid items-center gap-8 md:grid-cols-12 md:gap-12 lg:px-0"
    >
      <div data-panel-media className={`md:col-span-7 ${reversed ? "md:order-2" : ""}`}>
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          data-reveal={reversed ? "right" : "left"}
          className={`reveal group relative block overflow-hidden rounded-2xl border border-line ${backdrops[project.slug] ?? "bg-surface"}`}
        >
          <div className="p-4 sm:p-8 lg:p-10">
            <ViewTransition name={`project-visual-${project.slug}`} share="morph" default="none">
              <div className="overflow-hidden rounded-xl border border-line-strong shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8)] transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-[1.025]">
                <ProjectVisual project={project} sizes="(min-width: 1024px) 46vw, (min-width: 768px) 55vw, 100vw" />
              </div>
            </ViewTransition>
          </div>
        </Link>
      </div>

      <div className={`md:col-span-5 ${reversed ? "md:order-1" : ""}`}>
        <p
          data-panel-text
          className="eyebrow reveal flex flex-wrap items-center gap-3"
          data-reveal={reversed ? "left" : "right"}
        >
          <span className="text-accent">0{index + 1}</span>
          <span className="h-px w-6 bg-line-strong" aria-hidden="true" />
          {project.kicker}
          <span aria-hidden="true">/</span>
          {project.year}
        </p>
        <h3
          data-panel-text
          id={`project-${project.slug}`}
          className="reveal mt-5 text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl"
          data-reveal={reversed ? "left" : "right"}
          style={textDelay(1)}
        >
          <Link href={href} className="transition-colors hover:text-accent">
            {project.title}
          </Link>
        </h3>
        <p
          data-panel-text
          className="reveal mt-5 text-lg leading-relaxed text-fg-muted"
          data-reveal={reversed ? "left" : "right"}
          style={textDelay(2)}
        >
          {project.summary}
        </p>

        {project.status ? (
          <p
            data-panel-text
            className="reveal mt-5 flex gap-3 rounded-xl border border-line bg-surface/60 p-4 text-sm text-fg-muted"
            style={textDelay(3)}
          >
            <span className="status-dot mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {project.status}
          </p>
        ) : null}

        <ul
          data-panel-text
          className="reveal mt-6 flex flex-wrap gap-2"
          aria-label={`${project.title} technology`}
          style={textDelay(3)}
        >
          {project.stack.slice(0, 6).map((tech) => (
            <li key={tech} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-fg-muted">
              {tech}
            </li>
          ))}
        </ul>

        <div data-panel-text className="reveal mt-8 flex flex-wrap gap-3" style={textDelay(4)}>
          <Link
            href={href}
            className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-fg px-6 font-medium text-ink transition-colors hover:bg-accent"
          >
            Read case study<span className="sr-only">: {project.title}</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line-strong px-5 font-medium transition-colors hover:border-fg"
            >
              <GitHubIcon className="size-4" />
              Source<span className="sr-only"> code for {project.title} on GitHub (opens in a new tab)</span>
            </a>
          ) : null}
          {project.live ? (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line-strong px-5 font-medium transition-colors hover:border-fg"
            >
              Live demo
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
