// A list of the mime types we will display, ordered from "best" to "worst".
export const supportedMimeTypes: string[] = ['image/png', 'image/webp', 'image/jpeg', 'image/gif', 'text/html', 'text/json', 'text/plain'];

export function selectBestFromMimeBundle(mimeBundle: any): { mimeType: string; data: string } {
  for (const mimeType of supportedMimeTypes) {
    const data = mimeBundle[mimeType];
    if (data != undefined) {
      return { mimeType: mimeType, data: join(data) };
    }
  }
  return undefined;
}

export function join(value: any): string {
  if (value == undefined) {
    return '';
  }
  if (Array.isArray(value)) {
    return value.join('');
  }
  return String(value);
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

export function replaceAll(value: string, from: string, to: string): string {
  return value.split(from).join(to);
}

export function escape(text: string): string {
  return String(text).replace(/[&<>"'`=\/]/g, (c) => {
    return escapeCharToEntity[c];
  });
}
