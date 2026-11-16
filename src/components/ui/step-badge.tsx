import type { ReactNode } from "react";

export type StepBadgeProps = {
  readonly children: ReactNode;
};

export const StepBadge = ({ children }: StepBadgeProps) => (
  <span
    aria-hidden="true"
    className="inline-flex size-badge shrink-0 items-center justify-center rounded-badge bg-butter font-bold text-ink"
  >
    {children}
  </span>
);
