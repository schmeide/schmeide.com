# 0006: Helpers and choices made while building the page

**Status:** accepted

## Context

Building the sections needed a few small helpers that the list in architecture topic 10 did not have, and a few choices the tickets left open.

## Decision

- **New helpers in `src/lib`:** `copy.ts` (`resolve`, `isShown`, `PLACEHOLDER_LABEL`) applies the build's placeholder mode so sections do not pass the mode around. `href.ts` (`isAnchorHref`, `toHomeHref`) tells an in-page anchor from a route. `images/path.ts` builds derivative paths and `srcset` values. `structured-data.ts` builds the JSON-LD objects. `theme.ts` repeats the brand colors for the files that cannot read CSS tokens: the generated images and the web manifest. A test keeps it equal to `globals.css`.
- **No islands except the waitlist form.** The mobile menu and the FAQ are native `<details>`. The pipeline diagram is server-rendered HTML with a CSS scroll animation behind `prefers-reduced-motion` and `@supports`. The animation moves elements and never changes opacity, so text contrast is the same at every frame.
- **Header links point at `/#section`.** The header is shared with the legal pages, where a bare `#section` would go nowhere.
- **Customer story slots are hidden in production,** apart from one line with a fallback. Team members without a confirmed name are hidden in production. Team photo slots stay empty: a stock photo of a person in a founder card would present a stranger as a founder.
- **FAQ JSON-LD lists confirmed answers only.** An answer that is a placeholder with a fallback is shown on the page but left out of the structured data.
- **The icon is `public/icon.svg`,** named in metadata. Setting `icons.apple` in metadata replaces the file-convention icon, so the file convention is not used.
- **The submit button uses `aria-disabled` while sending,** not `disabled`, so it keeps keyboard focus. The submit handler ignores a second submit.
- **Development dependencies added:** `sharp` (image script), `@playwright/test` and `@axe-core/playwright` (browser tests), `@lhci/cli` (Lighthouse budgets). None ship to the browser.

## Consequences

- The helper list in architecture topic 10 grows by five files. Each has a unit test or is covered by a content test.
- The site ships one client component. The JavaScript on the page is the framework runtime plus the form.
- When real founder photos arrive, add image slots to the team members and run `pnpm images`.
