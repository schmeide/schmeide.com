import { Heading } from "@/components/layout/heading";
import { Section } from "@/components/layout/section";
import { CopyText } from "@/components/ui/copy-text";
import { TextLink } from "@/components/ui/text-link";
import type { LinkContent } from "@/content";
import { isShown } from "@/lib/copy";
import type { Copy } from "@/lib/placeholder";

export type MessagePageProps = {
  readonly heading: string;
  readonly body: Copy;
  readonly homeLink: LinkContent;
};

const HEADING_ID = "page-heading";

export const MessagePage = ({ heading, body, homeLink }: MessagePageProps) => (
  <Section id={null} labelledBy={HEADING_ID} tone="surface" spacing="regular">
    <div className="flex flex-col items-start gap-6">
      <Heading level={1} size="display-2" id={HEADING_ID}>
        {heading}
      </Heading>
      {isShown(body) ? (
        <p className="max-w-prose text-lead text-ink-muted">
          <CopyText copy={body} />
        </p>
      ) : null}
      <TextLink href={homeLink.href} weight="strong">
        {homeLink.label}
      </TextLink>
    </div>
  </Section>
);
