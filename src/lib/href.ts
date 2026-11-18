export type AnchorHref = `#${string}`;

export type AppHref = `https://${string}`;

export type AppRoute =
  | { readonly name: "signIn" }
  | { readonly name: "signUp"; readonly plan?: string };

const APP_PATHS = {
  signIn: "/sign-in",
  signUp: "/sign-up",
} as const satisfies Record<AppRoute["name"], string>;

export const isAnchorHref = (href: string): href is AnchorHref =>
  href.startsWith("#");

export const isExternalHref = (href: string): boolean =>
  /^https?:\/\//.test(href);

export const isPlainHref = (href: string): boolean =>
  isAnchorHref(href) || isExternalHref(href);

export const toHomeHref = (href: string): string =>
  isAnchorHref(href) ? `/${href}` : href;

export const appHref = (appUrl: AppHref, route: AppRoute): AppHref => {
  const query =
    route.name === "signUp" && route.plan !== undefined
      ? `?${new URLSearchParams({ plan: route.plan })}`
      : "";
  return `${appUrl}${APP_PATHS[route.name]}${query}`;
};
