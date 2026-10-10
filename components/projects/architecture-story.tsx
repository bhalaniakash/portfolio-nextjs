"use client";

import { useRef, useState } from "react";
import { architecture, type ArchNode, type ArchNodeId } from "@/data/architecture";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { media, scrub } from "@/lib/motion";
import { whenIdle } from "@/lib/idle";
import { layoutTop } from "@/lib/scroll";

const kindStyles: Record<ArchNode["kind"], string> = {
  client: "border-line-strong bg-ink-2",
  app: "border-line-strong bg-surface",
  data: "border-accent/60 bg-surface",
  external: "border-dashed border-white/30 bg-ink",
};

/**
 * The WalletWise request path, drawn as the visitor reads. On large screens
 * the diagram stays in view while the numbered steps scroll past; each step
 * lights its components and draws their connections. The step list is the
 * text alternative and is always fully readable.
 */
export function ArchitectureStory({ stacked = false }: { stacked?: boolean }) {
  const scope = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { nodes, edges, steps } = architecture;
  const stepOf = (id: ArchNodeId) => steps.findIndex((step) => step.nodes.includes(id));

  useGSAP(
    // Set up once the main thread is idle, so hydration stays short.
    (context) =>
      whenIdle(() =>
        context.add(() => {
          const root = scope.current;
          if (!root) return;
          const stepEls = gsap.utils.toArray<HTMLElement>("[data-arch-step]", root);

          // Active step follows the reading position, with or without motion.
          stepEls.forEach((el, index) => {
            ScrollTrigger.create({
              trigger: el,
              start: "top 62%",
              end: "bottom 62%",
              onToggle: (self) => self.isActive && setActive(index),
            });
          });

          const mm = gsap.matchMedia();
          mm.add({ desktop: media.desktop, motion: media.motion }, (context) => {
            const { desktop, motion } = context.conditions as Record<string, boolean>;
            if (!motion) return;

            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger:
                desktop && !stacked
                  ? { trigger: root.querySelector("[data-arch-steps]"), start: "top 70%", end: "bottom 75%", scrub }
                  : { trigger: root.querySelector("[data-arch-diagram]"), start: "top 85%", end: "bottom 45%", scrub },
            });

            const revealed = new Set<ArchNodeId>();
            steps.forEach((step, index) => {
              step.nodes.forEach((id) => {
                revealed.add(id);
                tl.fromTo(
                  root.querySelectorAll(`[data-arch-node="${id}"]`),
                  { opacity: 0.12, scale: 0.86 },
                  { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" },
                  index,
                );
              });
              edges.forEach(([from, to]) => {
                const drawsNow = step.nodes.includes(from) || step.nodes.includes(to);
                if (drawsNow && revealed.has(from) && revealed.has(to)) {
                  tl.fromTo(
                    root.querySelectorAll(`[data-arch-edge="${from}-${to}"]`),
                    { strokeDashoffset: 1 },
                    { strokeDashoffset: 0, duration: 0.6 },
                    index + 0.2,
                  );
                }
              });
            });
          });
        }),
      ),
    { scope, dependencies: [stacked] },
  );

  function focusStep(index: number) {
    setActive(index);
    const reduce = window.matchMedia(media.reduce).matches;
    const step = scope.current?.querySelectorAll<HTMLElement>("[data-arch-step]")[index];
    if (!step) return;
    // Centre the step using layout offsets (unaffected by section transforms).
    const top = layoutTop(step) - (window.innerHeight - step.offsetHeight) / 2;
    window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "instant" : "smooth" });
  }

  // Horizontal scale of each layout's box (16:10 wide, 4:5 narrow).
  const diagram = (layout: "wide" | "narrow", sx = layout === "wide" ? 1.6 : 0.8) => (
    <div
      data-arch-diagram
      className={`relative w-full ${layout === "wide" ? "hidden aspect-[16/10] sm:block" : "aspect-[4/5] sm:hidden"}`}
    >
      <svg viewBox={`0 0 ${sx * 100} 100`} className="absolute inset-0 size-full" aria-hidden="true">
        {edges.map(([from, to]) => {
          const a = nodes.find((node) => node.id === from)![layout];
          const b = nodes.find((node) => node.id === to)![layout];
          const lit = steps[active]?.nodes.includes(from) || steps[active]?.nodes.includes(to);
          return (
            <line
              key={`${from}-${to}`}
              data-arch-edge={`${from}-${to}`}
              x1={a.x * sx}
              y1={a.y}
              x2={b.x * sx}
              y2={b.y}
              pathLength={1}
              strokeDasharray="1"
              className={`transition-[stroke] duration-500 ${lit ? "stroke-accent" : "stroke-white/25"}`}
              strokeWidth={lit ? 0.45 : 0.3}
            />
          );
        })}
      </svg>
      {nodes.map((node) => {
        const index = stepOf(node.id);
        const lit = steps[active]?.nodes.includes(node.id);
        const pos = node[layout];
        return (
          <button
            key={node.id}
            type="button"
            data-arch-node={node.id}
            onClick={() => focusStep(index)}
            aria-label={`${node.label}: go to step ${index + 1}, ${steps[index].title}`}
            aria-current={lit ? "step" : undefined}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            className={`absolute w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-xl border px-2 py-2.5 text-center text-xs font-medium transition-[background-color,border-color,color,box-shadow] duration-500 sm:w-[17%] sm:text-sm ${
              lit
                ? "border-accent bg-accent text-ink shadow-[0_0_0_6px_rgb(165_148_255/0.15)]"
                : `${kindStyles[node.kind]} text-fg`
            }`}
          >
            {node.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div ref={scope} className={`grid gap-12 ${stacked ? "" : "lg:grid-cols-12 lg:gap-16"}`}>
      <div className={stacked ? "" : "lg:col-span-7"}>
        <div className={stacked ? "" : "lg:sticky lg:top-[calc(var(--header-h)+3rem)]"}>
          <div className="rounded-2xl border border-line bg-ink-2 p-4 sm:p-8">
            {diagram("wide")}
            {diagram("narrow")}
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-fg-subtle" aria-label="Legend">
            <li className="flex items-center gap-2">
              <span className="size-3 rounded-sm border border-line-strong bg-surface" aria-hidden="true" /> Laravel
              application
            </li>
            <li className="flex items-center gap-2">
              <span className="size-3 rounded-sm border border-accent/60 bg-surface" aria-hidden="true" /> Database
            </li>
            <li className="flex items-center gap-2">
              <span className="size-3 rounded-sm border border-dashed border-white/40" aria-hidden="true" /> External
              service
            </li>
          </ul>
        </div>
      </div>

      <ol data-arch-steps className={stacked ? "" : "lg:col-span-5"}>
        {steps.map((step, index) => (
          <li
            key={step.title}
            data-arch-step
            // The active step gets an accent rule rather than dimming the
            // others, so every step keeps full text contrast.
            className={`border-t py-8 transition-colors duration-500 ${active === index ? "border-accent" : "border-line"} ${
              stacked ? "" : "lg:flex lg:min-h-[55vh] lg:flex-col lg:justify-center lg:py-12"
            }`}
          >
            <p className="font-mono text-xs text-accent">
              Step {String(index + 1).padStart(2, "0")}
              {active === index ? <span className="text-fg-muted"> / shown in the diagram</span> : null}
            </p>
            <h3 className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">{step.title}</h3>
            <p className="mt-4 text-lg leading-relaxed text-fg-muted">{step.detail}</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Source locations">
              {step.files.map((file) => (
                <li
                  key={file}
                  className="break-all rounded-md border border-line px-2 py-1 font-mono text-xs text-fg-subtle"
                >
                  {file}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
