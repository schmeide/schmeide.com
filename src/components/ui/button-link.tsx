import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { isPlainHref } from "@/lib/href";
import { buttonClass } from "./button-styles";
import type { ButtonSize, ButtonVariant } from "./button-styles";

export type ButtonLinkProps = {
  readonly href: string;
  readonly variant: ButtonVariant;
  readonly size: ButtonSize;
  readonly children: ReactNode;
};

export const ButtonLink = ({
  href,
  variant,
  size,
  children,
}: ButtonLinkProps) =>
  isPlainHref(href) ? (
    <a href={href} className={buttonClass(variant, size)}>
      {children}
    </a>
  ) : (
    <Link href={href as Route} className={buttonClass(variant, size)}>
      {children}
    </Link>
  );
