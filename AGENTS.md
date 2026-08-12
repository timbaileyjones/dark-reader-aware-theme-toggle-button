# Agent Guidelines

Read this before working in this repository.

## Project

npm package **`dark-reader-aware-theme-toggle-button`** — Dark mode toggle that
detects the [Dark Reader](https://darkreader.org/) browser extension and hides
itself while DR is active.

- **npm author:** `timbaileyjones`
- **Public repo:** https://github.com/timbaileyjones/dark-reader-aware-theme-toggle-button
- **License:** MIT

## Git remotes

`origin` fetch/pull: Forgejo (primary). A plain `git push` also pushes to GCP
Cloud Source Repositories and GitHub. Do not add a separate `forgejo` remote;
do not push to Forgejo-only remotes outside `origin`.

## Build

```bash
npm install
npm test
npm run build
```

`npm run build` is **`tsup` only**. The browser IIFE bundle must land as
`dist/global.js` via `outExtension` in `tsup.config.ts`. Do not add shell `mv`
rename steps to `package.json` scripts.

## Publishing

See [PUBLISH.md](PUBLISH.md). Requires `npm login` as `timbaileyjones` on the
machine doing the publish.

## Commit messages

- No `Co-authored-by` trailers.
- Focus on why, not just what.

## Dark Reader detection

When updating detection logic, check all four signals (dynamic + filter/static
modes). Reference sites using this pattern: linuxtampa.com, bailey-jones.com,
when-i-die — keep them in sync after package changes.

## Public documentation

README and npm metadata point at **GitHub only**. Do not advertise Forgejo or
GCP mirror URLs in user-facing docs.
