import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const html = readFileSync('./dist/index.html', 'utf8');
const jsMatch = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
const jsPath = './dist' + jsMatch[1];
const script = readFileSync(jsPath, 'utf8');

const dom = new JSDOM(html.replace(/<script[^>]*src="[^"]+"[^>]*><\/script>/, ''), {
  url: 'http://localhost/',
  runScripts: 'dangerously',
  resources: 'usable',
});

const { window } = dom;

function assert(cond, msg) {
  if (!cond) throw new Error('FAIL: ' + msg);
  console.log('PASS:', msg);
}

// Run the built bundle inside the jsdom window, as the browser would.
const scriptEl = window.document.createElement('script');
scriptEl.textContent = script.replace('export{', 'window.__exports={');
window.eval(script);

const html_el = window.document.documentElement;
const button = window.document.getElementById('theme-toggle');
const label = window.document.getElementById('theme-toggle-text');
const drStatus = window.document.getElementById('dr-status');

assert(button !== null, 'toggle button exists in DOM');
assert(label.textContent === 'Dark', 'initial label is "Dark" (light mode default)');
assert(html_el.getAttribute('data-theme') === null, 'no data-theme attribute set in light mode');
assert(
  drStatus.textContent.includes('not detected'),
  'Dark Reader correctly reported as not active: "' + drStatus.textContent + '"'
);

// Simulate a real user click.
button.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));

assert(html_el.getAttribute('data-theme') === 'dark', 'clicking the button sets data-theme="dark"');
assert(label.textContent === 'Light', 'label updates to "Light" after toggling to dark mode');
assert(
  window.localStorage.getItem('theme') === 'dark',
  'theme choice persisted to localStorage'
);

// Click again to toggle back.
button.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
assert(html_el.getAttribute('data-theme') === null, 'clicking again removes data-theme (back to light)');
assert(label.textContent === 'Dark', 'label reverts to "Dark"');

// Simulate Dark Reader injecting its dynamic-mode marker and confirm the button hides.
html_el.setAttribute('data-darkreader-scheme', 'dark');
// MutationObserver callbacks are async (microtask); flush manually.
await new Promise((r) => setTimeout(r, 0));
assert(button.style.visibility === 'hidden', 'button hides itself when Dark Reader signal appears');
assert(
  drStatus.textContent.includes('Dark Reader detected'),
  'status text updates live via watchDarkReader(): "' + drStatus.textContent + '"'
);

html_el.removeAttribute('data-darkreader-scheme');
await new Promise((r) => setTimeout(r, 0));
assert(button.style.visibility !== 'hidden', 'button reappears once Dark Reader signal is removed');

console.log('\nAll checks passed — the package works end-to-end in this demo site.');
