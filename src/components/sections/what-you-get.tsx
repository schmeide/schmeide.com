import { Heading } from "@/components/layout/heading";
import { Section } from "@/components/layout/section";
import { SectionIntro } from "@/components/layout/section-intro";
import { Card } from "@/components/ui/card";
import { CopyText } from "@/components/ui/copy-text";
import type { WhatYouGetContent } from "@/content";
import { isShown } from "@/lib/copy";
import { DashboardPreview } from "./dashboard-preview";

export type WhatYouGetProps = {
  readonly content: WhatYouGetContent;
};

const HEADING_ID = "what-you-get-heading";

export const WhatYouGet = ({ content }: WhatYouGetProps) => (
  <Section
    id="what-you-get"
    labelledBy={HEADING_ID}
    tone="surface"
    spacing="regular"
  >
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
      <div className="flex flex-col gap-10 lg:col-span-5">
        <SectionIntro
          id={HEADING_ID}
          heading={content.heading}
          lead={content.lead}
          tone="light"
          size="display-2"
        />
        {isShown(content.preview.caption) ? (
          <DashboardPreview content={content.preview} />
        ) : null}
      </div>
      <ul role="list" className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
        {content.items
          .filter((item) => isShown(item.body))
          .map((item) => (
            <li key={item.title}>
              <Card tone="mint" radius="card" padding="regular">
                <div className="flex flex-col gap-2">
                  <Heading level={3} size="title" id={null}>
                    {item.title}
                  </Heading>
                  <p className="text-ink-muted">
                    <CopyText copy={item.body} />
                  </p>
                </div>
              </Card>
            </li>
          ))}
      </ul>
    </div>
  </Section>
);
