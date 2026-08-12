import {
  isDarkReaderActive,
  watchDarkReader,
  getTheme,
  setTheme,
  getCurrentTheme,
  toggleTheme,
  initThemeEarly,
  mountThemeToggleButton,
} from './index.js';

const api = {
  isDarkReaderActive,
  watchDarkReader,
  getTheme,
  setTheme,
  getCurrentTheme,
  toggleTheme,
  initThemeEarly,
  mount: mountThemeToggleButton,
  mountThemeToggleButton,
};

export default api;

// tsup IIFE global
declare global {
  interface Window {
    DarkReaderAwareThemeToggle: typeof api;
  }
}

if (typeof window !== 'undefined') {
  window.DarkReaderAwareThemeToggle = api;
}
