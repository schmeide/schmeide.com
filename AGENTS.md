# Agent guide

This repo is the marketing site for schmeide.com: one landing page plus a few stub pages, exported as static HTML and served from GitHub Pages.

Read these before writing code, in this order:

1. This file. It holds the rules.
2. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). It says where things go and why. Follow it where a ticket and the doc overlap.
3. The epic, [#1](https://github.com/schmeide/schmeide.com/issues/1), for product context, voice and claim rules.
4. Your ticket.

`CLAUDE.md` only imports this file. Edit `AGENTS.md`, never `CLAUDE.md`.

## Commands

| Command             | What it does                                                 |
| ------------------- | ------------------------------------------------------------ |
| `pnpm install`      | Install dependencies. The pnpm version is pinned.            |
| `pnpm dev`          | Dev server at http://localhost:3000. Placeholders are shown. |
| `pnpm build`        | Static export into `out/`. Placeholders are hidden.          |
| `pnpm start`        | Serve `out/` locally.                                        |
| `pnpm lint`         | ESLint. Enforces most of the rules below.                    |
| `pnpm typecheck`    | Generate route types, then `tsc --noEmit`.                   |
| `pnpm test`         | Vitest: pure functions and repo invariants.                  |
| `pnpm format`       | Prettier, including Tailwind class order.                    |
| `pnpm format:check` | Prettier in check mode. CI runs this.                        |
| `pnpm test:e2e`     | Playwright and axe against a fresh build of `out/`.          |
| `pnpm lighthouse`   | Lighthouse budgets against `out/`. Run `pnpm build` first.   |
| `pnpm images`       | Rebuild `public/images` from `assets/images`. Commit both.   |

Before you call a ticket done, all of these pass: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Hard rules

Lint or a test enforces the ones marked (enforced). Do not disable a rule to get past it. If a rule is wrong, change it in a decision record.

1. **Static export only.** No server actions, no runtime route handlers, no cookies, headers, redirects, rewrites, proxy or ISR, and no image optimizer. Anything dynamic runs in the browser or at build time. See architecture topic 6. (enforced for server actions)
2. **All copy lives in `src/content`.** No user-visible string is written in a component or page. (enforced: `react/jsx-no-literals`)
3. **The brand name is written once**, as `PRODUCT_NAME` in `src/content/site.ts`. Everywhere else reads the constant. (enforced)
4. **Content flows down as props.** Only files in `src/app` import content values. Components import content types only. (enforced)
5. **Server components by default.** A file with `"use client"` lives in `src/components/islands/` and nowhere else. (enforced)
6. **Functional style.** Pure functions, readonly data, no classes, no mutation of arguments. (enforced for classes and parameter mutation)
7. **Design tokens only.** Colors, type sizes and radii come from the `@theme` block in `src/app/globals.css`. No hex values, no arbitrary values such as `text-[17px]`, no inline `style`. (enforced for `style`)
8. **No `className` prop on our components.** Variation is a typed variant prop. (enforced)
9. **Named exports only**, except where Next.js requires a default export in `src/app`. (enforced)
10. **Accessible by default.** Semantic HTML, keyboard reachable, visible focus, motion off under `prefers-reduced-motion`. Never remove the focus outline.
11. **No code comments. No emojis** in code, copy or commits. That includes `eslint-disable` comments.
12. **No new runtime dependency** without a decision record in `docs/decisions/`. The runtime dependencies are `next`, `react` and `react-dom`.
13. **Never invent facts.** No made-up customers, quotes, metrics, prices or bios. Unconfirmed items use `placeholder(...)`. The claim rules in #1 apply to every word.

## Where things go

| You are adding                      | Put it in                             |
| ----------------------------------- | ------------------------------------- |
| A route, layout, metadata file      | `src/app/`                            |
| A visual primitive with no copy     | `src/components/ui/`                  |
| Page structure (section, container) | `src/components/layout/`              |
| One section of the landing page     | `src/components/sections/`            |
| Anything that needs `"use client"`  | `src/components/islands/`             |
| Copy, labels, alt text, image slots | `src/content/`                        |
| A pure function or shared type      | `src/lib/`                            |
| A build-time script                 | `scripts/`                            |
| Source photos before processing     | `assets/images/`                      |
| A design reference                  | `design/` (never imported by the app) |
| A non-obvious decision              | `docs/decisions/NNNN-title.md`        |

## Working in this repo

- pnpm is pinned in `packageManager`. If `pnpm` is not on your PATH, run it as `npx pnpm@<that version>`.
- Tests sit next to the code as `*.test.ts`. Unit tests cover pure functions only. Components are tested in the browser by the Playwright suite in `e2e/`. The first run needs `pnpm exec playwright install chromium`.
- `design/shopfront-draft.html` is the approved mockup. Use it for structure, spacing and tone. Do not copy its inline styles; use tokens and components.
- If your work changes a rule or a boundary in `docs/ARCHITECTURE.md`, update the doc in the same pull request and add a decision record.
- If your work changes the scope of another ticket, say so in the pull request description and comment on that ticket.
- When writing a ticket, state its difficulty (hard, standard or mechanical) with a one-line reason. Do not name a model.

<!-- BEGIN:nextjs-agent-rules -->

## Design skills

The skills in `.claude/skills/` are vendored from jakubkrehel/skills. See `.claude/skills/README.md` for the source commit and license.

| Work                             | Skills                                                                        |
| -------------------------------- | ----------------------------------------------------------------------------- |
| Mockups and visual design        | `variant`, `better-layout`, `better-typography`, `better-colors`, `better-ui` |
| Copy                             | `better-writing`                                                              |
| Before opening a UI pull request | `interface-review`                                                            |
| The accessibility pass           | `better-accessibility`, `better-interface`                                    |

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
