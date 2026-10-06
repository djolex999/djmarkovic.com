# djmarkovic.com

[![CI](https://github.com/djolex999/djmarkovic.com/actions/workflows/ci.yml/badge.svg)](https://github.com/djolex999/djmarkovic.com/actions/workflows/ci.yml)

Personal site of Djordje Marković, full-stack and AI engineer in Belgrade. Live at [djmarkovic.com](https://djmarkovic.com).

The site is meant to be its own proof of engineering quality: a single static page that ships no JavaScript, no web fonts and no external requests, with every constraint enforced in CI rather than by good intentions.

## Constraints

| Constraint | Enforced by |
| --- | --- |
| Zero client JavaScript (the only `<script>` is JSON-LD) | `scripts/budget.mjs` |
| No external stylesheets, CSS inlined at build | `build.inlineStylesheets: "always"` + budget script |
| Every HTML page under 10 KB gzipped | `scripts/budget.mjs` |
| TypeScript `strictest`, no `any` | `astro check` |
| Strict CSP, HSTS, COOP, locked-down Permissions-Policy | `vercel.json` |
| System font stacks only, light and dark via `prefers-color-scheme` | `src/styles/global.css` |
| Lighthouse 100 across Performance, Accessibility, Best Practices, SEO (mobile) | checked with `npx lighthouse` before release |

`npm run verify` runs `astro check`, `astro build` and the budget script. CI runs the same command on every push to `main` and every pull request, so a change that adds a script tag, an external stylesheet or a heavy page cannot merge.

## Current numbers

Measured on production in October 2026.

| Page | Raw | Gzip | Budget |
| --- | --- | --- | --- |
| `/` | 11.2 KB | 3.7 KB | 10 KB |
| `/404` | 5.4 KB | 2.0 KB | 10 KB |

Lighthouse (mobile) on `https://djmarkovic.com/`: Performance 100, Accessibility 100, Best Practices 100, SEO 100. The 404 page scores lower on SEO by design, because it is `noindex`.

## Stack

- [Astro](https://astro.build) 7, `output: "static"`, `build.format: "file"`, `trailingSlash: "never"`
- TypeScript with `astro/tsconfigs/strictest`
- `@astrojs/sitemap`
- `sharp` (dev only) to render the Open Graph image
- Hosted on Vercel, domain on Porkbun

## Structure

```
src/
  config/site.ts           identity, contact links, CV toggle
  data/projects.ts         FeaturedProject / SmallProject data
  layouts/Base.astro       <head>: meta, canonical, OG/Twitter, theme-color, JSON-LD Person
  components/
    Header.astro           name, role, contact nav
    ProjectEntry.astro     one featured project, optional "the hard part" panel
  pages/
    index.astro
    404.astro              noindex
  styles/global.css        tokens, dark mode, focus styles, skip link
scripts/
  budget.mjs               fails the build on JS, external CSS, executable scripts or pages > 10 KB gzip
  og.mjs                   renders public/og.png (1200x630) from SVG
public/                    favicon.svg, robots.txt, og.png
vercel.json                headers, redirects, clean URLs
.github/
  workflows/ci.yml         npm ci + npm run verify
  pull_request_template.md
```

## Development

Requires Node 22 (see `.nvmrc`).

```bash
npm ci
npm run dev      # local dev server
npm run check    # type check
npm run build    # static build to dist/
npm run verify   # check + build + budget (what CI runs)
npm run og       # regenerate public/og.png
```

## Deployment

Vercel's Git integration deploys the site:

- every push to `main` deploys to production at `djmarkovic.com`
- every pull request gets a preview deployment
- `www.djmarkovic.com` permanently redirects to the apex, keeping the path

`vercel.json` sets the security headers on every route. The CSP is `default-src 'none'` with only what a static page needs added back: inline styles, same-origin images, and `connect-src 'self'`. That last one exists because Lighthouse fetches `/robots.txt` from inside the page and would otherwise fail the SEO audit. `script-src` still falls back to `'none'`, so no code can run to use it.

To run Lighthouse locally, start a preview with `npm run build && npx astro preview`, then:

```bash
npx lighthouse http://localhost:4321/ --form-factor=mobile --chrome-flags="--headless=new" --view
```

`astro preview` does not apply the headers from `vercel.json`. To check them, run Lighthouse against `https://djmarkovic.com/`.

## Workflow

Changes land through small pull requests, one concern each, with conventional commits. The PR template asks for what changed, why, and how it was verified. CI must pass before merge. See the [merged pull requests](https://github.com/djolex999/djmarkovic.com/pulls?q=is%3Apr+is%3Amerged) for examples.

## Adding a project

Add an entry to `featuredProjects` or `smallProjects` in `src/data/projects.ts`. The types require everything a project needs.

- `hardPart` is optional; the "the hard part" panel only renders when it is set.
- `note` (for example `"source private"`) renders in place of a source link for closed-source work.

Run `npm run verify` to confirm the page still fits the budget. If the featured projects change, update the bottom line in `scripts/og.mjs` and run `npm run og`.

## Enabling the CV

1. Add the file at `public/cv.pdf`.
2. In `src/config/site.ts`, change `cv: null` to `cv: "/cv.pdf"`.

The nav only renders the link when `site.cv` is set, so there is never a dead link.

## License

Code is MIT licensed. Written content and the OG image are © Djordje Marković. See [LICENSE](LICENSE).
