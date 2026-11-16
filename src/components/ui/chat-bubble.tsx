import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type ChatBubbleFrom = "owner" | "us";

export type ChatBubbleProps = {
  readonly from: ChatBubbleFrom;
  readonly speaker: string;
  readonly children: ReactNode;
};

const sides = {
  owner: "self-end rounded-br-tail bg-ink text-surface",
  us: "self-start rounded-bl-tail bg-surface text-ink",
} as const satisfies Record<ChatBubbleFrom, string>;

export const ChatBubble = ({ from, speaker, children }: ChatBubbleProps) => (
  <p className={cx("max-w-5/6 rounded-bubble px-5 py-4", sides[from])}>
    <span className="sr-only">
      {speaker}
      {": "}
    </span>
    {children}
  </p>
);
