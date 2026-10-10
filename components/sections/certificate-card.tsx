"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowUpRight, Maximize2, X } from "lucide-react";
import type { Certification } from "@/data/certifications";

export function CertificateCard({ certification }: { certification: Certification }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { image } = certification;
  const alt = `${certification.title} certificate issued to Akash Bhalani by ${certification.issuer}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-ink-2">
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="relative block overflow-hidden bg-white/[0.03] p-5"
        aria-label={`View ${certification.shortTitle} certificate full size`}
      >
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt={alt}
          sizes="(min-width: 768px) 40vw, 100vw"
          className="h-auto w-full rounded-md transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-[1.02]"
        />
        <span className="absolute right-8 top-8 grid size-10 place-items-center rounded-full bg-ink/80 text-fg opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          <Maximize2 className="size-4" aria-hidden="true" />
        </span>
      </button>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="text-xl font-medium tracking-tight">{certification.title}</h3>
          <p className="mt-2 text-fg-muted">
            {certification.issuer} <span aria-hidden="true">·</span>{" "}
            <time dateTime={certification.dateIso}>{certification.date}</time>
          </p>
        </div>
        {certification.credentialUrl ? (
          <a
            href={certification.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex min-h-11 items-center gap-2 self-start text-sm text-fg underline decoration-line-strong underline-offset-4 hover:decoration-accent"
          >
            Original certificate file
            <ArrowUpRight className="size-4" aria-hidden="true" />
            <span className="sr-only">(Google Drive, opens in a new tab)</span>
          </a>
        ) : null}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={`${certification.title} certificate`}
        onClick={(event) => event.target === dialogRef.current && dialogRef.current.close()}
        className="m-auto w-[min(64rem,calc(100vw-2rem))] max-w-none rounded-2xl border border-line-strong bg-ink-2 p-0 text-fg backdrop:bg-ink/85 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
          <p className="text-sm text-fg-muted">{certification.title}</p>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="grid size-10 place-items-center rounded-full border border-line-strong"
            aria-label="Close certificate"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="bg-white p-2 sm:p-4">
          <Image src={image.src} width={image.width} height={image.height} alt={alt} sizes="64rem" className="h-auto w-full" />
        </div>
      </dialog>
    </article>
  );
}
