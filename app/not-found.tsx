import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[80svh] flex-col justify-center pt-(--header-h)">
      <p className="eyebrow mb-6">Error 404</p>
      <h1 className="text-[clamp(3rem,10vw,8rem)] font-medium leading-[0.92] tracking-[-0.045em]">
        This page <span className="serif-accent text-accent">does not exist</span>.
      </h1>
      <p className="mt-6 max-w-lg text-lg text-fg-muted">The link may be out of date. Everything on the site starts from the home page.</p>
      <Link
        href="/"
        className="mt-10 inline-flex min-h-12 items-center gap-3 self-start rounded-full bg-fg px-6 font-medium text-ink transition-colors hover:bg-accent"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to the home page
      </Link>
    </section>
  );
}
