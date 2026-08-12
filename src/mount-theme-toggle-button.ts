import { isDarkReaderActive } from './is-dark-reader-active.js';
import { watchDarkReader } from './watch-dark-reader.js';
import {
  getTheme,
  setTheme,
  toggleTheme,
  type Theme,
  type ThemeOptions,
} from './theme.js';

export interface MountOptions extends ThemeOptions {
  /** Button element or CSS selector */
  button: string | HTMLElement;
  /** Label element or CSS selector (optional; falls back to button textContent) */
  label?: string | HTMLElement;
  /** Button label text in each theme state */
  labels?: { light: string; dark: string };
  /** Hide the button while Dark Reader is active. Default: true */
  hideWhenDarkReaderActive?: boolean;
  /** Called after initial mount and on each toggle */
  onThemeChange?: (theme: Theme) => void;
}

function resolveElement(ref: string | HTMLElement, doc: Document): HTMLElement | null {
  return typeof ref === 'string' ? doc.querySelector<HTMLElement>(ref) : ref;
}

/**
 * Wire a button to toggle `data-theme` on `<html>`, persist preference, update
 * label text, and hide the button when Dark Reader is active.
 * Returns an unmount function.
 */
export function mountThemeToggleButton(
  options: MountOptions,
  doc: Document = document,
): () => void {
  const button = resolveElement(options.button, doc);
  if (!button) {
    throw new Error('mountThemeToggleButton: button element not found');
  }

  const labelEl = options.label ? resolveElement(options.label, doc) : null;
  const labels = options.labels ?? { light: 'Dark', dark: 'Light' };
  const hideWhenDR = options.hideWhenDarkReaderActive !== false;

  const updateLabel = (theme: Theme) => {
    const text = theme === 'dark' ? labels.dark : labels.light;
    if (labelEl) {
      labelEl.textContent = text;
    } else {
      button.textContent = text;
    }
  };

  const theme = getTheme(options, doc);
  setTheme(theme, options, doc);
  updateLabel(theme);
  options.onThemeChange?.(theme);

  const onClick = () => {
    const next = toggleTheme(options, doc);
    updateLabel(next);
    options.onThemeChange?.(next);
  };
  button.addEventListener('click', onClick);

  let unwatchDR: (() => void) | undefined;
  if (hideWhenDR) {
    unwatchDR = watchDarkReader((active) => {
      button.style.visibility = active ? 'hidden' : '';
    }, doc);
  }

  return () => {
    button.removeEventListener('click', onClick);
    unwatchDR?.();
  };
}

export { isDarkReaderActive, watchDarkReader, getTheme, setTheme, toggleTheme };
export type { Theme, ThemeOptions };
