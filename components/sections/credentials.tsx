import { certifications } from "@/data/certifications";
import { CertificateCard } from "./certificate-card";

export function Credentials() {
  return (
    <section aria-labelledby="credentials-title" id="credentials" className="relative py-24 md:py-32">
      <div className="container-page grid gap-12 md:grid-cols-12">
        <header className="md:col-span-4">
          <p className="eyebrow reveal mb-5 flex items-center gap-3" data-reveal="left">
            <span className="text-accent">06</span>
            <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
            Certifications
          </p>
          <h2 id="credentials-title" className="reveal text-4xl font-medium tracking-tight md:text-5xl" data-reveal="left">
            Courses <span className="serif-accent text-accent">completed</span>.
          </h2>
          <p className="reveal mt-5 text-fg-muted">Select a certificate to view it at full size.</p>
        </header>
        <ul className="grid gap-6 sm:grid-cols-2 md:col-span-8">
          {certifications.map((certification, index) => (
            <li
              key={certification.title}
              className="reveal"
              data-reveal="clip"
              style={{ "--reveal-step": index * 2 } as React.CSSProperties}
            >
              <CertificateCard certification={certification} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
