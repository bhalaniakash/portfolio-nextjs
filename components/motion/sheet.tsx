import type { ReactNode } from "react";

type SheetProps = {
  children: ReactNode;
  tone?: "ink" | "deep";
  /** The first page sits directly on the pinned hero, so it needs no overlap. */
  overlap?: boolean;
};

/**
 * A "page" in the scroll story. Pages overlap slightly and stack in DOM order;
 * MotionScope turns them in and makes the page underneath recede.
 */
export function Sheet({ children, tone = "ink", overlap = true }: SheetProps) {
  return (
    <div
      data-sheet
      className={`sheet relative isolate rounded-t-[1.75rem] border-t border-line-strong shadow-[0_-40px_80px_-30px_rgb(0_0_0/0.85)] md:rounded-t-[2.5rem] ${
        overlap ? "-mt-16" : ""
      } ${tone === "deep" ? "bg-[#0d0d15]" : "bg-ink"}`}
    >
      {children}
      <div data-sheet-shade aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] bg-black opacity-0" />
    </div>
  );
}
