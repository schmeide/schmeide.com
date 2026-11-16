# 0007: The mobile menu closes through a small island

**Status:** accepted. Amends the "no islands except the waitlist form" point in 0006.

## Context

The small-screen menu is a native `<details>`. It stayed open after a link was chosen, and did not close on Escape or on a click outside it (#24). Decision 0003 asks for HTML first.

The Popover API was tried first. It gives Escape and light dismiss with no script, but it does not cover the whole ticket:

- Choosing an in-page link such as `/#how` does not close a popover. That still needs a script.
- A popover renders in the top layer, so it is no longer positioned against the header. Keeping it under the menu button needs CSS anchor positioning or a fixed offset tied to the header height.

## Decision

Keep the `<details>` and wrap it in `DismissibleMenu`, an island in `src/components/islands/`. The island renders only the `<details>` element and receives the summary and the links as server-rendered `children`. It adds two document listeners: Escape closes the menu and moves focus to the summary, and a click outside the menu or on any link inside it closes the menu.

## Consequences

- With JavaScript off, the menu works as before: the summary opens and closes it.
- The site ships two client components. The menu island adds a few hundred bytes to the bundle.
- If the menu later moves to a popover, this island shrinks to the link-close handler.
