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
| Lighthouse 100 across Performance, Accessibility, Best Practices, SEO (mobile) | checked locally before release |

`npm run verify` runs `astro check`, `astro build` and the budget script. CI runs the same command on every push to `main` and every pull request, so a change that adds a script tag, an external stylesheet or a heavy page cannot merge.

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
.github/workflows/ci.yml   npm ci + npm run verify
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
