# dark-reader-aware-theme-toggle-button

Dark mode toggle button that **steps aside when [Dark Reader](https://darkreader.org/) is active** — so your site's theme and the extension don't fight.

By [Tim Bailey-Jones](https://linuxtampa.com) (`timbaileyjones` on npm).

Source: [github.com/timbaileyjones/dark-reader-aware-theme-toggle-button](https://github.com/timbaileyjones/dark-reader-aware-theme-toggle-button)

## Why

Sites with their own dark mode toggle can clash with Dark Reader: double-inversion, muddy colors, broken contrast. The polite fix is to detect Dark Reader and hide your toggle while it's doing the job.

Dark Reader uses different DOM signals depending on mode:

| DR mode | Signals |
|---------|---------|
| Dynamic | `data-darkreader-scheme`, `data-darkreader-mode`, `meta[name="darkreader"]` |
| Filter / Static | `data-darkreader-mode`, `#dark-reader-style` (no `data-darkreader-scheme`) |

This library checks all of them and watches for late injection via `MutationObserver`.

I wrote up the background and design decisions behind this in more detail: [Building a Dark Mode Toggle That Plays Nice With Dark Reader](https://linuxtampa.com/blog/2026-03-18-dark-mode-and-dark-reader/).

## Install

```bash
npm install dark-reader-aware-theme-toggle-button
```

## Quick start

### With a bundler (recommended)

Use the package name — your bundler resolves `node_modules` for you. Do **not** link to `/node_modules/...` in HTML; that path is not served in production.

```javascript
import { mountThemeToggleButton } from 'dark-reader-aware-theme-toggle-button';
import 'dark-reader-aware-theme-toggle-button/styles/toggle-button.css';

mountThemeToggleButton({
  button: '#theme-toggle',
  label: '#theme-toggle-text',
});
```

Works with Vite, webpack, Rollup, esbuild, Parcel, and similar tools.

### Static HTML via CDN

For plain HTML with no build step, load published files from a CDN. **Pin the version** in production (replace `0.1.4` with the version you want):

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/dark-reader-aware-theme-toggle-button@0.1.4/styles/toggle-button.css"
>

<!-- Your site CSS: define :root and [data-theme="dark"] variables -->

<button class="dra-theme-toggle" id="theme-toggle" aria-label="Toggle dark mode">
  <span id="theme-toggle-text">Dark</span>
</button>

<script src="https://cdn.jsdelivr.net/npm/dark-reader-aware-theme-toggle-button@0.1.4/dist/global.js"></script>
<script>
  DarkReaderAwareThemeToggle.mount({
    button: '#theme-toggle',
    label: '#theme-toggle-text',
  });
</script>
```

[jsDelivr](https://www.jsdelivr.com/package/npm/dark-reader-aware-theme-toggle-button) and [unpkg](https://unpkg.com/dark-reader-aware-theme-toggle-button/) both mirror npm. Equivalent unpkg URLs:

```html
<link rel="stylesheet" href="https://unpkg.com/dark-reader-aware-theme-toggle-button@0.1.4/styles/toggle-button.css">
<script src="https://unpkg.com/dark-reader-aware-theme-toggle-button@0.1.4/dist/global.js"></script>
```

### Static site with `npm install` (copy at build time)

If you run `npm install` but ship static files (Eleventy, Hugo, Jekyll, etc.), copy assets from `node_modules` into your published output during the build. Browsers never read `node_modules` directly.

**One-off copy** (adjust destination paths to match your site):

```bash
cp node_modules/dark-reader-aware-theme-toggle-button/dist/global.js src/js/dra-theme-toggle.js
cp node_modules/dark-reader-aware-theme-toggle-button/styles/toggle-button.css src/css/dra-theme-toggle.css
```

Then reference your copied paths:

```html
<link rel="stylesheet" href="/css/dra-theme-toggle.css">
<script src="/js/dra-theme-toggle.js"></script>
```

**Eleventy passthrough** (example):

```javascript
// .eleventy.js
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    'node_modules/dark-reader-aware-theme-toggle-button/dist/global.js': 'js/dra-theme-toggle.js',
    'node_modules/dark-reader-aware-theme-toggle-button/styles/toggle-button.css': 'css/dra-theme-toggle.css',
  });
}
```

Add a `postinstall` or pre-build script if you want copies to stay in sync automatically after `npm install`.

## Theming contract

This package toggles `data-theme="dark"` on `<html>` and persists to `localStorage`. **Your CSS** defines the palette:

```css
:root {
  --bg-body: #ede4d8;
  --text-primary: #2c1a0e;
}

[data-theme="dark"] {
  --bg-body: #0a0f0a;
  --text-primary: #00ff9f;
}

body {
  background: var(--bg-body);
  color: var(--text-primary);
}
```

## API

### `mountThemeToggleButton(options)`

Wire a button to toggle theme, update labels, hide when DR is active.

| Option | Default | Description |
|--------|---------|-------------|
| `button` | — | Element or CSS selector (required) |
| `label` | — | Label element or selector |
| `labels.light` | `'Dark'` | Button text in light mode |
| `labels.dark` | `'Light'` | Button text in dark mode |
| `storageKey` | `'theme'` | localStorage key |
| `attribute` | `'data-theme'` | HTML attribute on `<html>` |
| `darkValue` | `'dark'` | Attribute value for dark mode |
| `respectSystemPreference` | `false` | Use `prefers-color-scheme` on first visit |
| `hideWhenDarkReaderActive` | `true` | Hide button while DR runs |
| `onThemeChange` | — | `(theme) => void` callback |

Returns an `unmount()` function.

The IIFE / CDN global exposes the same function as `DarkReaderAwareThemeToggle.mount()`.

### Lower-level exports

- `isDarkReaderActive()` — synchronous check
- `watchDarkReader(onChange)` — observer; returns unsubscribe
- `getTheme()`, `setTheme()`, `toggleTheme()`, `initThemeEarly()`

### Avoid flash of wrong theme

Apply the saved theme before the first paint.

**With a bundler** — inline in `<head>` before CSS:

```html
<script type="module">
  import { initThemeEarly } from 'dark-reader-aware-theme-toggle-button';
  initThemeEarly();
</script>
```

**Static HTML (CDN or copied IIFE)** — blocking script in `<head>` before CSS:

```html
<script src="https://cdn.jsdelivr.net/npm/dark-reader-aware-theme-toggle-button@0.1.4/dist/global.js"></script>
<script>DarkReaderAwareThemeToggle.initThemeEarly();</script>
```

Load the bundle once; reuse it for `mount()` at the end of `<body>` if you prefer.

## Package exports

| Import path | File |
|-------------|------|
| `dark-reader-aware-theme-toggle-button` | ESM / CJS API (`dist/index.js`, `dist/index.cjs`) |
| `dark-reader-aware-theme-toggle-button/styles/toggle-button.css` | Default button styles |
| `dark-reader-aware-theme-toggle-button/global` | IIFE entry (usually loaded via `<script src=".../dist/global.js">` instead) |

## Design notes

- Uses `visibility: hidden` (not `display: none`) when hiding from Dark Reader so nav layout doesn't shift.
- Zero runtime dependencies.
- TypeScript types included.

## Used on

- [linuxtampa.com](https://linuxtampa.com)
- [bailey-jones.com](https://bailey-jones.com)

## License

MIT
