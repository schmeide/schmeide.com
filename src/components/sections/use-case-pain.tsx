import { Section } from "@/components/layout/section";
import { SectionIntro } from "@/components/layout/section-intro";
import { isShown } from "@/lib/copy";
import type { Copy } from "@/lib/placeholder";

export type UseCasePainProps = {
  readonly heading: string;
  readonly pain: Copy;
};

const HEADING_ID = "pain-heading";

export const UseCasePain = ({ heading, pain }: UseCasePainProps) =>
  isShown(pain) ? (
    <Section id={null} labelledBy={HEADING_ID} tone="mint" spacing="regular">
      <SectionIntro
        id={HEADING_ID}
        heading={heading}
        lead={pain}
        tone="light"
        size="display-2"
      />
    </Section>
  ) : null;
