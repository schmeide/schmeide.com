export type AnchorHref = `#${string}`;

export const isAnchorHref = (href: string): href is AnchorHref =>
  href.startsWith("#");

export const toHomeHref = (href: string): string =>
  isAnchorHref(href) ? `/${href}` : href;
