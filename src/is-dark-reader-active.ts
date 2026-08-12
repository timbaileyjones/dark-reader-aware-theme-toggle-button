/**
 * Returns true when the Dark Reader browser extension is actively modifying
 * the page. Checks all known signals across dynamic, filter, and static modes.
 */
export function isDarkReaderActive(doc: Document = document): boolean {
  const html = doc.documentElement;
  return (
    html.hasAttribute('data-darkreader-scheme') ||
    html.hasAttribute('data-darkreader-mode') ||
    doc.querySelector('meta[name="darkreader"]') != null ||
    doc.getElementById('dark-reader-style') != null
  );
}
