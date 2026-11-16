# 0002: Placeholders are data with an optional fallback

**Status:** accepted

## Context

Pricing, bios, testimonials, support terms and legal text are not decided. The claim rules forbid inventing them. Unconfirmed items must be easy to find, visible while we work, and must never reach visitors as "[placeholder]" text. Some sentences are half confirmed: one true statement followed by a detail that is still open.

## Decision

A copy field is `Copy = string | Placeholder`. `placeholder(note, fallback?)` creates the marker. `resolveCopy(copy, mode)` decides what to render:

- `show` mode (development and tests): the fallback, if any, plus a visible label with the note.
- `hide` mode (production builds): the fallback alone, or `null` when there is none, which means the item is left out.

The mode is derived from `NODE_ENV` once, in `src/lib/env.ts`. The helpers live in `src/lib/placeholder.ts` so both content and components can use them.

## Consequences

- `grep -rn "placeholder(" src/content` lists everything a human still owes.
- The author of each item chooses between hiding it and showing safe text, by giving a fallback or not. This covers "hidden" and "More stories soon" from #11 with one mechanism.
- A half-confirmed sentence puts the confirmed part in the fallback.
- Sections must handle `null`: drop the item, or drop the block. #11 and #12 need to design for lists that are shorter in production.
- The production page can be previewed only with `pnpm build && pnpm start`, since `pnpm dev` always shows placeholders.
