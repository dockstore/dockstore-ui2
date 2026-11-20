/**
 * True if site should be in extended mode, false otherwise
 */
export function toExtendSite(url: string): boolean {
  return (
    url.startsWith('/my-workflows') ||
    url.startsWith('/my-tools') ||
    url.startsWith('/my-services') ||
    url.startsWith('/my-notebooks') ||
    url.startsWith('/starred') ||
    url.startsWith('/accounts') ||
    url.startsWith('/dashboard')
  );
}

// The below escape() implementation is adapted from mustache.js
// https://github.com/janl/mustache.js/blob/972fd2b27a036888acfcb60d6119317744fac7ee/mustache.js#L60
export const escapeCharToEntity = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

export function escape(text: string | null | undefined): string {
  return String(text ?? '').replace(/[&<>"'`=\/]/g, (c) => {
    return escapeCharToEntity[c];
  });
}
