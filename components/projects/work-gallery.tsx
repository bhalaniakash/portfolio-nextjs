"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { ease, media, scrub } from "@/lib/motion";
import { whenIdle } from "@/lib/idle";

/**
 * Pinned horizontal project stage. The pin is CSS sticky (see .work-stage in
 * globals.css), so the page height is known before hydration and direct links
 * further down the page land in the right place. GSAP only translates the
 * track and choreographs each project's arrival from the scroll position.
 */
export function WorkGallery({ count, children }: { count: number; children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    // Set up once the main thread is idle, so hydration stays short.
    (context) =>
      whenIdle(() =>
        context.add(() => {
          const root = stage.current;
          if (!root) return;
          const mm = gsap.matchMedia();

          mm.add(media.desktop, () => {
            const track = root.querySelector<HTMLElement>(".work-track");
            const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", root);
            const bar = root.querySelector<HTMLElement>("[data-work-progress]");
            const counter = root.querySelector<HTMLElement>("[data-work-counter]");
            if (!track || panels.length === 0) return;

            const distance = () => track.scrollWidth - window.innerWidth;
            const segments = panels.length - 1;

            // The first project arrives as the stage scrolls into view.
            const first = panels[0];
            gsap
              .timeline({ scrollTrigger: { trigger: root, start: "top 85%", end: "top 10%", scrub } })
              .from(
                first.querySelector("[data-panel-media]"),
                { xPercent: -14, opacity: 0.3, scale: 1.08, ease: ease.land },
                0,
              )
              .from(
                first.querySelectorAll("[data-panel-text]"),
                { x: 90, opacity: 0, stagger: 0.06, ease: ease.land },
                0.1,
              );

            const tl = gsap.timeline({
              defaults: { ease: ease.scrub },
              scrollTrigger: {
                trigger: root,
                start: "top top",
                end: "bottom bottom",
                scrub,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  if (counter) counter.textContent = String(Math.round(self.progress * segments) + 1).padStart(2, "0");
                },
              },
            });

            tl.to(track, { x: () => -distance(), duration: segments }, 0);
            if (bar) tl.fromTo(bar, { scaleX: 1 / panels.length }, { scaleX: 1, duration: segments }, 0);

            panels.slice(1).forEach((panel, i) => {
              const media = panel.querySelector("[data-panel-media]");
              const texts = panel.querySelectorAll("[data-panel-text]");
              // The outgoing project recedes while the next one takes the stage.
              tl.to(panels[i], { opacity: 0.25, scale: 0.92, duration: 0.8 }, i + 0.1);
              tl.fromTo(
                media,
                { xPercent: -16, scale: 1.12, opacity: 0.35 },
                { xPercent: 0, scale: 1, opacity: 1, duration: 0.75, ease: "power2.out" },
                i + 0.15,
              );
              tl.from(texts, { x: 100, opacity: 0, stagger: 0.05, duration: 0.5, ease: ease.land }, i + 0.4);
            });
            tl.to({}, { duration: 0.3 });

            // Keyboard users: focusing a link in an off-screen project scrolls the
            // page to the point where that project is centred on the stage.
            const onFocus = (event: FocusEvent) => {
              const panel = (event.target as HTMLElement).closest<HTMLElement>("[data-panel]");
              const st = tl.scrollTrigger;
              if (!panel || !st) return;
              const index = panels.indexOf(panel);
              const ratio = index / (segments + 0.3);
              const top = st.start + (st.end - st.start) * ratio;
              // The browser scrolls the focused link into view after focusin,
              // during the next frame; set the stage position one frame later
              // so this position wins.
              requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo({ top, left: 0, behavior: "instant" })));
            };
            root.addEventListener("focusin", onFocus);
            return () => root.removeEventListener("focusin", onFocus);
          });
        }),
      ),
    { scope: stage },
  );

  return (
    <div ref={stage} className="work-stage" style={{ "--panels": count } as React.CSSProperties}>
      <div className="work-viewport">
        <div className="work-hud container-page mb-8 hidden items-center gap-6" aria-hidden="true">
          <span className="font-mono text-sm text-fg">
            <span data-work-counter>01</span>
            <span className="text-fg-subtle"> / {String(count).padStart(2, "0")}</span>
          </span>
          <span className="relative h-px flex-1 bg-line-strong">
            <span
              data-work-progress
              className="absolute inset-0 origin-left bg-accent"
              style={{ transform: `scaleX(${1 / count})` }}
            />
          </span>
          <span className="eyebrow">Scroll to move through the work</span>
        </div>
        <div className="work-track">{children}</div>
      </div>
    </div>
  );
}
