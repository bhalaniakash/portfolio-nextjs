"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { ease, media, scrub } from "@/lib/motion";
import { whenIdle } from "@/lib/idle";
import { layoutTop, scrollToElement } from "@/lib/scroll";

/**
 * Page-level scroll choreography, driven by data attributes so the sections
 * themselves stay Server Components:
 *
 *   [data-hero]        stays pinned (CSS sticky) while the next page slides over it
 *   [data-hero-part]   "first" | "last" | "copy" | "field": how each hero layer exits
 *   [data-sheet]       a page: turns in around its left edge, then recedes when covered
 *   [data-drift]       "left" | "right": large type travels into place with the scroll
 *
 * Everything is set up inside gsap.matchMedia, so reduced motion and small
 * screens get simpler (or no) spatial movement, and everything is reverted
 * when the route unmounts or is hidden.
 */
export function MotionScope({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    (context) => {
      const root = scope.current;
      if (!root) return;

      // Hero pin. Sticky with a negative top lets a hero taller than the
      // viewport scroll fully before it holds still, so nothing is cut off.
      const hero = root.querySelector<HTMLElement>("[data-hero]");
      const placeHero = () => {
        if (!hero) return;
        hero.style.top = `${Math.min(0, window.innerHeight - hero.offsetHeight)}px`;
      };
      placeHero();
      // ResizeObserver reports once on observe; only real size changes
      // need a re-measure (GSAP already refreshes on load and resize).
      let observed = false;
      const resizeObserver = new ResizeObserver(() => {
        placeHero();
        if (observed) ScrollTrigger.refresh();
        observed = true;
      });
      if (hero) resizeObserver.observe(hero);

      // Scroll scenes are set up once the main thread is idle.
      const cancelIdle = whenIdle(() =>
        context.add(() => {
          const mm = gsap.matchMedia();
          mm.add({ desktop: media.desktop, tablet: media.tablet, motion: media.motion }, (context) => {
            const { tablet, motion } = context.conditions as Record<string, boolean>;
            if (!motion) return;

            // Hero exit, measured against the page that covers it (normal flow,
            // never stuck), so measurements stay correct after a resize.
            const cover = hero?.nextElementSibling as HTMLElement | null;
            if (hero && cover) {
              const exit = gsap.timeline({
                defaults: { ease: ease.scrub },
                // clamp() keeps progress at 0 on load even if the next page already peeks in.
                scrollTrigger: { trigger: cover, start: "clamp(top bottom)", end: "top top", scrub },
              });
              exit
                .to(hero.querySelectorAll('[data-hero-part="first"]'), { xPercent: -14, opacity: 0.25 }, 0)
                .to(hero.querySelectorAll('[data-hero-part="last"]'), { xPercent: 10, opacity: 0.25 }, 0)
                .to(hero.querySelectorAll('[data-hero-part="copy"]'), { yPercent: -18, opacity: 0 }, 0)
                .to(hero.querySelectorAll('[data-hero-part="field"]'), { scale: 1.15, opacity: 0 }, 0)
                .to(hero, { scale: 0.94, transformOrigin: "50% 100%" }, 0);
            }

            const sheets = gsap.utils.toArray<HTMLElement>("[data-sheet]", root);
            sheets.forEach((sheet) => {
              // Page turn: the incoming page swings flat around its left edge.
              if (tablet) {
                gsap.fromTo(
                  sheet,
                  { rotateY: -9, xPercent: 4, transformPerspective: 1800, transformOrigin: "0% 50%" },
                  {
                    rotateY: 0,
                    xPercent: 0,
                    ease: ease.scrub,
                    scrollTrigger: { trigger: sheet, start: "top bottom", end: "top 30%", scrub },
                  },
                );
              }

              // The page underneath recedes and darkens only once the new page
              // covers more than half the screen, so long sections stay fully
              // readable while they are still being read.
              const previous = sheet.previousElementSibling as HTMLElement | null;
              if (!previous || previous === hero) return;
              const shade = previous.querySelector<HTMLElement>(":scope > [data-sheet-shade]");
              const recede = gsap.timeline({
                defaults: { ease: ease.scrub },
                scrollTrigger: { trigger: sheet, start: "top 45%", end: "top top", scrub },
              });
              recede.to(previous, { scale: tablet ? 0.95 : 0.97, transformOrigin: "50% 100%" }, 0);
              if (shade) recede.to(shade, { opacity: 0.5 }, 0);
            });

            // Oversized headings travel into place while their section arrives.
            gsap.utils.toArray<HTMLElement>("[data-drift]", root).forEach((el) => {
              const fromLeft = el.dataset.drift !== "right";
              gsap.fromTo(
                el,
                { x: () => (fromLeft ? -1 : 1) * window.innerWidth * (tablet ? 0.08 : 0.04) },
                {
                  x: 0,
                  ease: ease.scrub,
                  scrollTrigger: { trigger: el, start: "top bottom", end: "top 45%", scrub, invalidateOnRefresh: true },
                },
              );
            });
          });
        }),
      );

      // In-page links scroll to the section's layout position. The browser's
      // own anchor scrolling measures transformed boxes, so it would land off
      // target while a page is mid-turn.
      const onClick = (event: MouseEvent) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href*='#']");
        if (!link) return;
        const url = new URL(link.href, window.location.href);
        if (url.pathname !== window.location.pathname || !url.hash) return;
        const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (!target || !root.contains(target)) return;
        event.preventDefault();
        const reduce = window.matchMedia(media.reduce).matches;
        scrollToElement(target, reduce ? "instant" : "smooth");
        if (window.location.hash !== url.hash) window.history.pushState(window.history.state, "", url.hash);
      };
      document.addEventListener("click", onClick);

      // The page never scrolls sideways, but transformed content (turning
      // pages, the off-stage gallery track) can give the viewport scrollable
      // width that focus scrolling would use. Snap any sideways scroll back.
      const keepLeft = () => {
        if (window.scrollX !== 0) window.scrollTo({ left: 0, top: window.scrollY, behavior: "instant" });
      };
      window.addEventListener("scroll", keepLeft, { passive: true });

      // Fonts change line heights; re-measure once they are ready, then make
      // sure a direct link to a section still lands on that section.
      let cancelled = false;
      // A direct link (/#experience) must land on its section even though
      // fonts, images and GSAP's own re-measuring can move the page after the
      // browser's first jump. Re-check after each of those, for a few seconds,
      // and stop as soon as the visitor scrolls on their own.
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      let userMoved = false;
      const markUser = () => (userMoved = true);
      const align = () => {
        if (cancelled || userMoved || !target || !root.contains(target)) return;
        const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
        if (Math.abs(layoutTop(target) - padding - window.scrollY) > 4) scrollToElement(target, "instant");
      };
      const userEvents = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
      let stopAligning = () => {};
      if (target) {
        userEvents.forEach((type) => window.addEventListener(type, markUser, { passive: true, once: true }));
        document.fonts?.ready.then(align);
        window.addEventListener("load", align, { once: true });
        ScrollTrigger.addEventListener("refresh", align);
        const timer = window.setTimeout(() => stopAligning(), 4000);
        stopAligning = () => {
          window.clearTimeout(timer);
          ScrollTrigger.removeEventListener("refresh", align);
          window.removeEventListener("load", align);
          userEvents.forEach((type) => window.removeEventListener(type, markUser));
        };
      }

      return () => {
        cancelled = true;
        stopAligning();
        cancelIdle();
        document.removeEventListener("click", onClick);
        window.removeEventListener("scroll", keepLeft);
        resizeObserver.disconnect();
        if (hero) hero.style.top = "";
      };
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
