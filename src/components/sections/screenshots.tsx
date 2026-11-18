import { Section } from "@/components/layout/section";
import { SectionIntro } from "@/components/layout/section-intro";
import { CopyText } from "@/components/ui/copy-text";
import { RoundedImage } from "@/components/ui/rounded-image";
import { isShown } from "@/lib/copy";
import type { ImageSlot } from "@/lib/images/types";
import type { Placeholder } from "@/lib/placeholder";

export type ScreenshotsProps = {
  readonly heading: string;
  readonly images: readonly ImageSlot[] | Placeholder;
};

const HEADING_ID = "screenshots-heading";

export const Screenshots = ({ heading, images }: ScreenshotsProps) => {
  const pending = "kind" in images ? images : null;
  const slots = "kind" in images ? [] : images;
  if (pending === null ? slots.length === 0 : !isShown(pending)) {
    return null;
  }
  return (
    <Section id={null} labelledBy={HEADING_ID} tone="surface" spacing="joined">
      <div className="flex flex-col gap-10">
        <SectionIntro
          id={HEADING_ID}
          heading={heading}
          lead={null}
          tone="light"
          size="display-2"
        />
        {pending !== null ? (
          <p className="max-w-prose text-ink-muted">
            <CopyText copy={pending} />
          </p>
        ) : (
          <ul role="list" className="grid gap-8 md:grid-cols-2">
            {slots.map((image) => (
              <li key={image.name}>
                <RoundedImage
                  image={image}
                  sizes="(min-width: 768px) 560px, 100vw"
                  radius="card"
                  priority={false}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
};
