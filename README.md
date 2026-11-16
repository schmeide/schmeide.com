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

## Browser tests and budgets

```sh
pnpm exec playwright install chromium
pnpm test:e2e
pnpm build
pnpm lighthouse
```

`pnpm test:e2e` builds the site and runs Playwright with axe against it. `pnpm lighthouse` checks the budgets in `lighthouserc.json`. Set `CHROME_PATH` if Lighthouse cannot find a browser.

## Images

Source photos live in `assets/images`, one per image slot in `src/content/images.ts`. After you add or change one:

```sh
pnpm images
```

Commit the files it writes to `public/images`. The build does not run this script.

## Waitlist

The form posts JSON (`name`, `email`, `business`) to the address in `NEXT_PUBLIC_WAITLIST_ENDPOINT`. The value is read at build time and is public. Without it, the form tells the visitor that sign-ups are not open and saves nothing. For the deployed site, set a repository variable with that name under Settings, Secrets and variables, Actions, Variables.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `out/` to GitHub Pages. A person has to do these steps once:

1. In the repository settings, under Pages, set the source to "GitHub Actions".
2. In the same place, set the custom domain to `schmeide.com`. `public/CNAME` already holds it.
3. At the DNS provider, add the apex records for GitHub Pages: `A` records for `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, and `AAAA` records for `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153` and `2606:50c0:8003::153`. Check them against the GitHub Pages documentation before you save.
4. Add a `CNAME` record for `www` that points at `schmeide.github.io`.
5. When the certificate is ready, turn on "Enforce HTTPS".

The deploy job fails until step 1 is done. That is expected.

## Where to read next

- [AGENTS.md](AGENTS.md): the rules for working in this repo, for people and coding agents.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): the directory layout, boundaries and conventions.
- [docs/decisions/](docs/decisions/): short records of the calls that are not obvious.
- [design/shopfront-draft.html](design/shopfront-draft.html): the approved visual direction. Open it in a browser. The app does not import it.
