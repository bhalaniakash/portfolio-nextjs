import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArchitectureStory } from "@/components/projects/architecture-story";
import { SectionHeading } from "@/components/section-heading";

export function Architecture() {
  return (
    <section aria-labelledby="architecture-title" id="architecture" className="relative py-24 md:py-36">
      <div className="container-page">
        <SectionHeading
          index="03"
          label="Architecture"
          id="architecture-title"
          aside={
            <p>
              WalletWise is a single Laravel application, not a set of microservices. This is the path a request takes
              through it, traced from the repository.
            </p>
          }
        >
          How WalletWise is <span className="serif-accent text-accent">put together</span>.
        </SectionHeading>
        <ArchitectureStory />
        <Link
          href="/projects/walletwise"
          className="reveal group mt-16 inline-flex min-h-12 items-center gap-3 rounded-full border border-line-strong px-6 font-medium transition-colors hover:border-fg"
        >
          Read the WalletWise case study
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
