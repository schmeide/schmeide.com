# 0009: Use-case pages are exported as not-found until they are ready

**Status:** accepted. Builds on 0008.

## Context

#58 adds one page per trade under `/for/`, starting with invoicing. Each needs a real sample plan and real screenshots, and none exist yet. Its acceptance says a page renders in production only once those are confirmed. Leaving unready slugs out of `generateStaticParams` does not work: with `output: "export"`, Next.js fails the build when that list is empty.

## Decision

- `generateStaticParams` returns every use case. In production, a use case that is not ready (decision 0008) calls `notFound()`, so its path holds the not-found page with `noindex` and none of its copy. In `pnpm dev` it renders with its placeholder labels.
- A use case's starting point is a `StartingPointId` from `@/lib/starting-points`, the five starting points the app offers. In `invite` mode the page's call to action is `/early-access/?start=<id>`, and the waitlist form adds a known id to the entry as `startingPoint`. In `open` mode the call to action is the app's sign-up page, unchanged.
- Playwright runs the use-case page checks against `next dev`, since the page has no production render yet.

## Consequences

- GitHub Pages answers an unready use-case path with status 200 and the not-found page, instead of a 404. Search engines are told `noindex`.
- When a use case's spec and screenshots are confirmed, replacing its placeholders makes it ready: it renders, joins the footer and the sitemap, and loses `noindex`, with no code change.
- The waitlist endpoint receives an optional `startingPoint` field.
