import { Heading } from "@/components/layout/heading";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button-link";
import { CopyText } from "@/components/ui/copy-text";
import { Highlight } from "@/components/ui/highlight";
import { RoundedImage } from "@/components/ui/rounded-image";
import { TextLink } from "@/components/ui/text-link";
import type { HeroContent } from "@/content";
import { Conversation } from "./conversation";

export type HeroProps = {
  readonly content: HeroContent;
};

const HEADING_ID = "hero-heading";

export const Hero = ({ content }: HeroProps) => (
  <Section id={null} labelledBy={HEADING_ID} tone="surface" spacing="hero">
    <div className="grid items-center gap-14 lg:grid-cols-2">
      <div>
        <Heading level={1} size="display-1" id={HEADING_ID}>
          {content.heading.before}
          <Highlight>{content.heading.highlight}</Highlight>
          {content.heading.after}
        </Heading>
        <p className="mt-7 max-w-lead text-lead font-semibold text-ink">
          <CopyText copy={content.accountability} />
        </p>
        <p className="mt-3 max-w-lead text-lead text-ink-muted">
          {content.lead}
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
          <ButtonLink
            href={content.primaryCta.href}
            variant="primary"
            size="large"
          >
            {content.primaryCta.label}
          </ButtonLink>
          <TextLink href={content.secondaryCta.href} weight="strong">
            {content.secondaryCta.label}
          </TextLink>
        </div>
      </div>
      {content.image === null ? (
        <Conversation content={content.conversation} overlapping={false} />
      ) : (
        <div>
          <div className="ml-auto w-5/6 sm:w-3/4">
            <RoundedImage
              image={content.image}
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 75vw, 83vw"
              radius="panel"
              priority
            />
          </div>
          <Conversation content={content.conversation} overlapping />
        </div>
      )}
    </div>
  </Section>
);
