import type { ReactNode } from "react";
import { Section } from "@/components/layout/section";
import { SectionIntro } from "@/components/layout/section-intro";
import { Card } from "@/components/ui/card";
import { CopyText } from "@/components/ui/copy-text";
import type { EarlyAccessContent } from "@/content";
import { isShown } from "@/lib/copy";

export type EarlyAccessProps = {
  readonly content: EarlyAccessContent;
  readonly children: ReactNode;
};

const HEADING_ID = "early-access-heading";

export const EarlyAccess = ({ content, children }: EarlyAccessProps) => (
  <Section
    id="early-access"
    labelledBy={HEADING_ID}
    tone="surface"
    spacing="joined"
  >
    <Card tone="ink" radius="panel-large" padding="roomy">
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <SectionIntro
            id={HEADING_ID}
            heading={content.heading}
            lead={content.lead}
            tone="ink"
            size="display-panel"
          />
          {isShown(content.explainer) ? (
            <p className="max-w-prose text-on-ink-muted">
              <CopyText copy={content.explainer} />
            </p>
          ) : null}
          {isShown(content.pricing) ? (
            <p className="max-w-prose text-on-ink-muted">
              <CopyText copy={content.pricing} />
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </Card>
  </Section>
);
