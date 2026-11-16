import { Section } from "@/components/layout/section";
import { SectionIntro } from "@/components/layout/section-intro";
import { ChevronIcon } from "@/components/ui/chevron-icon";
import { CopyText } from "@/components/ui/copy-text";
import type { FaqContent } from "@/content";
import { isShown } from "@/lib/copy";

export type FaqProps = {
  readonly content: FaqContent;
};

const HEADING_ID = "faq-heading";

export const Faq = ({ content }: FaqProps) => (
  <Section id="faq" labelledBy={HEADING_ID} tone="surface" spacing="joined">
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-4">
        <SectionIntro
          id={HEADING_ID}
          heading={content.heading}
          lead={content.lead}
          tone="light"
          size="display-2"
        />
      </div>
      <div className="flex flex-col gap-3 lg:col-span-8">
        {content.items
          .filter((item) => isShown(item.answer))
          .map((item) => (
            <details
              key={item.question}
              className="group rounded-disclosure bg-mint px-6 py-3"
            >
              <summary
                data-marker="none"
                className="flex min-h-11 list-none items-center justify-between gap-4 text-lead font-bold"
              >
                {item.question}
                <span className="group-open:rotate-180 motion-safe:transition-transform motion-safe:duration-150">
                  <ChevronIcon />
                </span>
              </summary>
              <p className="max-w-prose pt-1 pb-3 text-ink-muted">
                <CopyText copy={item.answer} />
              </p>
            </details>
          ))}
      </div>
    </div>
  </Section>
);
