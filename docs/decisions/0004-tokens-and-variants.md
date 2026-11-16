# 0004: Tokens only, variants as lookups, no className prop

**Status:** accepted

## Context

The Shopfront direction has a small palette, a fixed type scale and specific radii. Tailwind's defaults offer hundreds of other values, and many agents will write components in parallel. Class conflicts between a component's own classes and a passed-in `className` are resolved by stylesheet order, not by the order written, unless a merge library is added.

## Decision

- The `@theme` block in `src/app/globals.css` clears Tailwind's default colors, text sizes, radii, container widths, fonts and easings, then defines only the Shopfront tokens. The numeric spacing scale stays.
- Arbitrary values and hex colors in class names are not allowed.
- A component's variants are a readonly lookup from variant name to class string, in the component file, joined with the five-line `cx` helper.
- Our components do not accept `className` or `style`. ESLint forbids both, with `next/link` as the one allowed target for `className`.

## Consequences

- `bg-blue-500` or `text-xl` produce no CSS, so an off-system value shows up at once as a missing style.
- No runtime dependency for class handling, and no class conflicts to merge.
- A new look means a new variant, which keeps the set of looks small and listed in one place.
- Placement is the caller's job: wrap the component in a `div` with the layout classes.
- A missing token is added to `@theme`, which makes a design system change a visible diff.
