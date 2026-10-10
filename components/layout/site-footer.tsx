import { ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
import { socialLinks } from "@/data/social-links";
import { socialIcons } from "@/components/icons/brand-icons";
import { CurrentYear } from "./current-year";
import { FooterNav } from "./footer-nav";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-line">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-2xl font-medium tracking-tight">{profile.name}</p>
          <p className="mt-3 max-w-sm text-fg-muted">
            {profile.role} in {profile.location}.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-6 inline-flex items-center gap-2 text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent"
          >
            {profile.email}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
          <a
            href={profile.phone.href}
            className="mt-3 flex w-fit items-center gap-2 text-fg-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-fg hover:decoration-accent"
          >
            {profile.phone.display}
          </a>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="eyebrow mb-4">Sections</p>
          <FooterNav />
        </nav>

        <div className="md:col-span-4">
          <p className="eyebrow mb-4">Elsewhere</p>
          <ul className="space-y-2">
            {socialLinks.map((link) => {
              const Icon = socialIcons[link.id];
              return (
                <li key={link.id}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="inline-flex items-center gap-3 text-fg-muted transition-colors hover:text-fg"
                  >
                    <Icon className="size-4" />
                    {link.label}
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              );
            })}
            <li>
              <a href={profile.resume.href} target="_blank" rel="noopener" className="inline-flex items-center gap-3 text-fg-muted transition-colors hover:text-fg">
                <ArrowUpRight className="size-4" aria-hidden="true" />
                Resume (PDF)
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-page reveal" data-reveal="clip" aria-hidden="true">
        <svg viewBox="0 0 1000 150" className="w-full select-none" role="presentation">
          <text
            x="0"
            y="128"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            className="fill-transparent stroke-white/15 font-medium"
            style={{ fontSize: 150, letterSpacing: "-0.04em" }}
            strokeWidth="1"
          >
            Akash Bhalani
          </text>
        </svg>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-line py-6 text-sm text-fg-subtle sm:flex-row sm:justify-between">
        <p>
          &copy; <CurrentYear /> {profile.name}. All rights reserved.
        </p>
        <p>Built with Next.js, set in Geist and Instrument Serif.</p>
      </div>
    </footer>
  );
}
