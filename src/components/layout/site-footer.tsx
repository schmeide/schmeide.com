import { CopyText } from "@/components/ui/copy-text";
import { TextLink } from "@/components/ui/text-link";
import type { FooterContent, LinkContent } from "@/content";
import { isShown } from "@/lib/copy";
import { Container } from "./container";

export type SiteFooterProps = {
  readonly content: FooterContent;
  readonly pageLinks: readonly LinkContent[];
  readonly year: number;
};

type LinkListProps = {
  readonly label: string;
  readonly links: readonly LinkContent[];
};

const LinkList = ({ label, links }: LinkListProps) => (
  <nav aria-label={label}>
    <ul role="list" className="flex flex-wrap gap-x-6">
      {links.map((link) => (
        <li key={link.href}>
          <TextLink href={link.href} weight="regular">
            {link.label}
          </TextLink>
        </li>
      ))}
    </ul>
  </nav>
);

export const SiteFooter = ({ content, pageLinks, year }: SiteFooterProps) => (
  <footer className="border-t border-on-ink-muted text-small text-ink-muted">
    <Container>
      <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4 py-8">
        <div className="flex flex-col gap-1">
          <p>
            {content.copyright} {year} {content.name}
          </p>
          <p>{content.domain}</p>
          {isShown(content.contact) ? (
            <p>
              <CopyText copy={content.contact} />
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-x-10">
          {pageLinks.length === 0 ? null : (
            <LinkList label={content.pagesLabel} links={pageLinks} />
          )}
          <LinkList label={content.legalLabel} links={content.legalLinks} />
        </div>
      </div>
    </Container>
  </footer>
);
