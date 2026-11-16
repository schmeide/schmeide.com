import { CopyText } from "@/components/ui/copy-text";
import { isShown } from "@/lib/copy";
import { cx } from "@/lib/cx";
import type { Copy } from "@/lib/placeholder";
import { Heading } from "./heading";
import type { HeadingSize } from "./heading";

export type SectionIntroTone = "light" | "ink";

export type SectionIntroProps = {
  readonly id: string;
  readonly heading: string;
  readonly lead: Copy | null;
  readonly tone: SectionIntroTone;
  readonly size: Extract<HeadingSize, "display-2" | "display-panel">;
};

const leadTones = {
  light: "text-ink-muted",
  ink: "text-on-ink-muted",
} as const satisfies Record<SectionIntroTone, string>;

export const SectionIntro = ({
  id,
  heading,
  lead,
  tone,
  size,
}: SectionIntroProps) => (
  <div className="flex flex-col gap-5">
    <Heading level={2} size={size} id={id}>
      {heading}
    </Heading>
    {isShown(lead) ? (
      <p className={cx("max-w-prose text-lead", leadTones[tone])}>
        <CopyText copy={lead} />
      </p>
    ) : null}
  </div>
);
