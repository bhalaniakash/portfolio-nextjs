import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { socialIcons } from "@/components/icons/brand-icons";
import { profile } from "@/data/profile";
import { socialLinks } from "@/data/social-links";
import { articles } from "@/data/writing";
import { contactEndpoint } from "@/lib/site";
import { ContactForm } from "./contact-form";

export function Contact() {
  return (
    <section
      aria-labelledby="contact-title"
      id="contact"
      className="grain relative isolate overflow-clip py-24 md:py-36"
    >
      <div
        aria-hidden="true"
        className="absolute -bottom-1/2 left-1/2 -z-10 h-[80vh] w-[110vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(109_124_255/0.16),transparent)]"
      />
      <div className="container-page grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow reveal mb-5 flex items-center gap-3">
            <span className="text-accent">{articles.length > 0 ? "08" : "07"}</span>
            <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
            Contact
          </p>
          <div data-drift="left">
            <h2 id="contact-title" className="reveal text-h2 font-medium" data-reveal="left">
              Let&rsquo;s build <span className="serif-accent text-accent">something</span>.
            </h2>
          </div>
          <p className="reveal mt-6 max-w-md text-lg text-fg-muted">
            Have a role, a project or a question about my work? Send a message, email me or call me directly.
          </p>

          <ul className="reveal mt-10 space-y-4">
            <li>
              <a href={`mailto:${profile.email}`} className="group flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-full border border-line-strong transition-colors group-hover:border-accent">
                  <Mail className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="eyebrow block">Email</span>
                  <span className="text-lg underline decoration-line-strong underline-offset-4 group-hover:decoration-accent">
                    {profile.email}
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a href={profile.phone.href} className="group flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-full border border-line-strong transition-colors group-hover:border-accent">
                  <Phone className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="eyebrow block">Phone</span>
                  <span className="text-lg underline decoration-line-strong underline-offset-4 group-hover:decoration-accent">
                    {profile.phone.display}
                  </span>
                </span>
              </a>
            </li>
            <li className="flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-full border border-line-strong">
                <MapPin className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="eyebrow block">Location</span>
                <span className="text-lg">{profile.location}</span>
              </span>
            </li>
          </ul>

          <ul className="reveal mt-10 flex flex-wrap gap-3" aria-label="Profiles">
            {socialLinks.map((link) => {
              const Icon = socialIcons[link.id];
              return (
                <li key={link.id}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-4 text-sm text-fg-muted transition-colors hover:border-fg hover:text-fg"
                  >
                    <Icon className="size-4" />
                    {link.label}
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="reveal md:col-span-7 lg:col-span-6 lg:col-start-7" data-reveal="right">
          <ContactForm endpoint={contactEndpoint} email={profile.email} />
        </div>
      </div>
    </section>
  );
}
