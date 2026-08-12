import {
  mountThemeToggleButton,
  getTheme,
  toggleTheme,
  isDarkReaderActive,
  watchDarkReader,
} from 'dark-reader-aware-theme-toggle-button';
import 'dark-reader-aware-theme-toggle-button/styles/toggle-button.css';

mountThemeToggleButton({
  button: '#theme-toggle',
  label: '#theme-toggle-text',
  onThemeChange: (theme) => {
    console.log('[demo] theme changed ->', theme);
  },
});

const drStatus = document.getElementById('dr-status');
const apiOutput = document.getElementById('api-output');

function renderDrStatus() {
  drStatus.textContent = isDarkReaderActive()
    ? 'Dark Reader detected — the toggle button is hidden.'
    : 'Dark Reader not detected — the toggle button is visible.';
}

renderDrStatus();
watchDarkReader(renderDrStatus);

document.getElementById('btn-get-theme').addEventListener('click', () => {
  apiOutput.textContent = `getTheme() -> "${getTheme()}"`;
});

document.getElementById('btn-toggle-theme').addEventListener('click', () => {
  const theme = toggleTheme();
  apiOutput.textContent = `toggleTheme() -> "${theme}"`;
});

document.getElementById('btn-is-dr-active').addEventListener('click', () => {
  apiOutput.textContent = `isDarkReaderActive() -> ${isDarkReaderActive()}`;
});
