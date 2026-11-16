import { ChatBubble } from "@/components/ui/chat-bubble";
import type { ConversationContent } from "@/content";
import { cx } from "@/lib/cx";

export type ConversationProps = {
  readonly content: ConversationContent;
  readonly overlapping: boolean;
};

export const Conversation = ({ content, overlapping }: ConversationProps) => (
  <figure
    className={cx(
      "flex flex-col gap-3.5 rounded-panel bg-mint p-5 sm:p-7",
      overlapping && "relative -mt-28 w-11/12 ring-8 ring-surface sm:w-5/6",
    )}
  >
    <p className="text-label font-bold text-ink-muted uppercase">
      {content.label}
    </p>
    <ChatBubble from="owner" speaker={content.ownerSpeaker}>
      {content.ownerMessage}
    </ChatBubble>
    {content.questions.map((question) => (
      <ChatBubble key={question} from="us" speaker={content.ourSpeaker}>
        {question}
      </ChatBubble>
    ))}
    <figcaption className="text-small text-ink-muted">
      {content.caption}
    </figcaption>
  </figure>
);
