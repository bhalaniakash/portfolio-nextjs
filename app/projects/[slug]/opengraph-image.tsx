import { getProject, projects } from "@/data/projects";
import { renderOgImage, ogSize } from "@/lib/og";

export const alt = "Project case study by Akash Bhalani";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  return renderOgImage({
    eyebrow: project ? `Case study / ${project.kicker}` : "Case study",
    title: project?.title ?? "Project",
    footer: project ? project.stack.slice(0, 4).join(", ") : "",
  });
}
