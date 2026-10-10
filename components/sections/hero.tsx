import { Fragment } from "react";
import { ArrowDown, ArrowDownToLine, ArrowRight } from "lucide-react";
import { SignalField } from "@/components/animations/signal-field";
import { socialIcons } from "@/components/icons/brand-icons";
import { profile } from "@/data/profile";
import { socialLinks } from "@/data/social-links";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as React.CSSProperties;

// Words of the headline rise one after another; "end to end." is the accent.
const headline = ["I", "build", "web", "applications", "end", "to", "end."];

export function Hero() {
  return (
    <section data-hero aria-labelledby="hero-title" className="grain relative isolate flex min-h-svh flex-col overflow-hidden bg-ink pt-(--header-h)">
      <div aria-hidden="true" data-hero-part="field" className="absolute inset-0 -z-10">
        <SignalField className="absolute inset-0 size-full [mask-image:radial-gradient(ellipse_75%_70%_at_50%_42%,black_30%,transparent_100%)]" />
        <div className="absolute -top-1/3 left-1/2 h-[70vh] w-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(139_120_255/0.18),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
      </div>

      <div className="container-page flex flex-1 flex-col justify-between gap-12 pb-10 pt-10 md:pt-16">
        <div className="fade-in flex flex-wrap items-center justify-between gap-4" style={delay(100)}>
          <p className="eyebrow flex items-center gap-3">
            <span className="status-dot size-1.5 rounded-full bg-accent" aria-hidden="true" />
            {profile.role}
          </p>
          <p className="eyebrow">{profile.location}</p>
        </div>

        <h1 id="hero-title" className="text-display font-medium">
          <span className="mask-line" data-hero-part="first">
            <span style={delay(150)}>{profile.firstName}</span>
          </span>{" "}
          <span className="mask-line md:pl-[12vw]" data-hero-part="last">
            <span style={delay(280)}>
              {profile.lastName}
              <span className="serif-accent text-accent">.</span>
            </span>
          </span>
        </h1>

        <div className="grid gap-10 md:grid-cols-12 md:items-end" data-hero-part="copy">
          <div className="md:col-span-7 lg:col-span-6">
            <p className="text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl">
              {headline.map((word, index) => (
                <Fragment key={index}>
                  <span className="word-mask">
                    <span className={index >= 4 ? "serif-accent text-accent" : undefined} style={delay(380 + index * 45)}>
                      {word}
                    </span>
                  </span>{" "}
                </Fragment>
              ))}
            </p>
            <p className="fade-in mt-5 max-w-xl text-lg leading-relaxed text-fg-muted" style={delay(600)}>
              {profile.intro}
            </p>
            <div className="fade-in mt-8 flex flex-wrap items-center gap-3" style={delay(750)}>
              <a
                href="#work"
                className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-fg px-6 font-medium text-ink transition-colors hover:bg-accent"
              >
                Explore selected work
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </a>
              <a
                href="#contact"
                className="inline-flex min-h-12 items-center rounded-full border border-line-strong px-6 font-medium transition-colors hover:border-fg"
              >
                Get in touch
              </a>
              <a
                href={profile.resume.href}
                download={profile.resume.fileName}
                className="inline-flex min-h-12 items-center gap-2 px-3 text-fg-muted underline-offset-4 transition-colors hover:text-fg hover:underline"
              >
                <ArrowDownToLine className="size-4" aria-hidden="true" />
                Resume PDF
              </a>
            </div>
          </div>

          <div className="fade-in flex items-end justify-between gap-6 md:col-span-5 md:flex-col md:items-end lg:col-span-6" style={delay(850)}>
            <ul className="flex gap-2" aria-label="Profiles">
              {socialLinks.map((link) => {
                const Icon = socialIcons[link.id];
                return (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="me noopener noreferrer"
                      aria-label={`${link.label} (opens in a new tab)`}
                      className="grid size-12 place-items-center rounded-full border border-line-strong text-fg-muted transition-colors hover:border-accent hover:text-fg"
                    >
                      <Icon className="size-[1.1rem]" />
                    </a>
                  </li>
                );
              })}
            </ul>
            <a href="#about" className="eyebrow group hidden items-center gap-3 transition-colors hover:text-fg sm:flex">
              Scroll
              <span className="grid size-9 place-items-center rounded-full border border-line-strong transition-colors group-hover:border-fg">
                <ArrowDown className="size-4" aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
