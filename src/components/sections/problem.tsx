import { Heading } from "@/components/layout/heading";
import { Section } from "@/components/layout/section";
import { SectionIntro } from "@/components/layout/section-intro";
import { CopyText } from "@/components/ui/copy-text";
import { RoundedImage } from "@/components/ui/rounded-image";
import type { ProblemContent } from "@/content";
import { isShown } from "@/lib/copy";

export type ProblemProps = {
  readonly content: ProblemContent;
};

const HEADING_ID = "problem-heading";

export const Problem = ({ content }: ProblemProps) => (
  <Section id="problem" labelledBy={HEADING_ID} tone="surface" spacing="joined">
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-14">
      <div className="flex flex-col gap-10">
        <SectionIntro
          id={HEADING_ID}
          heading={content.heading}
          lead={content.lead}
          tone="light"
          size="display-2"
        />
        {content.image === null ? null : (
          <RoundedImage
            image={content.image}
            sizes="(min-width: 1024px) 560px, 100vw"
            radius="card"
            priority={false}
          />
        )}
      </div>
      <ul role="list" className="flex flex-col">
        {content.points
          .filter((point) => isShown(point.body))
          .map((point) => (
            <li
              key={point.title}
              className="flex flex-col gap-2 border-t border-on-ink-muted py-7 first:border-t-0 first:pt-0 lg:first:pt-2"
            >
              <Heading level={3} size="title" id={null}>
                {point.title}
              </Heading>
              <p className="max-w-prose text-ink-muted">
                <CopyText copy={point.body} />
              </p>
            </li>
          ))}
      </ul>
    </div>
  </Section>
);
