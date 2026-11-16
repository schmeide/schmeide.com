export type SkipLinkProps = {
  readonly label: string;
};

export const SkipLink = ({ label }: SkipLinkProps) => (
  <a
    href="#main"
    className="sr-only rounded-button bg-ink px-5 py-3 font-semibold text-surface focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-20"
  >
    {label}
  </a>
);
