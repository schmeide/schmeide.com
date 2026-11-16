import { Heading } from "@/components/layout/heading";
import { Card } from "@/components/ui/card";
import { CheckIcon } from "@/components/ui/check-icon";
import { StepBadge } from "@/components/ui/step-badge";
import type { PipelineStep as PipelineStepContent } from "@/content";
import { cx } from "@/lib/cx";

export type PipelineStepLabels = {
  readonly owner: string;
  readonly we: string;
  readonly checks: string;
};

export type PipelineStepProps = {
  readonly step: PipelineStepContent;
  readonly number: number;
  readonly labels: PipelineStepLabels;
};

type RoleProps = {
  readonly label: string;
  readonly text: string;
  readonly inverted: boolean;
};

const Role = ({ label, text, inverted }: RoleProps) => (
  <div className="flex flex-col gap-1">
    <dt className="text-label font-bold uppercase">{label}</dt>
    <dd
      className={cx(
        "text-small",
        inverted ? "text-on-ink-muted" : "text-ink-muted",
      )}
    >
      {text}
    </dd>
  </div>
);

export const PipelineStep = ({ step, number, labels }: PipelineStepProps) => (
  <li data-reveal className="flex flex-col">
    <Card
      tone={step.isApprovalGate ? "ink" : "surface"}
      radius="card"
      padding="regular"
    >
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
          <StepBadge>{number}</StepBadge>
          <div className="flex flex-col gap-2">
            <Heading level={4} size="title" id={null}>
              {step.title}
            </Heading>
            <p
              className={
                step.isApprovalGate ? "text-on-ink-muted" : "text-ink-muted"
              }
            >
              {step.description}
            </p>
          </div>
        </div>
        <dl className="grid content-start gap-5 sm:grid-cols-2 sm:gap-8">
          <Role
            label={labels.owner}
            text={step.ownerDoes}
            inverted={step.isApprovalGate}
          />
          <Role
            label={labels.we}
            text={step.weDo}
            inverted={step.isApprovalGate}
          />
        </dl>
      </div>
    </Card>
    <div className="ml-10 flex min-h-8 flex-col gap-2 border-l-2 border-ink py-5 pl-6 sm:ml-13">
      {step.checks.length === 0 ? null : (
        <>
          <p className="text-label font-bold text-ink-muted uppercase">
            {labels.checks}
          </p>
          <ul role="list" className="flex flex-wrap gap-2">
            {step.checks.map((check) => (
              <li
                key={check}
                className="inline-flex items-center gap-2 rounded-badge bg-surface px-4 py-2 text-small font-semibold"
              >
                <CheckIcon />
                {check}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  </li>
);
