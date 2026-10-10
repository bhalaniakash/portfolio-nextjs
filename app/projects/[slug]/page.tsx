import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { GitHubIcon } from "@/components/icons/brand-icons";
import { ProjectVisual } from "@/components/projects/project-visual";
import { ArchitectureStory } from "@/components/projects/architecture-story";
import { MotionScope } from "@/components/motion/motion-scope";
import { TicTacToeDemo } from "@/components/projects/tic-tac-toe-demo";
import { architecture } from "@/data/architecture";
import { getProject, projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { absoluteUrl, jsonLd, siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const title = `${project.title}: ${project.kicker} case study`;
  const path = `/projects/${project.slug}`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: path },
    openGraph: { type: "article", url: path, title, description: project.summary },
    twitter: { card: "summary_large_image", title, description: project.summary },
  };
}

const sections = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "architecture", label: "Architecture" },
  { id: "decisions", label: "Decisions" },
  { id: "evidence", label: "Evidence" },
];

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const url = absoluteUrl(`/projects/${project.slug}`);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareSourceCode",
        "@id": `${url}#project`,
        name: project.title,
        description: project.summary,
        url,
        codeRepository: project.repo,
        programmingLanguage: project.stack.filter((tech) => /PHP|JavaScript/.test(tech)),
        keywords: project.stack.join(", "),
        dateCreated: project.year,
        author: { "@type": "Person", "@id": `${siteUrl}/#person`, name: profile.name },
        ...(project.visual.kind === "screenshot" ? { image: absoluteUrl(project.visual.src) } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Work", item: `${siteUrl}/#work` },
          { "@type": "ListItem", position: 3, name: project.title, item: url },
        ],
      },
    ],
  };

  const facts = [
    { label: "Role", value: project.role },
    { label: "Team", value: project.team },
    { label: "Timeline", value: project.period },
  ];

  return (
    <MotionScope>
    <article className="relative pt-(--header-h)">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />

      <header className="container-page pb-16 pt-12 md:pb-24 md:pt-20">
        <nav aria-label="Breadcrumb" className="fade-in mb-12">
          <ol className="eyebrow flex flex-wrap items-center gap-2">
            <li>
              <Link href="/#work" className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-fg">
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                All work
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-fg-muted">
              {project.title}
            </li>
          </ol>
        </nav>

        <p className="eyebrow fade-in mb-6 flex items-center gap-3" style={{ "--delay": "80ms" } as React.CSSProperties}>
          <span className="text-accent">Case study</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
          {project.kicker}
        </p>
        <h1 className="text-[clamp(3rem,11vw,9rem)] font-medium leading-[0.9] tracking-[-0.045em]">
          <span className="mask-line">
            <span style={{ "--delay": "120ms" } as React.CSSProperties}>{project.title}</span>
          </span>
        </h1>
        <p className="fade-in mt-8 max-w-3xl text-xl leading-relaxed text-fg-muted md:text-2xl" style={{ "--delay": "300ms" } as React.CSSProperties}>
          {project.summary}
        </p>

        {project.status ? (
          <p className="fade-in mt-6 flex max-w-3xl gap-3 rounded-xl border border-line bg-surface/60 p-4 text-fg-muted" style={{ "--delay": "380ms" } as React.CSSProperties}>
            <span className="status-dot mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {project.status}
          </p>
        ) : null}

        <div className="fade-in mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4" style={{ "--delay": "450ms" } as React.CSSProperties}>
          {facts.map((fact) => (
            <div key={fact.label} className="bg-ink-2 p-5">
              <p className="eyebrow">{fact.label}</p>
              <p className="mt-2">{fact.value}</p>
            </div>
          ))}
          <div className="flex flex-col gap-3 bg-ink-2 p-5">
            <p className="eyebrow">Links</p>
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 underline decoration-line-strong underline-offset-4 hover:decoration-accent"
            >
              <GitHubIcon className="size-4" />
              Source on GitHub
              <ArrowUpRight className="size-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            {project.live ? (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline underline-offset-4">
                Live demo
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            ) : (
              <p className="text-sm text-fg-subtle">No public deployment.</p>
            )}
          </div>
        </div>
      </header>

      <div className="container-page">
        <ViewTransition name={`project-visual-${project.slug}`} share="morph" default="none">
          <div className="overflow-hidden rounded-2xl border border-line-strong">
            <ProjectVisual project={project} sizes="(min-width: 1408px) 1328px, 100vw" preload />
          </div>
        </ViewTransition>
      </div>

      <div className="container-page grid gap-12 py-20 md:py-32 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <nav aria-label="On this page" className="sticky top-[calc(var(--header-h)+2rem)]">
            <p className="eyebrow mb-4">On this page</p>
            <ol className="space-y-2 border-l border-line">
              {sections.map((section, i) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="-ml-px flex gap-3 border-l border-transparent py-1 pl-4 text-fg-muted transition-colors hover:border-accent hover:text-fg">
                    <span className="font-mono text-xs text-fg-subtle">0{i + 1}</span>
                    {section.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="space-y-24 md:space-y-32 lg:col-span-8 lg:col-start-5">
          <CaseSection id="overview" index="01" title="Problem and objectives">
            <p className="text-xl leading-relaxed text-fg">{project.problem}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {project.objectives.map((objective) => (
                <li key={objective} className="flex gap-3 rounded-xl border border-line bg-ink-2 p-5 text-fg-muted">
                  <span className="mt-2.5 h-px w-3 shrink-0 bg-accent" aria-hidden="true" />
                  {objective}
                </li>
              ))}
            </ul>
          </CaseSection>

          <CaseSection id="features" index="02" title="What it does">
            <ol className="divide-y divide-line border-y border-line">
              {project.features.map((feature, i) => (
                <li key={feature} className="reveal grid grid-cols-[3rem_1fr] gap-4 py-5 text-lg">
                  <span className="font-mono text-sm leading-7 text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                  {feature}
                </li>
              ))}
            </ol>
          </CaseSection>

          <CaseSection id="architecture" index="03" title="Architecture and stack">
            {architecture.project === project.slug ? (
              <div className="mb-12">
                <ArchitectureStory stacked />
              </div>
            ) : null}
            <dl className="grid gap-px overflow-clip rounded-2xl border border-line bg-line">
              {project.architecture.map((part) => (
                <div key={part.label} className="reveal grid gap-2 bg-ink-2 p-6 sm:grid-cols-[10rem_1fr] sm:gap-6">
                  <dt className="eyebrow pt-1">{part.label}</dt>
                  <dd className="text-fg-muted">{part.detail}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Technology">
              {project.stack.map((tech) => (
                <li key={tech} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-fg-muted">
                  {tech}
                </li>
              ))}
            </ul>
          </CaseSection>

          <CaseSection id="decisions" index="04" title="Challenges and decisions">
            <div className="space-y-6">
              {project.decisions.map((decision) => (
                <div key={decision.challenge} className="reveal grid gap-4 rounded-2xl border border-line p-6 md:grid-cols-2 md:gap-8 md:p-8">
                  <div>
                    <p className="eyebrow mb-3">Challenge</p>
                    <p className="text-lg">{decision.challenge}</p>
                  </div>
                  <div>
                    <p className="eyebrow mb-3 text-accent">Approach</p>
                    <p className="text-fg-muted">{decision.solution}</p>
                  </div>
                </div>
              ))}
            </div>
            {project.slug === "tic-tac-toe" ? (
              <div className="reveal mt-12">
                <TicTacToeDemo />
              </div>
            ) : null}
          </CaseSection>

          <CaseSection id="evidence" index="05" title="Evidence">
            <ul className="space-y-3 text-lg text-fg-muted">
              {project.evidence.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-3 h-px w-3 shrink-0 bg-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-fg-subtle">
              No usage or performance figures are claimed here, because none were measured.
            </p>
          </CaseSection>
        </div>
      </div>

      <nav aria-label="Next project" className="border-t border-line">
        <Link href={`/projects/${next.slug}`} className="group container-page flex flex-col gap-4 py-16 md:flex-row md:items-end md:justify-between md:py-24">
          <span>
            <span className="eyebrow block">Next case study</span>
            <span className="mt-4 block text-[clamp(2.5rem,8vw,6rem)] font-medium leading-none tracking-[-0.04em] transition-colors group-hover:text-accent">
              {next.title}
            </span>
          </span>
          <span className="grid size-16 place-items-center rounded-full border border-line-strong transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
            <ArrowRight className="size-6" aria-hidden="true" />
          </span>
        </Link>
      </nav>
    </article>
    </MotionScope>
  );
}

function CaseSection({ id, index, title, children }: { id: string; index: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`${id}-title`} id={id} className="scroll-mt-28">
      <p className="eyebrow reveal mb-4 text-accent" data-reveal="left">
        {index}
      </p>
      <div data-drift="left">
        <h2 id={`${id}-title`} className="reveal mb-10 text-4xl font-medium tracking-tight md:text-5xl" data-reveal="left">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
