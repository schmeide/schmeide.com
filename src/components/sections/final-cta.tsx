import { Section } from "@/components/layout/section";
import { SectionIntro } from "@/components/layout/section-intro";
import { ButtonLink } from "@/components/ui/button-link";
import type { FinalCtaContent } from "@/content";

export type FinalCtaProps = {
  readonly content: FinalCtaContent;
  readonly cta: { readonly label: string; readonly href: string };
};

const HEADING_ID = "final-cta-heading";

export const FinalCta = ({ content, cta }: FinalCtaProps) => (
  <Section id={null} labelledBy={HEADING_ID} tone="mint" spacing="regular">
    <div className="flex flex-col items-start gap-9">
      <SectionIntro
        id={HEADING_ID}
        heading={content.heading}
        lead={content.lead}
        tone="light"
        size="display-2"
      />
      <ButtonLink href={cta.href} variant="primary" size="large">
        {cta.label}
      </ButtonLink>
    </div>
  </Section>
);
