import { createElement } from "react";
import type { ReactNode } from "react";

export type HeadingLevel = 1 | 2 | 3 | 4;

export type HeadingSize =
  "display-1" | "display-2" | "display-panel" | "title" | "subtitle";

export type HeadingProps = {
  readonly level: HeadingLevel;
  readonly size: HeadingSize;
  readonly id: string | null;
  readonly children: ReactNode;
};

const tags = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
} as const satisfies Record<HeadingLevel, string>;

const sizes = {
  "display-1": "font-display text-display-1 font-normal text-balance",
  "display-2": "font-display text-display-2 font-normal text-balance",
  "display-panel": "font-display text-display-panel font-normal text-balance",
  title: "text-title font-bold text-balance",
  subtitle: "text-lead font-bold",
} as const satisfies Record<HeadingSize, string>;

export const Heading = ({ level, size, id, children }: HeadingProps) =>
  createElement(
    tags[level],
    { id: id ?? undefined, className: sizes[size] },
    children,
  );
