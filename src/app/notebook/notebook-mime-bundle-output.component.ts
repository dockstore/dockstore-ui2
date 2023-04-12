import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-notebook-mime-bundle-output',
  templateUrl: './notebook-mime-bundle-output.component.html',
})
export class NotebookMimeBundleOutputComponent implements OnChanges {
  @Input() output: any;
  html: string;

  constructor() {}

  ngOnChanges(): void {
    const mimeBundle = this.output?.data ?? {};
    const metadataBundle = this.output?.metadata ?? {};
    this.html = this.createHtmlFromBundles(mimeBundle, metadataBundle);
  }

  /**
   * A list of the mime types we will display, ordered from "best" to "worst".
   */
  supportedMimeTypes = ['image/png', 'image/webp', 'image/jpeg', 'image/gif', 'text/html', 'text/json', 'text/plain'];

  selectBestFromMimeBundle(mimeBundle: any): { mimeType: string; data: string } {
    for (const mimeType of this.supportedMimeTypes) {
      const data = mimeBundle[mimeType];
      if (data != undefined) {
        return { mimeType: mimeType, data: this.join(data) };
      }
    }
    return undefined;
  }

  createHtmlFromBundles(mimeBundle: any, metadataBundle: any): string {
    const mimeObject = this.selectBestFromMimeBundle(mimeBundle);
    const mimeType = mimeObject?.mimeType;
    const data = mimeObject?.data;
    const metadata = metadataBundle[mimeType];
    if (mimeType?.startsWith('image/')) {
      return (
        '<img' +
        this.createAttribute('src', `data:${mimeType};base64,${data}`) +
        this.createAttribute('width', metadata?.width) +
        this.createAttribute('height', metadata?.height) +
        '>'
      );
    }
    if (mimeType === 'text/html') {
      return data;
    }
    if (mimeType?.startsWith('text/')) {
      return this.escape(data);
    }
    return undefined;
  }

  createAttribute(name: string, value: string): string {
    if (value != undefined) {
      return ` ${name}="${this.escape(value)}"`;
    } else {
      return '';
    }
  }

  // The below escape() implementation is adapted from mustache.js
  // https://github.com/janl/mustache.js/blob/972fd2b27a036888acfcb60d6119317744fac7ee/mustache.js#L60
  charToEntity = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };

  escape(text: string): string {
    return String(text).replace(/[&<>"'`=\/]/g, (c) => {
      return this.charToEntity[c];
    });
  }

  join(value: any): string {
    if (value == undefined) {
      return '';
    }
    if (Array.isArray(value)) {
      return value.join('');
    }
    return String(value);
  }
}
