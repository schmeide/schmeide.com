import type { Result } from "@/lib/result";
import type { StartingPointId } from "@/lib/starting-points";

export type WaitlistField = "name" | "email" | "business";

export type WaitlistInput = Readonly<Record<WaitlistField, string>>;

export type WaitlistEntry = Readonly<Record<WaitlistField, string>> & {
  readonly startingPoint?: StartingPointId;
};

export type WaitlistError =
  | "name_required"
  | "email_required"
  | "email_invalid"
  | "business_required"
  | "business_too_long";

export type FieldErrors = Readonly<
  Partial<Record<WaitlistField, WaitlistError>>
>;

export type ValidateWaitlist = (
  input: WaitlistInput,
) => Result<WaitlistEntry, FieldErrors>;

export type SubmitResult =
  | { readonly status: "saved" }
  | { readonly status: "unconfigured" }
  | { readonly status: "failed"; readonly reason: "network" | "rejected" };

export type WaitlistAdapter = (entry: WaitlistEntry) => Promise<SubmitResult>;

export type SubmitWaitlist = WaitlistAdapter;
