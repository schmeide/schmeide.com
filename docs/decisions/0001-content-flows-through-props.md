# 0001: Content flows through props

**Status:** accepted

## Context

All copy lives in one typed module. Sections could import it directly, which is less typing. But the name, the copy and several facts are still undecided, legal pages and the 404 page reuse the same shell, and many tickets build sections in parallel.

## Decision

Only files in `src/app` import values from `@/content`. A section takes a single `content` prop typed by its content type. Components may import content types, never values. ESLint enforces this with `no-restricted-imports`, and a test checks that the module is imported only through its entry point.

## Consequences

- A section is a pure function of its props. It can be rendered with any data, which keeps browser tests and future variants simple.
- The page file is the one place that shows which content goes where.
- Two tickets rarely touch the same file: the copy ticket edits `src/content`, a section ticket edits its section, and they meet at a type.
- Each page passes content down by hand. On a site this small that is a few lines.
