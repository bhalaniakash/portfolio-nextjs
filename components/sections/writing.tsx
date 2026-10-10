import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { articles } from "@/data/writing";

/** Renders nothing until data/writing.ts has at least one article. */
export function Writing() {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="writing-title" id="writing" className="relative py-24 md:py-36">
      <div className="container-page">
        <SectionHeading index="07" label="Writing" id="writing-title">
          Notes and <span className="serif-accent text-accent">articles</span>.
        </SectionHeading>
        <ul className="divide-y divide-line border-y border-line">
          {articles.map((article) => (
            <li key={article.href} className="reveal">
              <a href={article.href} className="group grid gap-2 py-8 md:grid-cols-12 md:items-baseline">
                <time className="font-mono text-sm text-fg-subtle md:col-span-2">{article.date}</time>
                <span className="text-2xl font-medium tracking-tight transition-colors group-hover:text-accent md:col-span-6">
                  {article.title}
                </span>
                <span className="flex items-start justify-between gap-4 text-fg-muted md:col-span-4">
                  {article.description}
                  <ArrowUpRight className="size-5 shrink-0" aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
