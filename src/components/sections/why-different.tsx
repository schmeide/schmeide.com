import { Heading } from "@/components/layout/heading";
import { Section } from "@/components/layout/section";
import { SectionIntro } from "@/components/layout/section-intro";
import { Stack } from "@/components/layout/stack";
import { CopyText } from "@/components/ui/copy-text";
import type { WhyDifferentContent } from "@/content";
import { isShown } from "@/lib/copy";

export type WhyDifferentProps = {
  readonly content: WhyDifferentContent;
};

const HEADING_ID = "why-different-heading";

export const WhyDifferent = ({ content }: WhyDifferentProps) => (
  <Section
    id="why-different"
    labelledBy={HEADING_ID}
    tone="ink"
    spacing="regular"
  >
    <Stack gap="section">
      <SectionIntro
        id={HEADING_ID}
        heading={content.heading}
        lead={content.lead}
        tone="ink"
        size="display-2"
      />
      <ul role="list" className="grid gap-x-14 sm:grid-cols-2">
        {content.items
          .filter((item) => isShown(item.body))
          .map((item) => (
            <li
              key={item.title}
              className="flex flex-col gap-2 border-t border-on-ink-muted py-7"
            >
              <Heading level={3} size="title" id={null}>
                {item.title}
              </Heading>
              <p className="max-w-prose text-on-ink-muted">
                <CopyText copy={item.body} />
              </p>
            </li>
          ))}
      </ul>
    </Stack>
  </Section>
);
