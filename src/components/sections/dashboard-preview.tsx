import { CopyText } from "@/components/ui/copy-text";
import type { DashboardPreviewContent } from "@/content";
import { cx } from "@/lib/cx";

export type DashboardPreviewProps = {
  readonly content: DashboardPreviewContent;
};

const usageBars = [
  "h-8",
  "h-12",
  "h-10",
  "h-16",
  "h-14",
  "h-20",
  "h-24",
] as const;

const costRows = ["w-11/12", "w-2/3", "w-1/2"] as const;

export const DashboardPreview = ({ content }: DashboardPreviewProps) => (
  <figure className="flex flex-col gap-4 rounded-panel bg-mint p-5 sm:p-7">
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-4 rounded-card bg-surface p-5">
        <p className="text-label font-bold text-ink-muted uppercase">
          {content.usageLabel}
        </p>
        <div aria-hidden="true" className="flex h-24 items-end gap-1.5">
          {usageBars.map((height) => (
            <span
              key={height}
              className={cx("w-full rounded-tail bg-ink", height)}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-card bg-surface p-5">
        <p className="text-label font-bold text-ink-muted uppercase">
          {content.costLabel}
        </p>
        <div
          aria-hidden="true"
          className="flex h-24 flex-col justify-end gap-3"
        >
          {costRows.map((width) => (
            <span
              key={width}
              className={cx("h-4 rounded-tail bg-butter", width)}
            />
          ))}
        </div>
      </div>
    </div>
    <figcaption className="text-small text-ink-muted">
      <CopyText copy={content.caption} />
    </figcaption>
  </figure>
);
