import type { ReactNode } from "react";

export type HighlightProps = {
  readonly children: ReactNode;
};

export const Highlight = ({ children }: HighlightProps) => (
  <span className="inline-block rounded-highlight bg-butter px-1.5 py-1 leading-none">
    {children}
  </span>
);
