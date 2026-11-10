# Lessons

Append-only. Newest at the bottom. Each lesson has a stable ID (L<n>): never renumber or reuse one.

## L1: Never hide a CI wait's exit code before merging (2026-10-17)
Piping `gh pr checks --watch` through `tail` swallowed a failing Lighthouse check, and PR #32 merged red. Always check the real exit code (`gh pr checks <n>` → 0) before `gh pr merge`.

## L2: Lighthouse's first run after Chrome starts is unreliable (2026-10-17)
On CI, the first audit after launch returned null scores (NO_NAVSTART) and a 94. Fix with a discarded warm-up audit and retrying runs that error, not by lowering the threshold.

## L3: HTML comments ship to readers (2026-10-17)
`<!-- -->` in Markdown posts and in .astro templates ends up in the built HTML (and in RSS for posts). Use `{/* */}` in .astro; remove TODO comments from posts before publishing.

## L4: Check a fix's side effects in the closed state (2026-10-17)
`display: contents` on `::details-content` put the email inline but also unhid it while closed, because that box is what hides it. Hide explicitly with `:not([open])`.

## L5: Prefer the plain tool over the wrapper for dev deps (2026-10-17)
@lhci/cli pulled in 17 known vulnerabilities; `lighthouse` + `chrome-launcher` directly had 0 and gave more control (real response headers). Run `npm audit` after adding a dev dependency.

## L6: Subsetting an OFL font is a modification (2026-10-17)
A Reserved Font Name (Libron) can't be used on a subset, so the subset ships renamed (DJM Text) with the OFL, copyright and a notice of changes.

## L7: Default code themes can fail contrast (2026-10-17)
Shiki's github-light/github-dark comment color failed WCAG AA on the panel background (Accessibility 95). The high-contrast GitHub themes pass.

## L8: Scope a /goal to the task, not the whole queue (2026-10-17)
A "work until finished" goal looped because the checker counted items only the user could resolve. When a goal is active, keep user-dependent items out of the open list, or note that the goal covers only the current task.

## L9: Don't add causes or feelings the sources don't contain (2026-10-30)
Two drafts put words in Djole's mouth: "I learned more writing it than I expected" and "my thesis recommended X, so I started serbeval". Neither was in his files. When drafting from sources, state only what they say; offer a slot for his own words instead.

## L10: Vercel Web Analytics API takes since/until, not from/to (2026-10-30)
`vercel api /v1/query/web-analytics/visits/aggregate` needs `since` and `until` (dates) plus `by=requestPath|referrerHostname|country`. With `from`/`to` it returns "missing required property since". Custom events need a paid plan; visits and page views work on Hobby.
