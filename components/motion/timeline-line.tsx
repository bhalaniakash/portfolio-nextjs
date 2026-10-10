"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { media, scrub } from "@/lib/motion";
import { whenIdle } from "@/lib/idle";

/**
 * A vertical rule that draws itself with the scroll. Markers inside it get
 * .is-passed once the drawn line reaches them, in both scroll directions.
 */
export function TimelineLine({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    // Set up once the main thread is idle, so hydration stays short.
    (context) =>
      whenIdle(() =>
        context.add(() => {
          const root = scope.current;
          if (!root) return;

          gsap.utils.toArray<HTMLElement>("[data-timeline-marker]", root).forEach((marker) => {
            ScrollTrigger.create({ trigger: marker, start: "top 60%", toggleClass: "is-passed" });
          });

          const mm = gsap.matchMedia();
          mm.add(media.motion, () => {
            gsap.fromTo(
              root.querySelector("[data-timeline-fill]"),
              { scaleY: 0 },
              { scaleY: 1, ease: "none", scrollTrigger: { trigger: root, start: "top 60%", end: "bottom 60%", scrub } },
            );
          });
        }),
      ),
    { scope },
  );

  return (
    <div ref={scope} className="relative">
      <div aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px bg-line-strong md:left-1/4">
        <div data-timeline-fill className="absolute inset-0 origin-top bg-gradient-to-b from-accent to-indigo" />
      </div>
      {children}
    </div>
  );
}
