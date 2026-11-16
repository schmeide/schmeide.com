import { Heading } from "@/components/layout/heading";
import { Section } from "@/components/layout/section";
import { SectionIntro } from "@/components/layout/section-intro";
import { Stack } from "@/components/layout/stack";
import type { HowItWorksContent } from "@/content";
import { PipelineStep } from "./pipeline-step";

export type HowItWorksProps = {
  readonly content: HowItWorksContent;
};

const HEADING_ID = "how-heading";

export const HowItWorks = ({ content }: HowItWorksProps) => {
  const labels = {
    owner: content.ownerLabel,
    we: content.weLabel,
    checks: content.checksLabel,
  };
  const numbered = content.steps.map((step, index) => ({
    step,
    number: index + 1,
  }));
  return (
    <Section id="how" labelledBy={HEADING_ID} tone="mint" spacing="regular">
      <Stack gap="section">
        <SectionIntro
          id={HEADING_ID}
          heading={content.heading}
          lead={content.lead}
          tone="light"
          size="display-2"
        />
        {content.phases.map((phase) => {
          const steps = numbered.filter(({ step }) => step.phase === phase.id);
          return (
            <div key={phase.id} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 border-t-2 border-ink pt-6">
                <Heading level={3} size="title" id={null}>
                  {phase.title}
                </Heading>
                <p className="max-w-prose text-ink-muted">{phase.summary}</p>
              </div>
              <ol
                role="list"
                start={steps[0]?.number ?? 1}
                className="flex flex-col"
              >
                {steps.map(({ step, number }) => (
                  <PipelineStep
                    key={step.id}
                    step={step}
                    number={number}
                    labels={labels}
                  />
                ))}
              </ol>
            </div>
          );
        })}
      </Stack>
    </Section>
  );
};
