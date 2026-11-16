import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type StackGap = "tight" | "regular" | "loose" | "section";

export type StackProps = {
  readonly gap: StackGap;
  readonly children: ReactNode;
};

const gaps = {
  tight: "gap-2",
  regular: "gap-5",
  loose: "gap-10",
  section: "gap-12 lg:gap-16",
} as const satisfies Record<StackGap, string>;

export const Stack = ({ gap, children }: StackProps) => (
  <div className={cx("flex flex-col", gaps[gap])}>{children}</div>
);
