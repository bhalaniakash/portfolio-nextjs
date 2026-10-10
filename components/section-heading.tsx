import type { ReactNode } from "react";

type SectionHeadingProps = {
  index: string;
  label: string;
  id: string;
  children: ReactNode;
  aside?: ReactNode;
};

/**
 * The shared section entrance: the eyebrow and heading arrive from the left
 * (the heading also drifts with the scroll), supporting copy from the right.
 */
export function SectionHeading({ index, label, id, children, aside }: SectionHeadingProps) {
  return (
    <header className="mb-12 grid gap-6 md:mb-20 md:grid-cols-12 md:items-end">
      <div className="md:col-span-8">
        <p className="eyebrow reveal mb-5 flex items-center gap-3" data-reveal="left">
          <span className="text-accent">{index}</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
          {label}
        </p>
        <div data-drift="left">
          <h2
            id={id}
            className="reveal text-h2 font-medium"
            data-reveal="left"
            style={{ "--reveal-step": 1 } as React.CSSProperties}
          >
            {children}
          </h2>
        </div>
      </div>
      {aside ? (
        <div
          className="reveal text-fg-muted md:col-span-4 md:pb-2"
          data-reveal="right"
          style={{ "--reveal-step": 2 } as React.CSSProperties}
        >
          {aside}
        </div>
      ) : null}
    </header>
  );
}
