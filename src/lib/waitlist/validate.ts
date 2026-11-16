import { err, ok } from "@/lib/result";
import type {
  FieldErrors,
  ValidateWaitlist,
  WaitlistEntry,
  WaitlistError,
  WaitlistInput,
} from "./types";

export const BUSINESS_MAX_LENGTH = 280;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const trimAll = (input: WaitlistInput): WaitlistEntry => ({
  name: input.name.trim(),
  email: input.email.trim(),
  business: input.business.trim(),
});

const nameError = (name: string): WaitlistError | null =>
  name === "" ? "name_required" : null;

const emailError = (email: string): WaitlistError | null => {
  if (email === "") {
    return "email_required";
  }
  return EMAIL_PATTERN.test(email) ? null : "email_invalid";
};

const businessError = (business: string): WaitlistError | null => {
  if (business === "") {
    return "business_required";
  }
  return business.length > BUSINESS_MAX_LENGTH ? "business_too_long" : null;
};

const collectErrors = (entry: WaitlistEntry): FieldErrors => {
  const name = nameError(entry.name);
  const email = emailError(entry.email);
  const business = businessError(entry.business);
  return {
    ...(name ? { name } : {}),
    ...(email ? { email } : {}),
    ...(business ? { business } : {}),
  };
};

export const validateWaitlist: ValidateWaitlist = (input) => {
  const entry = trimAll(input);
  const errors = collectErrors(entry);
  return Object.keys(errors).length === 0 ? ok(entry) : err(errors);
};
