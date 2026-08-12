import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { isDarkReaderActive } from '../src/is-dark-reader-active.js';
import { watchDarkReader } from '../src/watch-dark-reader.js';
import { getTheme, setTheme, toggleTheme, initThemeEarly } from '../src/theme.js';
import { mountThemeToggleButton } from '../src/mount-theme-toggle-button.js';

function setupDom(html = '<!DOCTYPE html><html><head></head><body></body></html>') {
  const dom = new JSDOM(html, { url: 'https://example.com' });
  const { window } = dom;
  vi.stubGlobal('window', window);
  vi.stubGlobal('document', window.document);
  vi.stubGlobal('MutationObserver', window.MutationObserver);
  return dom;
}

/** MutationObserver callbacks run as microtasks in jsdom. */
async function flushObservers() {
  await new Promise((resolve) => queueMicrotask(resolve));
}

describe('isDarkReaderActive', () => {
  beforeEach(() => setupDom());
  afterEach(() => vi.unstubAllGlobals());

  it('returns false when Dark Reader is absent', () => {
    expect(isDarkReaderActive()).toBe(false);
  });

  it('detects data-darkreader-scheme (dynamic mode)', () => {
    document.documentElement.setAttribute('data-darkreader-scheme', 'dark');
    expect(isDarkReaderActive()).toBe(true);
  });

  it('detects data-darkreader-mode without scheme (filter/static mode)', () => {
    document.documentElement.setAttribute('data-darkreader-mode', 'filter');
    expect(isDarkReaderActive()).toBe(true);
  });

  it('detects meta[name="darkreader"]', () => {
    const meta = document.createElement('meta');
    meta.name = 'darkreader';
    meta.content = 'instance-id';
    document.head.appendChild(meta);
    expect(isDarkReaderActive()).toBe(true);
  });

  it('detects #dark-reader-style', () => {
    const style = document.createElement('style');
    style.id = 'dark-reader-style';
    document.head.appendChild(style);
    expect(isDarkReaderActive()).toBe(true);
  });
});

describe('watchDarkReader', () => {
  beforeEach(() => setupDom());
  afterEach(() => vi.unstubAllGlobals());

  it('calls onChange immediately with current state', () => {
    const onChange = vi.fn();
    watchDarkReader(onChange);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('calls onChange when DR attribute is added', async () => {
    const states: boolean[] = [];
    watchDarkReader((active) => states.push(active));
    document.documentElement.setAttribute('data-darkreader-mode', 'dynamic');
    await flushObservers();
    expect(states).toContain(true);
  });

  it('unsubscribe stops callbacks', () => {
    const onChange = vi.fn();
    const unsub = watchDarkReader(onChange);
    unsub();
    onChange.mockClear();
    document.documentElement.setAttribute('data-darkreader-scheme', 'dark');
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('theme', () => {
  beforeEach(() => setupDom());
  afterEach(() => vi.unstubAllGlobals());

  it('defaults to light', () => {
    expect(getTheme()).toBe('light');
  });

  it('reads and writes localStorage', () => {
    window.localStorage.setItem('theme', 'dark');
    expect(getTheme()).toBe('dark');
    setTheme('light');
    expect(window.localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('sets data-theme="dark" for dark mode', () => {
    setTheme('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('toggles theme', () => {
    setTheme('light');
    expect(toggleTheme()).toBe('dark');
    expect(toggleTheme()).toBe('light');
  });

  it('initThemeEarly applies saved theme', () => {
    window.localStorage.setItem('theme', 'dark');
    initThemeEarly();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});

describe('mountThemeToggleButton', () => {
  beforeEach(() => {
    setupDom(`
      <!DOCTYPE html><html><head></head><body>
        <button id="theme-toggle"><span id="theme-toggle-text">Dark</span></button>
      </body></html>
    `);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('throws if button is missing', () => {
    expect(() => mountThemeToggleButton({ button: '#missing' })).toThrow(/not found/);
  });

  it('updates label on click', () => {
    mountThemeToggleButton({ button: '#theme-toggle', label: '#theme-toggle-text' });
    document.getElementById('theme-toggle')!.click();
    expect(document.getElementById('theme-toggle-text')!.textContent).toBe('Light');
  });

  it('hides button with visibility hidden when DR is active', async () => {
    mountThemeToggleButton({ button: '#theme-toggle' });
    const button = document.getElementById('theme-toggle') as HTMLButtonElement;
    document.documentElement.setAttribute('data-darkreader-mode', 'filter');
    await flushObservers();
    expect(button.style.visibility).toBe('hidden');
  });

  it('unmount removes click handler', () => {
    const unmount = mountThemeToggleButton({ button: '#theme-toggle', label: '#theme-toggle-text' });
    unmount();
    document.getElementById('theme-toggle')!.click();
    expect(document.getElementById('theme-toggle-text')!.textContent).toBe('Dark');
  });
});
