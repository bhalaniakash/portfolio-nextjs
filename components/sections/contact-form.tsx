"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;
type Status = { state: "idle" | "sending" } | { state: "sent" } | { state: "failed"; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: Record<Field, string>): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your name.";
  else if (values.name.length > 100) errors.name = "Please keep your name under 100 characters.";
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Please enter a valid email address, like name@example.com.";
  if (values.message.trim().length < 10) errors.message = "Please write at least a sentence (10 characters or more).";
  else if (values.message.length > 5000) errors.message = "Please keep your message under 5,000 characters.";
  return errors;
}

/**
 * Posts to the existing Formspree form, which validates server-side and
 * forwards the message by email. Success is shown only after Formspree
 * confirms the submission.
 */
export function ContactForm({ endpoint, email }: { endpoint: string; email: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    const nextErrors = validate(values);
    setErrors(nextErrors);
    const firstInvalid = (Object.keys(nextErrors) as Field[])[0];
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    // Honeypot: real visitors never see or fill this field.
    if (String(data.get("_gotcha") ?? "") !== "") {
      setStatus({ state: "failed", message: "The message could not be sent." });
      return;
    }

    setStatus({ state: "sending" });
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        form.reset();
        setStatus({ state: "sent" });
        return;
      }
      const body: { errors?: { message?: string }[] } = await response.json().catch(() => ({}));
      const detail = body.errors?.map((error) => error.message).filter(Boolean).join(" ");
      setStatus({ state: "failed", message: detail || "The form service did not accept the message." });
    } catch {
      setStatus({ state: "failed", message: "The message could not reach the form service. Check your connection." });
    }
  }

  if (status.state === "sent") {
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-ink-2 p-8">
        <CircleCheck className="size-8 text-success" aria-hidden="true" />
        <p className="text-2xl font-medium tracking-tight">Message sent. Thank you.</p>
        <p className="text-fg-muted">It has been delivered to my inbox, and I will reply by email.</p>
        <button
          type="button"
          onClick={() => setStatus({ state: "idle" })}
          className="mt-2 min-h-11 rounded-full border border-line-strong px-5 text-sm transition-colors hover:border-fg"
        >
          Send another message
        </button>
      </div>
    );
  }

  const sending = status.state === "sending";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-6" aria-describedby="form-note">
      <div className="grid gap-6 sm:grid-cols-2">
        <FieldShell id="contact-name" label="Name" error={errors.name}>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={inputClass(errors.name)}
          />
        </FieldShell>
        <FieldShell id="contact-email" label="Email" error={errors.email}>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={inputClass(errors.email)}
          />
        </FieldShell>
      </div>
      <FieldShell id="contact-message" label="Message" error={errors.message}>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          maxLength={5000}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={`${inputClass(errors.message)} resize-y`}
        />
      </FieldShell>

      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="contact-gotcha">Leave this field empty</label>
        <input id="contact-gotcha" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="_subject" value="New message from the portfolio" />

      <div aria-live="polite">
        {status.state === "failed" ? (
          <p role="alert" className="flex gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm text-fg">
            <CircleAlert className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden="true" />
            <span>
              {status.message} You can also email me directly at{" "}
              <a href={`mailto:${email}`} className="underline underline-offset-4">
                {email}
              </a>
              .
            </span>
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p id="form-note" className="text-sm text-fg-subtle">
          Sent securely through Formspree. Your details are used only to reply.
        </p>
        <button
          type="submit"
          disabled={sending}
          className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-fg px-6 font-medium text-ink transition-colors hover:bg-accent disabled:cursor-wait disabled:opacity-70"
        >
          {sending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              Sending
            </>
          ) : (
            <>
              Send message
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function inputClass(error?: string) {
  return `block w-full rounded-xl border bg-ink-2 px-4 py-3 text-base text-fg placeholder:text-fg-subtle transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-accent ${
    error ? "border-danger/60" : "border-line-strong hover:border-white/25"
  }`;
}

function FieldShell({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-fg-muted">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 flex items-center gap-2 text-sm text-danger">
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
