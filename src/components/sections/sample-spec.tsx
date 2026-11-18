import { Heading } from "@/components/layout/heading";
import { Section } from "@/components/layout/section";
import { SectionIntro } from "@/components/layout/section-intro";
import { CopyText } from "@/components/ui/copy-text";
import type { SpecPart } from "@/content";
import { isShown } from "@/lib/copy";
import type { Copy } from "@/lib/placeholder";

export type SampleSpecProps = {
  readonly heading: string;
  readonly lead: string;
  readonly labels: Readonly<Record<SpecPart, string>>;
  readonly spec: Readonly<Record<SpecPart, Copy>>;
};

const HEADING_ID = "spec-heading";

const PARTS: readonly SpecPart[] = [
  "users",
  "does",
  "screens",
  "keeps",
  "replaces",
];

export const SampleSpec = ({
  heading,
  lead,
  labels,
  spec,
}: SampleSpecProps) => {
  const shown = PARTS.filter((part) => isShown(spec[part]));
  return shown.length === 0 ? null : (
    <Section id={null} labelledBy={HEADING_ID} tone="surface" spacing="regular">
      <div className="flex flex-col gap-10">
        <SectionIntro
          id={HEADING_ID}
          heading={heading}
          lead={lead}
          tone="light"
          size="display-2"
        />
        <dl className="grid gap-8 md:grid-cols-2">
          {shown.map((part) => (
            <div key={part} className="flex flex-col gap-2">
              <dt>
                <Heading level={3} size="title" id={null}>
                  {labels[part]}
                </Heading>
              </dt>
              <dd className="max-w-prose text-ink-muted">
                <CopyText copy={spec[part]} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
};
