import { CopyText } from "@/components/ui/copy-text";
import { isShown } from "@/lib/copy";
import type { Copy } from "@/lib/placeholder";
import { Heading } from "./heading";
import { Section } from "./section";

export type PageIntroProps = {
  readonly heading: string;
  readonly lead: Copy;
};

const HEADING_ID = "page-heading";

export const PageIntro = ({ heading, lead }: PageIntroProps) => (
  <Section id={null} labelledBy={HEADING_ID} tone="surface" spacing="hero">
    <div className="flex flex-col gap-6">
      <Heading level={1} size="display-1" id={HEADING_ID}>
        {heading}
      </Heading>
      {isShown(lead) ? (
        <p className="max-w-lead text-lead text-ink-muted">
          <CopyText copy={lead} />
        </p>
      ) : null}
    </div>
  </Section>
);
