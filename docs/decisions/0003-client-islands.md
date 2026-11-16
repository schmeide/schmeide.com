# 0003: Client components live in one directory

**Status:** accepted

## Context

The site should ship very little JavaScript and work without it wherever possible. "Use client components only where needed" is easy to agree with and easy to erode one file at a time.

## Decision

A file may contain `"use client"` only if it is in `src/components/islands/`. A test enforces it. An island is allowed when the feature cannot be built with HTML and CSS alone, and it receives its server-rendered content as props or `children` rather than rendering large static markup itself.

Expected islands: the mobile menu (#7), the diagram interaction if needed (#9), and the waitlist form (#14).

## Consequences

- The client JavaScript surface is one directory listing. Reviewing it is quick.
- Adding an island is a visible act in a pull request, not a one-line directive in a section.
- A section that needs one interactive part stays a server component and slots the island in.
- Each island should say in its pull request what it adds to the bundle. #9 has a 10 KB budget.
