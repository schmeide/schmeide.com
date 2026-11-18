import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { isPlainHref } from "@/lib/href";

export type TextLinkWeight = "regular" | "strong";

export type TextLinkProps = {
  readonly href: string;
  readonly weight: TextLinkWeight;
  readonly children: ReactNode;
};

const base =
  "inline-flex min-h-11 items-center underline underline-offset-4 hover:text-ink-strong";

const weights = {
  regular: "font-medium",
  strong: "font-semibold",
} as const satisfies Record<TextLinkWeight, string>;

export const TextLink = ({ href, weight, children }: TextLinkProps) =>
  isPlainHref(href) ? (
    <a href={href} className={cx(base, weights[weight])}>
      {children}
    </a>
  ) : (
    <Link href={href as Route} className={cx(base, weights[weight])}>
      {children}
    </Link>
  );
