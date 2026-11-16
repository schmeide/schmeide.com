import { Heading } from "@/components/layout/heading";
import { Section } from "@/components/layout/section";
import { SectionIntro } from "@/components/layout/section-intro";
import { Stack } from "@/components/layout/stack";
import { Card } from "@/components/ui/card";
import { CopyText } from "@/components/ui/copy-text";
import { RoundedImage } from "@/components/ui/rounded-image";
import type { TeamContent } from "@/content";
import { isShown } from "@/lib/copy";

export type TeamProps = {
  readonly content: TeamContent;
};

const HEADING_ID = "team-heading";

export const Team = ({ content }: TeamProps) => {
  const members = content.members.filter((member) => isShown(member.name));
  return (
    <Section id="team" labelledBy={HEADING_ID} tone="surface" spacing="regular">
      <Stack gap="section">
        <SectionIntro
          id={HEADING_ID}
          heading={content.heading}
          lead={content.lead}
          tone="light"
          size="display-2"
        />
        {members.length === 0 ? null : (
          <ul role="list" className="grid gap-5 sm:grid-cols-2">
            {members.map((member, index) => (
              <li key={index}>
                <Card tone="mint" radius="card" padding="regular">
                  <div className="flex flex-col gap-5">
                    <div className="w-28">
                      {member.photo === null ? (
                        <div
                          aria-hidden="true"
                          className="aspect-square rounded-card bg-surface"
                        />
                      ) : (
                        <RoundedImage
                          image={member.photo}
                          sizes="112px"
                          radius="card"
                          priority={false}
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Heading level={3} size="title" id={null}>
                        <CopyText copy={member.name} />
                      </Heading>
                      {isShown(member.role) ? (
                        <p className="font-semibold">
                          <CopyText copy={member.role} />
                        </p>
                      ) : null}
                    </div>
                    {isShown(member.bio) ? (
                      <p className="text-ink-muted">
                        <CopyText copy={member.bio} />
                      </p>
                    ) : null}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </Stack>
    </Section>
  );
};
