import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type CardTone = "surface" | "mint" | "ink";

export type CardRadius = "card" | "panel" | "panel-large";

export type CardPadding = "regular" | "roomy";

export type CardProps = {
  readonly tone: CardTone;
  readonly radius: CardRadius;
  readonly padding: CardPadding;
  readonly children: ReactNode;
};

const tones = {
  surface: "bg-surface text-ink",
  mint: "bg-mint text-ink",
  ink: "bg-ink text-surface",
} as const satisfies Record<CardTone, string>;

const radii = {
  card: "rounded-card",
  panel: "rounded-panel",
  "panel-large": "rounded-panel-lg",
} as const satisfies Record<CardRadius, string>;

const paddings = {
  regular: "p-6 sm:p-8",
  roomy: "p-6 sm:p-10 lg:p-16",
} as const satisfies Record<CardPadding, string>;

export const Card = ({ tone, radius, padding, children }: CardProps) => (
  <div
    data-tone={tone}
    className={cx("h-full", tones[tone], radii[radius], paddings[padding])}
  >
    {children}
  </div>
);
