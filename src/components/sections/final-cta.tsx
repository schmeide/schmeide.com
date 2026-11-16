import { Section } from "@/components/layout/section";
import { SectionIntro } from "@/components/layout/section-intro";
import { ButtonLink } from "@/components/ui/button-link";
import type { FinalCtaContent } from "@/content";

export type FinalCtaProps = {
  readonly content: FinalCtaContent;
};

const HEADING_ID = "final-cta-heading";

export const FinalCta = ({ content }: FinalCtaProps) => (
  <Section id={null} labelledBy={HEADING_ID} tone="mint" spacing="regular">
    <div className="flex flex-col items-start gap-9">
      <SectionIntro
        id={HEADING_ID}
        heading={content.heading}
        lead={content.lead}
        tone="light"
        size="display-2"
      />
      <ButtonLink href={content.cta.href} variant="primary" size="large">
        {content.cta.label}
      </ButtonLink>
    </div>
  </Section>
);
