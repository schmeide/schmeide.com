import { resolve } from "@/lib/copy";
import type { Copy } from "@/lib/placeholder";

export type CopyTextProps = {
  readonly copy: Copy;
};

export const CopyText = ({ copy }: CopyTextProps) => {
  const resolved = resolve(copy);
  if (resolved === null) {
    return null;
  }
  return (
    <>
      {resolved.text}
      {resolved.pendingNote === null ? null : (
        <>
          {resolved.text === "" ? null : " "}
          <mark className="rounded-highlight bg-butter box-decoration-clone px-1.5 text-small font-semibold text-ink">
            {resolved.pendingNote}
          </mark>
        </>
      )}
    </>
  );
};
