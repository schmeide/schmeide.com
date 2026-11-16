# Architecture

The marketing site for schmeide.com. One landing page and a few stub pages, built with Next.js App Router, exported as static HTML and served from GitHub Pages. This doc says where things go and why. The rules for day-to-day work are in [AGENTS.md](../AGENTS.md). Product context, voice and claim rules are in the epic, [#1](https://github.com/schmeide/schmeide.com/issues/1).

The whole design in one picture:

```
src/content  ──values──▶  src/app  ──props──▶  src/components/sections  ──▶  layout, ui, islands
     │                                              │
     └──────────── types only ─────────────────────┘
                         everything may import src/lib; src/lib imports nothing above it
```

Copy is data. Pages read the data and hand it to sections as props. Sections arrange primitives. Nothing but a page knows where the words come from.

Contents: [1 Layout](#1-directory-layout) · [2 Content](#2-content-module) · [3 Components](#3-component-conventions) · [4 Styling](#4-styling) · [5 Motion and accessibility](#5-motion-and-accessibility-primitives) · [6 Static export](#6-static-export-constraints) · [7 Waitlist](#7-waitlist-boundary) · [8 Images](#8-image-pipeline-boundary) · [9 Testing](#9-testing-strategy) · [10 Functional style](#10-functional-style-in-practice)

## 1. Directory layout

```
src/
  app/                  routes, layouts, metadata files, globals.css, fonts.ts
  components/
    ui/                 visual primitives: Button styles, ButtonLink, TextLink, Card, Highlight, StepBadge, ChatBubble, RoundedImage, CopyText, JsonLd, icons
    layout/             page structure: Section, SectionIntro, Container, Stack, Heading, SiteHeader, SiteFooter, SkipLink
    sections/           one file per landing page section: Hero, Problem, HowItWorks, ...
    islands/            the only place "use client" is allowed
  content/              all copy (site.ts), types (types.ts) and image slots (images.ts), one entry point (index.ts)
  lib/                  pure functions and shared types; lib/waitlist, lib/images
  invariants.test.ts    tests that enforce the rules in this doc
assets/images/          source photos, before processing (#17)
public/                 files served as they are; public/images holds generated derivatives
e2e/                    Playwright tests, run against the built out/
design/                 visual references, never imported by the app
scripts/                build-time TypeScript scripts, run with node
docs/                   this doc and decisions/
```

Import direction, enforced by ESLint and `src/invariants.test.ts`:

| Layer            | May import                                                       |
| ---------------- | ---------------------------------------------------------------- |
| `src/lib`        | nothing from the other layers                                    |
| `src/content`    | `src/lib`                                                        |
| `src/components` | `src/lib`, other components, and **types only** from `@/content` |
| `src/app`        | everything                                                       |

Within components: `ui` imports only `lib`. `layout` may use `ui`. `sections` use `layout`, `ui` and `islands`. `SiteHeader` in `layout` also slots in the `DismissibleMenu` island. `islands` use `ui` and `lib`.

The path alias is `@/` for `src/`. The content module is always imported as `@/content`, never by a deeper path.

## 2. Content module

Tickets: #6 wrote the data. #8 to #15 read it.

- **One entry point:** `src/content/index.ts`. It re-exports `site.ts`, `images.ts` and the types in `types.ts`. If `site.ts` grows, split it into more files in `src/content/` and re-export them from `index.ts`.
- **Shape:** `types.ts` defines one type per section (`HeroContent`, `FaqContent`, ...) and `SiteContent`, which holds them all. #6 exports `export const site: SiteContent = { ... } as const satisfies SiteContent` style data. #6 may refine a section's type when the copy needs it; the type and the data change together.
- **Readonly:** every field is `readonly` and every list is `readonly T[]`. Content is never mutated or computed at runtime.
- **Brand:** `PRODUCT_NAME` in `site.ts` is the only place the name is written. `DOMAIN`, `SITE_URL` and `PLACEHOLDER_LABEL` sit next to it. Copy that mentions the name interpolates the constant. A test fails if the name appears as a literal anywhere else in `src/`.
- **Links:** `LinkContent.href` is typed as a section anchor (`#early-access`) or a known page path, so a typo fails the typecheck. Section ids come from the `SectionId` union.

### Placeholders

Anything a human has not confirmed is marked in the data with `placeholder(note, fallback?)`, the wrapper exported from `src/content/site.ts`. It prefixes the note with `PLACEHOLDER_LABEL` ("Placeholder") and calls the marker in `@/lib/placeholder`, so the label is copy and lives in content. The field type is `Copy`, which is `string | Placeholder`. See [decision 0002](decisions/0002-placeholder-marker.md).

```ts
answer: placeholder("ownership terms to be confirmed"),
answer: placeholder("support details", "We monitor it, and we can roll back a bad update."),
```

| Build                     | Mode   | Placeholder with a fallback        | Placeholder without a fallback            |
| ------------------------- | ------ | ---------------------------------- | ----------------------------------------- |
| `pnpm dev`, tests         | `show` | fallback text plus a visible label | the label and the note                    |
| `pnpm build` (production) | `hide` | fallback text only                 | nothing: the item is left out of the page |

- `resolveCopy(copy, mode)` returns `{ text, pendingNote }` or `null`. `null` means "do not render this item". Sections drop `null` items from lists, and drop a whole block when its required copy resolves to `null`.
- The mode comes from `PLACEHOLDER_MODE` in `src/lib/env.ts`, the only file that reads `process.env`.
- `CopyText` in `components/ui` renders a `Copy` value and is the only component that draws the pending note. The label text is not in the component: it is `PLACEHOLDER_LABEL` in `src/content/site.ts`, already part of every note the `placeholder()` wrapper builds.
- A production page never shows a note, a bracketed "[placeholder]" or an empty box. If a section would look broken without an item, give that item a fallback such as "More stories soon".
- Structured data (FAQ JSON-LD in #12) includes only entries where `isConfirmed(answer)` is true.
- To list every unconfirmed item: `grep -rn "placeholder(" src/content`. Image slots carry their own flag: `grep -rn "placeholder: true" src/content`.

## 3. Component conventions

- **Server first.** Every component is a server component unless it needs state, effects or browser events. A client component is allowed only when the feature cannot work with HTML and CSS alone (`<details>`, `:target`, anchors and CSS scroll effects come first). It lives in `components/islands/`, is as small as possible, and receives server-rendered content as props or `children`. See [decision 0003](decisions/0003-client-islands.md). The islands are `WaitlistForm` (#14) and `DismissibleMenu` (#24), which wraps the native `<details>` of the mobile menu so it closes on a link, Escape or a click outside. The FAQ is native `<details>`, and the diagram animates with CSS. See decisions [0006](decisions/0006-helpers-and-choices-from-the-build.md) and [0007](decisions/0007-mobile-menu-island.md).
- **Sections receive content as props.** A section takes one `content` prop typed by its content type, plus `children` when a page slots an island into it. It never imports `@/content` values. See [decision 0001](decisions/0001-content-flows-through-props.md).

  ```tsx
  export const Hero = ({ content }: HeroProps) => ...
  <Hero content={site.hero} />
  <EarlyAccess content={site.earlyAccess}>
    <WaitlistForm content={site.waitlistForm} />
  </EarlyAccess>
  ```

- **The `early-access` id** belongs to the `EarlyAccess` section (#12). The waitlist form (#14) is passed into it as `children`. There is one element with that id on the page.
- **Primitives know no copy.** `ui` and `layout` components take text as `children` or props and never a content type, apart from `CopyText` and `RoundedImage`, which take the shared `Copy` and `ImageSlot` types from `lib`.
- **Props:** a type named `<Component>Props`, exported, all fields `readonly`. Variant props are string unions named for meaning, not appearance: `tone="ink"`, `variant="primary"`, `size="large"`. Booleans read as facts: `inverted`, `priority`. No `className` and no `style` props; see topic 4.
- **Files and exports:** kebab-case file names (`step-badge.tsx`), one component per file, a named export in PascalCase (`StepBadge`). No default exports outside `src/app`, where Next.js requires them. No barrel files in `components/`; import from the file.
- **Headings:** one `h1`, in the hero. Each section has one `h2`. The `Heading` component takes a `level` and a separate visual `size`, so the outline stays correct when the look changes.
- **Links:** in-page anchors are plain `<a href="#id">`. Routes use `next/link`. Typed routes are on, so a wrong path fails the typecheck.

## 4. Styling

Tickets: #7 built on these tokens.

Tailwind CSS v4, configured in CSS only. The tokens live in the `@theme` block of `src/app/globals.css`. The default Tailwind color, text size, radius, container and font scales are removed there, so only the tokens below exist as utilities. See [decision 0004](decisions/0004-tokens-and-variants.md).

| Group     | Tokens (utility examples)                                                                                                                                                                                                                                                         |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Color     | `ink`, `ink-strong`, `ink-muted`, `surface`, `mint`, `on-ink-muted`, `butter` (`bg-mint`, `text-ink-muted`)                                                                                                                                                                       |
| Font      | `font-display` (Young Serif), `font-sans` (Figtree, the default)                                                                                                                                                                                                                  |
| Type size | `text-display-1` (h1), `text-display-2` (h2), `text-display-panel` (heading in an ink panel), `text-title` (h3), `text-lead`, `text-brand` (site header wordmark), `text-body`, `text-nav`, `text-small`, `text-label`                                                            |
| Radius    | `rounded-tail` 6 (chat bubble tails, dashboard preview bars), `rounded-highlight` 8, `rounded-input` 12, `rounded-button` 14, `rounded-button-lg` 16, `rounded-disclosure` 18, `rounded-bubble` 20, `rounded-card` 24, `rounded-panel` 28, `rounded-panel-lg` 32, `rounded-badge` |
| Width     | `max-w-page` 1200px, `max-w-prose` 46ch, `max-w-lead` 40ch                                                                                                                                                                                                                        |
| Spacing   | Tailwind's numeric scale, plus `gutter` 24px, `section` (fluid, up to 112px), `badge` 44px (`px-gutter`, `py-section`, `size-badge`)                                                                                                                                              |
| Motion    | `ease-gentle`, and the CSS variables `--duration-quick` 150ms and `--duration-gentle` 300ms                                                                                                                                                                                       |

Each type size token carries its own line height and letter spacing, so `text-display-1` is the whole h1 style.

Color rules: `butter` is a background only, never text on `surface`. Text on `ink` is `surface` or `on-ink-muted`. Body copy on `surface` or `mint` is `ink` or `ink-muted`. #7 lists the contrast ratios.

Rules:

- **Tokens only.** No hex values and no arbitrary values (`text-[17px]`, `bg-[#fff]`) in class names. If a value is missing, add a token to `@theme` in the same pull request.
- **Variants live in the component file** as a readonly lookup from variant name to class string, joined with `cx` from `@/lib/cx`. No variant library, no `clsx`, no `tailwind-merge`.

  ```tsx
  const tones = {
    surface: "bg-surface text-ink",
    mint: "bg-mint text-ink",
    ink: "bg-ink text-surface",
  } as const satisfies Record<SectionTone, string>;
  ```

- **No `className` prop** on our components. A caller that needs a different look adds a variant. A caller that needs different placement wraps the component in its own element.
- **Inline styles: never** in components and pages. ESLint forbids the `style` prop. The one exception is a `route.tsx` that draws an image with `next/og` (#15), because that renderer accepts only inline styles.
- **Class order** is fixed by Prettier with the Tailwind plugin. Run `pnpm format`.
- **Fonts** load in `src/app/fonts.ts` through `next/font/google`: self-hosted at build time, latin subset, `display: swap`. They reach CSS as `--font-young-serif` and `--font-figtree`.

## 5. Motion and accessibility primitives

Tickets: #7 built the shell. #9 uses the motion rules. #16 audits.

- **Reduced motion.** Motion is opt-in, CSS first. Write every transition and animation behind Tailwind's `motion-safe:` variant, so the reduced-motion page is the static one by default. `globals.css` also has a global backstop that cuts all animation and transition durations to near zero under `prefers-reduced-motion: reduce`. Smooth scrolling is on only when motion is allowed. Motion driven by script (#9) checks `matchMedia("(prefers-reduced-motion: reduce)")` in the island and renders the full static state when it matches.
- **Content never depends on motion.** Everything is in the HTML and visible without animation or script. Animation only changes how it arrives.
- **Focus ring.** One global rule in `globals.css`: `:focus-visible` gets a 3px solid outline with a 3px offset in `--focus-ring`. The ring is `ink` by default. Any element with `data-tone="ink"` switches it to `butter` for everything inside. `Section` and `Card` set `data-tone` from their tone prop. Components never remove or restyle the outline.
- **Skip link.** `SkipLink` is the first element in `<body>`, hidden until focused, and points at `#main`. Every page has exactly one `<main id="main">`. Its label comes from `site.nav.skipLinkLabel`.
- **Landmarks.** `SiteHeader` renders `<header>` with a labelled `<nav>`. Pages render `<main>`. `SiteFooter` renders `<footer>`. Each section is a `<section>` labelled by its `h2` through `aria-labelledby`.
- **Targets.** Interactive elements are at least 44px tall. Form inputs have visible labels. Errors are linked with `aria-describedby`.
- **Decoration.** Decorative SVG and images get `aria-hidden` or `alt=""`. Meaningful images require `alt`, which `ImageSlot` makes a required field.

## 6. Static-export constraints

`next.config.ts` sets `output: "export"`, `trailingSlash: true` and `images.unoptimized: true`. There is no `basePath`: the site serves from the root of the domain. `pnpm build` writes `out/`, and that directory is the whole product.

| Cannot use                                                    | Use instead                                                                                                                                                    | Ticket |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Server actions, form `action` functions                       | A client island that calls `submitWaitlist`, which posts from the browser through an adapter. Topic 7.                                                         | #14    |
| Route handlers that read the request, or any verb but `GET`   | A `GET` handler with `export const dynamic = "force-static"`. It runs once at build and is written to `out/` as a file.                                        | #15    |
| `next/image` optimizer                                        | Derivatives made ahead of time by a script, rendered with `<picture>` through `RoundedImage`. Topic 8.                                                         | #17    |
| `opengraph-image.tsx` file convention                         | It builds, but writes a file with no extension, which GitHub Pages serves with the wrong content type. Use `src/app/og.png/route.tsx` and name it in metadata. | #15    |
| Cookies, headers, redirects, rewrites, proxy, ISR, draft mode | Nothing. If a feature needs one of these, it does not belong on this site.                                                                                     |        |
| Dynamic routes without `generateStaticParams`                 | Fixed routes only.                                                                                                                                             |        |
| Runtime environment variables                                 | `NEXT_PUBLIC_*` values, inlined at build and read only in `src/lib/env.ts`. They are public. Never put a secret in one.                                        | #14    |

What works, checked against Next.js 16.4 in this repo:

- `src/app/sitemap.ts` and `src/app/robots.ts` with `export const dynamic = "force-static"` are written to `out/sitemap.xml` and `out/robots.txt`.
- `src/app/og.png/route.tsx` returning an `ImageResponse` from `next/og`, with `force-static`, is written to `out/og.png`.
- `src/app/apple-touch-icon.png/route.tsx` and `src/app/manifest.ts` work the same way. The favicon is the static file `public/icon.svg`.
- `not-found.tsx` becomes `out/404.html`, which GitHub Pages serves for unknown paths.
- With `trailingSlash: true`, `/privacy` is written as `out/privacy/index.html`. Internal page links end with a slash.

Hosting files such as `public/CNAME` and `public/.nojekyll` belong to #3.

## 7. Waitlist boundary

Types are in `src/lib/waitlist/types.ts`. #14 implemented them.

```
WaitlistForm (island) ── WaitlistInput ──▶ validateWaitlist ── Result<WaitlistEntry, FieldErrors>
                                                │ ok
                                                ▼
                                          submitWaitlist ──▶ adapter ──▶ SubmitResult
```

- `validateWaitlist: (input: WaitlistInput) => Result<WaitlistEntry, FieldErrors>` in `lib/waitlist/validate.ts`. Pure. Plain functions, no schema library. It returns error codes (`WaitlistError`), never messages.
- `submitWaitlist: (entry: WaitlistEntry) => Promise<SubmitResult>` in `lib/waitlist/submit.ts`. It picks a `WaitlistAdapter` and calls it. It never throws: a network failure becomes `{ status: "failed", reason: "network" }`.
- `WaitlistAdapter` has the same signature as `submitWaitlist`. Two exist: `endpointAdapter`, which posts JSON to `NEXT_PUBLIC_WAITLIST_ENDPOINT`, and `unconfiguredAdapter`, which returns `{ status: "unconfigured" }` when no endpoint is set.
- `SubmitResult` is `saved`, `unconfigured` or `failed`. The form shows a different message for each. `unconfigured` must never be shown as success.
- Messages come from `site.waitlistForm`, which maps every `WaitlistError` and every result status to text. The form island receives that object as a prop.
- The endpoint is read in `src/lib/env.ts` and passed to the adapter picker as an argument, so adapter selection is a pure function of its input and easy to test.
- Changing the backend later means changing `submit.ts` and one environment variable. Nothing else.

## 8. Image pipeline boundary

Types are in `src/lib/images/types.ts`. #17 implemented them. See [decision 0005](decisions/0005-committed-image-derivatives.md).

- **Slot:** an `ImageSlot` in the content module describes one picture: `name`, `alt`, `aspectRatio`, a `placeholder` flag and `source` (credit, license, URL). Stock or stand-in photos set `placeholder: true`.
- **Files:** the source photo is `assets/images/<name>.<ext>`. `scripts/build-images.ts` (run as `pnpm images`) crops it to the slot's aspect ratio and writes `public/images/<name>-<width>.<format>` for each `ImageWidth` (640, 1024, 1600) and each `ImageFormat` (`avif`, `webp`). The derivatives are committed. The build does not run the script.
- **Path helper:** one pure function of type `ImageFilePath` in `lib/images` builds those paths. The script and the component both use it, so they cannot disagree.
- **`RoundedImage` contract** (`RoundedImageProps`): it takes `image`, `sizes`, `radius` (`card` or `panel`) and `priority`. It renders `<picture>` with an AVIF source, a WebP source and a WebP `<img>` fallback. It always sets `width` and `height` from the aspect ratio so space is reserved before the file loads. `alt` comes from the slot and is required; a decorative image passes `alt: ""`. With `priority` it sets `loading="eager"` and `fetchpriority="high"`; otherwise `loading="lazy"` and `decoding="async"`. Only the hero image is a priority image.
- **Invariant test** in `src/content/content.test.ts`: every `ImageSlot` in the content module has all of its derivative files in `public/images`.
- `sharp` is a dev dependency used only by the script. `next/image` is not used.

## 9. Testing strategy

| Layer      | Tool                     | What it covers                                                                                                                                                                                                                          | Ticket  |
| ---------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Types      | `tsc`, strict            | Content shape, props, link targets, `noUncheckedIndexedAccess`                                                                                                                                                                          | all     |
| Lint       | ESLint                   | Import direction, no classes, no inline styles, no literal copy in JSX, no default exports                                                                                                                                              | all     |
| Unit       | Vitest, node environment | Pure functions in `src/lib`: validation, adapter selection, path helpers, `resolveCopy`. Vitest also picks up `scripts/**/*.test.ts`, but `scripts/build-images.ts` has no test yet; it is checked by the image-files invariant instead | all     |
| Invariants | Vitest                   | `src/invariants.test.ts` and content tests: brand literal, island location, no server actions, content rules, image files                                                                                                               | #6, #17 |
| Browser    | Playwright with axe      | The built `out/`: no serious axe violations, keyboard pass, waitlist submit against a mocked endpoint, 320px layout                                                                                                                     | #16     |
| Budgets    | Lighthouse CI            | Performance, accessibility, best practices and SEO scores on `out/`, plus a JavaScript size budget                                                                                                                                      | #16     |

- Unit tests sit next to the code as `*.test.ts`. A new pure function in `src/lib` comes with a test.
- There are no component render tests and no jsdom. Components are thin and are tested in a real browser against the real export.
- Content tests (#6) assert rules on the data, such as "every FAQ item has a question" and "no placeholder has an empty note".
- CI gates for every pull request, in this order: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`. A second job then runs `pnpm test:e2e` (Playwright with axe, against a build whose waitlist endpoint is a mocked address) and `pnpm lighthouse` (budgets in `lighthouserc.json`).

## 10. Functional style in practice

- **Pure by default.** A function in `src/lib` takes its inputs as arguments and returns a value. It does not read `process.env`, the clock, `window` or the network. Effects happen at the edges: `src/lib/env.ts` for environment values, adapters for `fetch`, islands for the DOM. Pass `now`, the endpoint or `fetch` in as an argument when a function needs one.
- **Immutable data.** Types use `readonly` fields and `readonly T[]`. Use `const`, spread, `map`, `filter` and `flatMap`. No `let` reassignment loops where a `map` reads better, no `push`, no mutation of arguments (lint: `no-param-reassign`).
- **No classes.** Not for components, not for errors, not for helpers (lint: `no-restricted-syntax`).
- **Errors are values.** Expected failures return `Result<T, E>` from `@/lib/result`. `throw` is for bugs. Use discriminated unions (`status`, `kind`, `ok`) and narrow on them.
- **Types, not interfaces.** `type` aliases everywhere, with type-only imports (lint enforces both).
- **The allowed helpers.** This is the full list; add to it only with a decision record:

  | Helper                                                       | File                         | Use                                             |
  | ------------------------------------------------------------ | ---------------------------- | ----------------------------------------------- |
  | `cx(...classes)`                                             | `src/lib/cx.ts`              | Join class names, dropping falsy values         |
  | `ok`, `err`, `Result`                                        | `src/lib/result.ts`          | Return expected failures as values              |
  | `placeholder`, `isPlaceholder`, `isConfirmed`, `resolveCopy` | `src/lib/placeholder.ts`     | Mark and resolve unconfirmed copy               |
  | `PLACEHOLDER_MODE` and other environment values              | `src/lib/env.ts`             | The single place build-time environment is read |
  | `resolve`, `isShown`                                         | `src/lib/copy.ts`            | Resolve copy with the build's placeholder mode  |
  | `isAnchorHref`, `toHomeHref`                                 | `src/lib/href.ts`            | Tell an in-page anchor from a route             |
  | `imageFilePath`, `imageSrcSet`, `heightFor`                  | `src/lib/images/path.ts`     | Paths and sizes of image derivatives            |
  | `faqPageJsonLd`, `organizationJsonLd`, `serializeJsonLd`     | `src/lib/structured-data.ts` | Build JSON-LD objects                           |
  | `THEME_COLORS` and image sizes                               | `src/lib/theme.ts`           | Brand colors for generated images and manifest  |

- **No utility libraries.** No lodash, clsx, zod or date library. The runtime dependencies are `next`, `react` and `react-dom`.
- **Small files.** One component or one topic per file. When a function passes about 30 lines, split it into named steps.
