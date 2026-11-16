import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Container } from "./container";

export type SectionTone = "surface" | "mint" | "ink";

export type SectionSpacing = "regular" | "hero" | "joined";

export type SectionProps = {
  readonly id: string | null;
  readonly labelledBy: string;
  readonly tone: SectionTone;
  readonly spacing: SectionSpacing;
  readonly children: ReactNode;
};

const tones = {
  surface: "bg-surface text-ink",
  mint: "bg-mint text-ink",
  ink: "bg-ink text-surface",
} as const satisfies Record<SectionTone, string>;

const spacings = {
  regular: "py-section",
  hero: "pt-8 pb-section sm:pt-14",
  joined: "pb-section",
} as const satisfies Record<SectionSpacing, string>;

export const Section = ({
  id,
  labelledBy,
  tone,
  spacing,
  children,
}: SectionProps) => (
  <section
    id={id ?? undefined}
    aria-labelledby={labelledBy}
    data-tone={tone}
    className={cx(tones[tone], spacings[spacing])}
  >
    <Container>{children}</Container>
  </section>
);
