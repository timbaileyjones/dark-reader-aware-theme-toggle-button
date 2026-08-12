# Publishing

Package: `dark-reader-aware-theme-toggle-button`  
npm author: `timbaileyjones`

## Git remotes

`origin` fetch/pull: **Forgejo** (primary)  
`origin` push (all three):

| Remote | URL |
|--------|-----|
| Forgejo | `ssh://git@forgejo.linuxtampa.com:30022/tim/dark-reader-aware-theme-toggle-button.git` |
| GCP Cloud Source | `ssh://tim@timjones.com@source.developers.google.com:2022/p/timbaileyjones-gcloud-assets/r/dark-reader-aware-theme-toggle-button` |
| GitHub (public) | `git@github.com:timbaileyjones/dark-reader-aware-theme-toggle-button.git` |

A plain `git push` hits all three push URLs.

## One-time setup

1. Verify npm login on this machine:
   ```bash
   npm login
   npm whoami   # should print: timbaileyjones
   ```
2. Enable 2FA on your npm account (required for `npm publish`).

## Publish a release

```bash
cd ~/go/src/github.com/timbaileyjones/dark-reader-aware-theme-toggle-button
npm install
npm test
npm run build
npm publish --access public
git tag v0.1.1   # or next version
git push origin main --tags
```

`prepublishOnly` runs build + test automatically.

## Build

`npm run build` runs `tsup` only. The browser IIFE bundle is emitted as
`dist/global.js` via `outExtension` in `tsup.config.ts` — no shell rename hacks.
