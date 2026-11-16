import { Heading } from "@/components/layout/heading";
import { Section } from "@/components/layout/section";
import { SectionIntro } from "@/components/layout/section-intro";
import { Stack } from "@/components/layout/stack";
import { Card } from "@/components/ui/card";
import { CopyText } from "@/components/ui/copy-text";
import type { ProofContent } from "@/content";
import { isShown } from "@/lib/copy";

export type ProofProps = {
  readonly content: ProofContent;
};

const HEADING_ID = "proof-heading";

export const Proof = ({ content }: ProofProps) => {
  const details = content.details.filter(isShown);
  const stories = content.stories.filter(isShown);
  return (
    <Section id="proof" labelledBy={HEADING_ID} tone="mint" spacing="regular">
      <Stack gap="section">
        <SectionIntro
          id={HEADING_ID}
          heading={content.heading}
          lead={content.lead}
          tone="light"
          size="display-2"
        />
        <div className="grid gap-5 lg:grid-cols-12">
          {isShown(content.quark.body) ? (
            <div className="lg:col-span-7">
              <Card tone="surface" radius="panel" padding="roomy">
                <div className="flex flex-col gap-4">
                  <Heading level={3} size="display-panel" id={null}>
                    {content.quark.title}
                  </Heading>
                  <p className="max-w-prose text-lead">
                    <CopyText copy={content.quark.body} />
                  </p>
                  {details.length === 0 ? null : (
                    <ul role="list" className="flex flex-col gap-2">
                      {details.map((detail, index) => (
                        <li key={index} className="text-ink-muted">
                          <CopyText copy={detail} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Card>
            </div>
          ) : null}
          {stories.length === 0 ? null : (
            <ul role="list" className="flex flex-col gap-5 lg:col-span-5">
              {stories.map((story, index) => (
                <li key={index} className="flex-1">
                  <Card tone="ink" radius="card" padding="regular">
                    <p className="text-on-ink-muted">
                      <CopyText copy={story} />
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Stack>
    </Section>
  );
};
