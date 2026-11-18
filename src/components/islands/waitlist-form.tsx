"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { buttonClass } from "@/components/ui/button-styles";
import type { WaitlistFormContent } from "@/content";
import { cx } from "@/lib/cx";
import { startingPointFrom } from "@/lib/starting-points";
import { submitWaitlist } from "@/lib/waitlist/submit";
import type {
  FieldErrors,
  SubmitResult,
  WaitlistField,
  WaitlistInput,
} from "@/lib/waitlist/types";
import { validateWaitlist } from "@/lib/waitlist/validate";

export type WaitlistFormProps = {
  readonly content: WaitlistFormContent;
};

type Status = "idle" | "submitting" | SubmitResult["status"];

type FormState = {
  readonly status: Status;
  readonly errors: FieldErrors;
};

type FieldSpec = {
  readonly name: WaitlistField;
  readonly type: "text" | "email";
  readonly autoComplete: "name" | "email" | "organization-title";
};

const HONEYPOT_NAME = "website";

const FIELDS: readonly FieldSpec[] = [
  { name: "name", type: "text", autoComplete: "name" },
  { name: "email", type: "email", autoComplete: "email" },
  { name: "business", type: "text", autoComplete: "organization-title" },
];

const INITIAL: FormState = { status: "idle", errors: {} };

const readText = (data: FormData, name: string): string => {
  const value = data.get(name);
  return typeof value === "string" ? value : "";
};

const readInput = (data: FormData): WaitlistInput => ({
  name: readText(data, "name"),
  email: readText(data, "email"),
  business: readText(data, "business"),
});

const firstInvalid = (errors: FieldErrors): WaitlistField | null =>
  FIELDS.find((field) => errors[field.name] !== undefined)?.name ?? null;

const focusField = (form: HTMLFormElement, name: WaitlistField): void => {
  const field = form.elements.namedItem(name);
  if (field instanceof HTMLElement) {
    field.focus();
  }
};

const messageFor = (
  status: Status,
  content: WaitlistFormContent,
): string | null => {
  if (status === "unconfigured") {
    return content.unconfigured;
  }
  return status === "failed" ? content.failed : null;
};

export const WaitlistForm = ({ content }: WaitlistFormProps) => {
  const [state, setState] = useState<FormState>(INITIAL);
  const savedRef = useRef<HTMLParagraphElement>(null);
  const submitting = state.status === "submitting";
  const message = messageFor(state.status, content);

  useEffect(() => {
    if (state.status === "saved") {
      savedRef.current?.focus();
    }
  }, [state.status]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) {
      return;
    }
    const form = event.currentTarget;
    const data = new FormData(form);
    if (readText(data, HONEYPOT_NAME) !== "") {
      setState({ status: "saved", errors: {} });
      return;
    }
    const validated = validateWaitlist(readInput(data));
    if (!validated.ok) {
      setState({ status: "idle", errors: validated.error });
      const invalid = firstInvalid(validated.error);
      if (invalid !== null) {
        focusField(form, invalid);
      }
      return;
    }
    setState({ status: "submitting", errors: {} });
    const start = startingPointFrom(window.location.search);
    const result = await submitWaitlist(
      start === null
        ? validated.value
        : { ...validated.value, startingPoint: start },
    );
    setState({ status: result.status, errors: {} });
  };

  if (state.status === "saved") {
    return (
      <p
        ref={savedRef}
        tabIndex={-1}
        role="status"
        className="self-center text-title font-bold"
      >
        {content.saved}
      </p>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
      <noscript>
        <p className="rounded-input bg-butter px-4 py-3 font-semibold text-ink">
          {content.needsJavaScript}
        </p>
      </noscript>
      {FIELDS.map((field) => {
        const error = state.errors[field.name];
        const example = content.fields[field.name].example;
        const errorId = `waitlist-${field.name}-error`;
        const hintId = `waitlist-${field.name}-hint`;
        return (
          <div key={field.name} className="flex flex-col gap-1.5">
            <label htmlFor={`waitlist-${field.name}`} className="font-semibold">
              {content.fields[field.name].label}
            </label>
            {example === null ? null : (
              <p id={hintId} className="text-small text-on-ink-muted">
                {example}
              </p>
            )}
            <input
              id={`waitlist-${field.name}`}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              required
              aria-invalid={error !== undefined}
              aria-describedby={
                cx(error && errorId, example !== null && hintId) || undefined
              }
              className={cx(
                "min-h-11 rounded-input border-2 bg-surface px-4 py-3 text-ink",
                error ? "border-butter" : "border-surface",
              )}
            />
            {error === undefined ? null : (
              <p id={errorId} className="font-semibold text-butter">
                {content.errors[error]}
              </p>
            )}
          </div>
        );
      })}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="waitlist-website">{content.honeypotLabel}</label>
        <input
          id="waitlist-website"
          name={HONEYPOT_NAME}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <button
        type="submit"
        aria-disabled={submitting}
        className={cx(
          buttonClass("butter", "regular"),
          "cursor-pointer self-start aria-disabled:cursor-progress aria-disabled:opacity-60",
        )}
      >
        {submitting ? content.submittingLabel : content.submitLabel}
      </button>
      <p role="alert" className="font-semibold text-butter empty:hidden">
        {message}
      </p>
    </form>
  );
};
