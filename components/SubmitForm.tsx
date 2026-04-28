"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

interface FormState {
  name: string;
  industry: string;
  website: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  hp: string;
}

const EMPTY: FormState = {
  name: "",
  industry: "",
  website: "",
  ownerName: "",
  email: "",
  phone: "",
  location: "",
  description: "",
  hp: "",
};

export function SubmitForm() {
  const [values, setValues] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (json.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setError(messageFor(json.error));
      }
    } catch {
      setStatus("error");
      setError("Couldn't reach the server. Try again in a moment.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-ink-line/70 bg-gradient-to-br from-white to-crab/5 p-10">
        <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-crab">
          Submitted
        </div>
        <h2 className="display-2 mt-3 text-ink">Thanks. We've got it.</h2>
        <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink/80">
          We'll review the listing and add it to the directory in the next sync.
          Welcome to the community.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(EMPTY);
            setStatus("idle");
          }}
          className="mt-8 inline-flex h-11 items-center rounded-full border border-ink/15 bg-white px-6 text-[14px] font-semibold text-ink transition-colors hover:border-ink/40"
        >
          Submit another
        </button>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <Field
        label="Business name"
        required
        value={values.name}
        onChange={(v) => update("name", v)}
        placeholder="Render Safe Coffee Co."
        autoComplete="organization"
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Industry"
          required
          value={values.industry}
          onChange={(v) => update("industry", v)}
          placeholder="Coffee roastery"
        />
        <Field
          label="Location"
          required
          value={values.location}
          onChange={(v) => update("location", v)}
          placeholder="Asheville, NC"
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Owner name"
          required
          value={values.ownerName}
          onChange={(v) => update("ownerName", v)}
          placeholder="Jake Morrison"
          autoComplete="name"
        />
        <Field
          label="Your email"
          value={values.email}
          onChange={(v) => update("email", v)}
          placeholder="you@example.com"
          type="email"
          autoComplete="email"
          hint="Not displayed publicly. Lets us follow up if needed."
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Website"
          value={values.website}
          onChange={(v) => update("website", v)}
          placeholder="rendersafe.coffee"
          type="url"
          autoComplete="url"
        />
        <Field
          label="Phone"
          value={values.phone}
          onChange={(v) => update("phone", v)}
          placeholder="555-555-5555"
          type="tel"
          autoComplete="tel"
        />
      </div>
      <TextArea
        label="Description"
        value={values.description}
        onChange={(v) => update("description", v)}
        placeholder="A short blurb about what you do and who you serve."
        rows={4}
      />

      {/* Honeypot — must stay empty. Hidden visually + from assistive tech. */}
      <input
        type="text"
        name="hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={values.hp}
        onChange={(e) => update("hp", e.target.value)}
        style={{
          position: "absolute",
          left: "-9999px",
          width: 1,
          height: 1,
          opacity: 0,
        }}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-12 items-center rounded-full bg-crab px-7 text-[14px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(208,74,23,0.55)] transition-all hover:bg-crab-deep hover:shadow-[0_10px_28px_-8px_rgba(208,74,23,0.7)] disabled:opacity-60 disabled:hover:bg-crab"
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>
        <span className="text-[13px] text-ink-muted">
          Required: name, industry, location, owner.
        </span>
      </div>
    </form>
  );
}

function messageFor(code: string | undefined): string {
  switch (code) {
    case "missing_required":
      return "Please fill in business name, industry, location, and owner.";
    case "form_rejected":
      return "Google rejected the submission. Try again, or use the FB group as a fallback.";
    case "network":
      return "Couldn't reach the server. Try again in a moment.";
    default:
      return "Something went wrong. Try again, or DM in the FB group.";
  }
}

function Field({
  label,
  required,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  hint,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        {label}
        {required && <span className="ml-1 text-crab">·</span>}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-xl border border-ink-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink-muted/70 transition-colors focus:border-crab focus:outline-none focus:ring-4 focus:ring-crab/15"
      />
      {hint && (
        <span className="mt-1.5 block text-[12px] text-ink-muted">{hint}</span>
      )}
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full resize-y rounded-xl border border-ink-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink-muted/70 transition-colors focus:border-crab focus:outline-none focus:ring-4 focus:ring-crab/15"
      />
    </label>
  );
}
