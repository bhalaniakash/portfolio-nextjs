import Image from "next/image";
import { ScrollStatement } from "@/components/animations/scroll-statement";
import { SectionHeading } from "@/components/section-heading";
import { profile } from "@/data/profile";

export function About() {
  return (
    <section aria-labelledby="about-title" id="about" className="relative py-24 md:py-36">
      <div className="container-page">
        <div className="mb-24 max-w-6xl md:mb-36">
          <ScrollStatement
            segments={[
              { text: "Hands-on with Laravel, PHP, Python, JavaScript and SQL. I build responsive web applications with" },
              { text: "robust backends", accent: true },
              { text: "and modern interfaces, and I take debugging and clean code as seriously as features." },
            ]}
          />
        </div>

        <SectionHeading index="01" label="About" id="about-title">
          A developer who likes <span className="serif-accent text-accent">the server side</span> of the web.
        </SectionHeading>

        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <figure className="reveal relative md:col-span-5 lg:col-span-4" data-reveal="clip">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-surface">
              <Image
                src={profile.portrait.src}
                alt={profile.portrait.alt}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, 100vw"
                className="object-cover grayscale-[35%] transition-[filter] duration-700 hover:grayscale-0"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            </div>
            <figcaption className="eyebrow mt-4 flex justify-between">
              <span>{profile.name}</span>
              <span>Gujarat, India</span>
            </figcaption>
          </figure>

          <div className="md:col-span-7 lg:col-span-7 lg:col-start-6">
            <div className="space-y-6 text-lg leading-relaxed text-fg-muted md:text-xl">
              {profile.about.map((paragraph, index) => (
                <p key={index} className="reveal" data-reveal="right" style={{ "--reveal-step": index } as React.CSSProperties}>
                  {paragraph}
                </p>
              ))}
            </div>

            <dl className="mt-12 grid gap-px overflow-clip rounded-2xl border border-line bg-line sm:grid-cols-2">
              {profile.facts.map((fact, index) => (
                <div
                  key={fact.label}
                  className="reveal bg-ink-2 p-6"
                  style={{ "--reveal-step": index } as React.CSSProperties}
                >
                  <dt className="eyebrow">{fact.label}</dt>
                  <dd className="mt-2 text-lg text-fg">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
