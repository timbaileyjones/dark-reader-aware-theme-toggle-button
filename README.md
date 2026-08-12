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

## Install

```bash
npm install dark-reader-aware-theme-toggle-button
```

## Quick start (static site, no bundler)

```html
<link rel="stylesheet" href="/node_modules/dark-reader-aware-theme-toggle-button/styles/toggle-button.css">

<!-- Your site CSS: define :root and [data-theme="dark"] variables -->

<button class="dra-theme-toggle" id="theme-toggle" aria-label="Toggle dark mode">
  <span id="theme-toggle-text">Dark</span>
</button>

<script src="/node_modules/dark-reader-aware-theme-toggle-button/dist/global.js"></script>
<script>
  DarkReaderAwareThemeToggle.mount({
    button: '#theme-toggle',
    label: '#theme-toggle-text',
  });
</script>
```

Or from a CDN after publish:

```html
<script src="https://unpkg.com/dark-reader-aware-theme-toggle-button/dist/global.js"></script>
```

## Quick start (ES modules)

```javascript
import { mountThemeToggleButton } from 'dark-reader-aware-theme-toggle-button';
import 'dark-reader-aware-theme-toggle-button/styles/toggle-button.css';

mountThemeToggleButton({
  button: '#theme-toggle',
  label: '#theme-toggle-text',
});
```

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

### Lower-level exports

- `isDarkReaderActive()` — synchronous check
- `watchDarkReader(onChange)` — observer; returns unsubscribe
- `getTheme()`, `setTheme()`, `toggleTheme()`, `initThemeEarly()`

### Avoid flash of wrong theme

Inline in `<head>` before CSS:

```html
<script type="module">
  import { initThemeEarly } from 'dark-reader-aware-theme-toggle-button';
  initThemeEarly();
</script>
```

For no-module static sites, call `DarkReaderAwareThemeToggle.initThemeEarly()` from a blocking head script after loading the IIFE bundle.

## Design notes

- Uses `visibility: hidden` (not `display: none`) when hiding from Dark Reader so nav layout doesn't shift.
- Zero runtime dependencies.
- TypeScript types included.

## Used on

- [linuxtampa.com](https://linuxtampa.com)
- [bailey-jones.com](https://bailey-jones.com)
- [when-i-die](https://when-i-die.linuxtampa.com) (private family site)

## License

MIT
