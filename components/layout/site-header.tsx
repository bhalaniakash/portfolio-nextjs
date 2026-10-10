"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll } from "motion/react";
import { ArrowDownToLine, Menu, X } from "lucide-react";
import { profile } from "@/data/profile";
import { navItems } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The active section is the last one whose top has passed 40% of the
  // viewport. Computed from layout on scroll (once per frame), so it is right
  // in both directions and after jumping straight to a hash.
  useEffect(() => {
    // Off the home page nothing is highlighted; render ignores `active` there.
    if (!isHome) return;
    const mountedAt = performance.now();
    let frame = 0;
    let last: string | null | undefined;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) current = item.id;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = navItems[navItems.length - 1].id;
      if (current === last) return;
      last = current;
      setActive(current);

      // Keep the address bar in step with what is on screen, but leave an
      // incoming hash alone until the page has settled on it.
      if (performance.now() - mountedAt > 1500) {
        const url = current ? `#${current}` : window.location.pathname + window.location.search;
        if (window.location.hash !== (current ? `#${current}` : "")) window.history.replaceState(window.history.state, "", url);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [isHome]);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "Tab" && panelRef.current) {
        // Keep focus inside the open menu, including the toggle button.
        const focusable = [toggleRef.current, ...panelRef.current.querySelectorAll<HTMLElement>("a")].filter(
          (el): el is HTMLElement => el !== null,
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const onResize = () => window.innerWidth >= 1024 && close(false);

    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, close]);

  const hrefFor = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || open
          ? "border-b border-line bg-ink/75 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only rounded-md bg-accent px-4 py-2 font-medium text-ink focus:not-sr-only focus:absolute focus:left-4 focus:top-3"
      >
        Skip to content
      </a>
      <nav aria-label="Primary" className="container-page flex h-(--header-h) items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-full border border-line-strong font-mono text-[0.7rem] tracking-tight transition-colors group-hover:border-accent group-hover:text-accent"
          >
            AB
          </span>
          <span className="text-[0.95rem] font-medium tracking-tight">{profile.name}</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive = isHome && active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={hrefFor(item.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative isolate rounded-full px-4 py-2 text-sm transition-colors ${
                    isActive ? "text-fg" : "text-fg-muted hover:text-fg"
                  }`}
                >
                  {isActive ? (
                    <span aria-hidden="true" className="absolute inset-0 -z-10 rounded-full bg-white/[0.07]" />
                  ) : null}
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={profile.resume.href}
            target="_blank"
            rel="noopener"
            className="hidden items-center gap-2 rounded-full bg-fg px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-accent sm:inline-flex"
          >
            Resume
            <ArrowDownToLine className="size-4" aria-hidden="true" />
            <span className="sr-only">(PDF, opens in a new tab)</span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line-strong lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Page progress, tied directly to the scroll position. */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: scrollYProgress }}
        className="absolute inset-x-0 top-[calc(var(--header-h)-1px)] h-px origin-left bg-gradient-to-r from-indigo to-accent"
      />

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="h-[calc(100dvh-var(--header-h))] overflow-y-auto border-t border-line bg-ink lg:hidden"
      >
        <ul className="container-page flex flex-col py-6">
          {navItems.map((item, index) => (
            <li key={item.id} className="border-b border-line">
              <a
                href={hrefFor(item.id)}
                onClick={() => close(false)}
                className="flex items-baseline justify-between py-5 text-3xl font-medium tracking-tight"
                style={{ animation: `fade-up 0.6s var(--ease-out-expo) ${index * 50}ms both` }}
              >
                {item.label}
                <span className="font-mono text-xs text-fg-subtle">0{index + 1}</span>
              </a>
            </li>
          ))}
          <li className="pt-8">
            <a
              href={profile.resume.href}
              target="_blank"
              rel="noopener"
              onClick={() => close(false)}
              className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-3 font-medium text-ink"
            >
              Download resume
              <ArrowDownToLine className="size-4" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
