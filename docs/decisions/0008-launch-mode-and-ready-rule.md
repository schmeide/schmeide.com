# 0008: A build-time launch mode and a ready rule for inner pages

**Status:** accepted.

## Context

The site grows from one landing page into many pages (#45, #46). The product is invite-only today and will open later, so the main call to action has two targets: the early-access list on this site, or the app's sign-up page. Many new pages will be written before their facts are confirmed, and a half-confirmed page must not be found by search or linked from the site in production.

## Decision

- **Launch mode.** `NEXT_PUBLIC_LAUNCH_MODE` is `invite` (the default, also for any unknown value) or `open`. It is read once in `src/lib/env.ts` as `LAUNCH_MODE`. `site.mainCta` holds a link for each mode, and `pickForMode` chooses one in `src/app/pages.ts`. Components receive the chosen link as a `cta` prop. `invite` points at `/early-access/`, a page that holds the same early-access section and form as the home page. The home page keeps its section, so the waitlist form stays one click from the hero in either mode.
- **App links.** `APP_URL` sits next to `SITE_URL`. `appHref` builds `/sign-in` and `/sign-up` (with an optional `plan`, the parameter schmeide.app reads) from it. These are the only app addresses on the site.
- **Ready rule.** `isReady(content)` walks a page's content and is false if any value is a placeholder, with or without a fallback, or an image slot marked `placeholder: true`. `isListed(content, mode)` is true when placeholders are shown or the page is ready. The footer and the sitemap list only listed pages, and a page that is not ready sets `robots: noindex`.

## Consequences

- Switching to `open` is one environment value and a new build. There is no runtime switch.
- A page's whole content is its required copy, so adding a placeholder to a ready page takes it out of production listings. That is the point, and it is visible in `pnpm dev`.
- Playwright builds the site twice, once per mode, which roughly doubles the e2e build time.
- The ready rule is the gate the later pages in #45 (pricing #51, how it works #48, use cases #58) build on.
