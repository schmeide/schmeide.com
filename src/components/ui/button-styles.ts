import { cx } from "@/lib/cx";

export type ButtonVariant = "primary" | "butter";

export type ButtonSize = "regular" | "large";

const base =
  "inline-flex min-h-11 items-center justify-center text-center font-semibold no-underline motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-gentle";

const variants = {
  primary: "bg-ink text-surface hover:bg-ink-strong",
  butter: "bg-butter text-ink hover:bg-surface",
} as const satisfies Record<ButtonVariant, string>;

const sizes = {
  regular: "rounded-button px-5 py-3",
  large: "rounded-button-lg px-7 py-4",
} as const satisfies Record<ButtonSize, string>;

export const buttonClass = (variant: ButtonVariant, size: ButtonSize): string =>
  cx(base, variants[variant], sizes[size]);
