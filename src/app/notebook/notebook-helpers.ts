import { MimeBundle } from './notebook-types';

// A list of the mime types we will display from a mime bundle, ordered from most to least "preferable".
// To determine which item to display from a mime bundle, we'll select the item with the mime type that appears first in this list.
export const supportedMimeTypes: string[] = ['image/png', 'image/webp', 'image/jpeg', 'image/gif', 'text/html', 'text/json', 'text/plain'];

export function selectBestFromMimeBundle(mimeBundle: MimeBundle): { mimeType: string; data: string } {
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

export function replaceAll(value: string, from: string, to: string): string {
  return value.split(from).join(to);
}
