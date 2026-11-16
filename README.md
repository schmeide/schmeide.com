# schmeide.com

The marketing site for schmeide.com. It is a Next.js App Router project exported as static HTML and served from GitHub Pages.

## Requirements

- Node.js 22.18 or newer
- pnpm, at the version pinned in the `packageManager` field of `package.json`

If you use Corepack, `corepack enable` picks up the pinned pnpm. Without it, prefix commands with `npx pnpm@<version>`.

## Install

```sh
pnpm install
```

## Run

```sh
pnpm dev
```

Open http://localhost:3000. Unconfirmed copy is shown with a visible placeholder label in development.

## Build

```sh
pnpm build
```

This writes the static site to `out/`. There is no server. Production builds hide placeholder labels.

## Preview the static output

```sh
pnpm build
pnpm start
```

`pnpm start` serves `out/` at http://localhost:3000, the same files GitHub Pages will serve.

## Checks

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
```

`pnpm format` rewrites files with Prettier.

## Where to read next

- [AGENTS.md](AGENTS.md): the rules for working in this repo, for people and coding agents.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): the directory layout, boundaries and conventions.
- [docs/decisions/](docs/decisions/): short records of the calls that are not obvious.
- [design/shopfront-draft.html](design/shopfront-draft.html): the approved visual direction. Open it in a browser. The app does not import it.
