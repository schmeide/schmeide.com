import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import type { LinkContent, NavContent } from "@/content";
import { toHomeHref } from "@/lib/href";
import { Container } from "./container";

export type SiteHeaderProps = {
  readonly name: string;
  readonly nav: NavContent;
};

type NavLinksProps = {
  readonly links: readonly LinkContent[];
};

const NavLinks = ({ links }: NavLinksProps) =>
  links.map((link) => (
    <li key={link.href}>
      <a
        href={toHomeHref(link.href)}
        className="inline-flex min-h-11 items-center no-underline hover:underline hover:underline-offset-4"
      >
        {link.label}
      </a>
    </li>
  ));

export const SiteHeader = ({ name, nav }: SiteHeaderProps) => (
  <header>
    <Container>
      <div className="relative flex items-center justify-between gap-4 py-6">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center font-display text-brand no-underline"
        >
          {name}
        </Link>
        <nav aria-label={nav.label} className="hidden md:block">
          <ul
            role="list"
            className="flex items-center gap-6 text-nav font-medium"
          >
            <NavLinks links={nav.links} />
            <li>
              <ButtonLink
                href={toHomeHref(nav.cta.href)}
                variant="primary"
                size="regular"
              >
                {nav.cta.label}
              </ButtonLink>
            </li>
          </ul>
        </nav>
        <nav aria-label={nav.label} className="md:hidden">
          <details>
            <summary
              data-marker="none"
              className="inline-flex min-h-11 list-none items-center rounded-button border-2 border-ink px-5 font-semibold"
            >
              {nav.menuLabel}
            </summary>
            <ul
              role="list"
              className="absolute inset-x-0 top-full z-10 flex flex-col gap-1 rounded-card bg-mint p-5 text-nav font-medium"
            >
              <NavLinks links={nav.links} />
              <li className="pt-2">
                <ButtonLink
                  href={toHomeHref(nav.cta.href)}
                  variant="primary"
                  size="regular"
                >
                  {nav.cta.label}
                </ButtonLink>
              </li>
            </ul>
          </details>
        </nav>
      </div>
    </Container>
  </header>
);
