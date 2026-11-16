export type Placeholder = {
  readonly kind: "placeholder";
  readonly note: string;
  readonly fallback: string | null;
};

export type Copy = string | Placeholder;

export type PlaceholderMode = "show" | "hide";

export type ResolvedCopy = {
  readonly text: string;
  readonly pendingNote: string | null;
};

export const placeholder = (
  note: string,
  fallback: string | null = null,
): Placeholder => ({ kind: "placeholder", note, fallback });

export const isPlaceholder = (copy: Copy): copy is Placeholder =>
  typeof copy !== "string";

export const isConfirmed = (copy: Copy): copy is string =>
  typeof copy === "string";

export const placeholderModeFor = (
  nodeEnv: string | undefined,
): PlaceholderMode => (nodeEnv === "production" ? "hide" : "show");

export const resolveCopy = (
  copy: Copy,
  mode: PlaceholderMode,
): ResolvedCopy | null => {
  if (isConfirmed(copy)) {
    return { text: copy, pendingNote: null };
  }
  if (mode === "show") {
    return { text: copy.fallback ?? "", pendingNote: copy.note };
  }
  return copy.fallback === null
    ? null
    : { text: copy.fallback, pendingNote: null };
};
