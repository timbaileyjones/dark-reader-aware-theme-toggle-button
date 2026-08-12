import { isDarkReaderActive } from './is-dark-reader-active.js';

/**
 * Watch for Dark Reader being enabled or disabled. Calls `onChange` immediately
 * and whenever DR signals appear or disappear. Returns an unsubscribe function.
 */
export function watchDarkReader(
  onChange: (active: boolean) => void,
  doc: Document = document,
): () => void {
  const html = doc.documentElement;
  const check = () => onChange(isDarkReaderActive(doc));

  check();

  const htmlObserver = new MutationObserver(check);
  htmlObserver.observe(html, {
    attributes: true,
    attributeFilter: ['data-darkreader-scheme', 'data-darkreader-mode'],
  });

  let headObserver: MutationObserver | null = null;
  if (doc.head) {
    headObserver = new MutationObserver(check);
    headObserver.observe(doc.head, { childList: true, subtree: true });
  }

  return () => {
    htmlObserver.disconnect();
    headObserver?.disconnect();
  };
}
