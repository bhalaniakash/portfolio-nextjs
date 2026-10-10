import Image from "next/image";
import type { Project } from "@/data/projects";
import { ChatIllustration } from "./chat-illustration";

type ProjectVisualProps = {
  project: Project;
  sizes: string;
  preload?: boolean;
};

/** The project's screenshot or illustration, framed consistently. */
export function ProjectVisual({ project, sizes, preload = false }: ProjectVisualProps) {
  const { visual } = project;

  if (visual.kind === "illustration") {
    return (
      <div className="relative">
        <ChatIllustration title={visual.alt} />
        <span className="eyebrow absolute bottom-3 right-3 rounded-full border border-line bg-ink/80 px-3 py-1 text-[0.65rem]">
          Illustration
        </span>
      </div>
    );
  }

  const image = (
    <Image
      src={visual.src}
      width={visual.width}
      height={visual.height}
      alt={visual.alt}
      sizes={sizes}
      preload={preload}
      className="h-auto w-full"
    />
  );

  if (visual.frame === "plain") {
    return <div className="overflow-hidden">{image}</div>;
  }

  return (
    <div className="overflow-hidden bg-surface-2">
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3" aria-hidden="true">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="ml-3 h-5 flex-1 rounded-full bg-white/[0.05]" />
      </div>
      {image}
    </div>
  );
}
