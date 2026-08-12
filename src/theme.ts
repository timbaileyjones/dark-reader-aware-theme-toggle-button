export type Theme = 'light' | 'dark';

export interface ThemeOptions {
  /** localStorage key. Default: `theme` */
  storageKey?: string;
  /** Attribute on `<html>`. Default: `data-theme` */
  attribute?: string;
  /** Attribute value for dark mode. Default: `dark` */
  darkValue?: string;
  /** Use prefers-color-scheme when no saved preference exists. Default: false */
  respectSystemPreference?: boolean;
}

function getStorage(doc: Document): Storage | null {
  return doc.defaultView?.localStorage ?? null;
}

function prefersDark(doc: Document): boolean {
  return doc.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches ?? false;
}

/** Read saved theme, optionally falling back to system preference. */
export function getTheme(options: ThemeOptions = {}, doc: Document = document): Theme {
  const { storageKey = 'theme', respectSystemPreference = false } = options;
  const saved = getStorage(doc)?.getItem(storageKey);
  if (saved === 'dark' || saved === 'light') return saved;
  if (respectSystemPreference && prefersDark(doc)) return 'dark';
  return 'light';
}

/** Apply theme to `<html>` and persist to localStorage. */
export function setTheme(theme: Theme, options: ThemeOptions = {}, doc: Document = document): void {
  const { storageKey = 'theme', attribute = 'data-theme', darkValue = 'dark' } = options;
  const html = doc.documentElement;
  if (theme === 'dark') {
    html.setAttribute(attribute, darkValue);
  } else {
    html.removeAttribute(attribute);
  }
  getStorage(doc)?.setItem(storageKey, theme);
}

/** Read current theme from the DOM attribute (not localStorage). */
export function getCurrentTheme(options: ThemeOptions = {}, doc: Document = document): Theme {
  const { attribute = 'data-theme', darkValue = 'dark' } = options;
  return doc.documentElement.getAttribute(attribute) === darkValue ? 'dark' : 'light';
}

/** Toggle theme; returns the new value. */
export function toggleTheme(options: ThemeOptions = {}, doc: Document = document): Theme {
  const next: Theme = getCurrentTheme(options, doc) === 'dark' ? 'light' : 'dark';
  setTheme(next, options, doc);
  return next;
}

/** Apply saved theme before first paint to avoid flash. Call from an inline `<head>` script. */
export function initThemeEarly(options: ThemeOptions = {}, doc: Document = document): Theme {
  const theme = getTheme(options, doc);
  setTheme(theme, options, doc);
  return theme;
}
