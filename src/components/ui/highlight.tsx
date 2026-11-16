import type { ReactNode } from "react";

export type HighlightProps = {
  readonly children: ReactNode;
};

export const Highlight = ({ children }: HighlightProps) => (
  <span className="rounded-highlight bg-butter box-decoration-clone px-1.5">
    {children}
  </span>
);
