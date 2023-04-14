import { Component, Input, OnChanges } from '@angular/core';
import { join, escape, selectBestFromMimeBundle } from './helpers';

@Component({
  selector: 'app-notebook-mime-bundle-output',
  templateUrl: './notebook-mime-bundle-output.component.html',
  styleUrls: ['./notebook-display-contents.scss'],
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

  createHtmlFromBundles(mimeBundle: any, metadataBundle: any): string {
    const mimeObject = selectBestFromMimeBundle(mimeBundle);
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
      return escape(data);
    }
    return undefined;
  }

  createAttribute(name: string, value: string): string {
    if (value != undefined) {
      return ` ${name}="${escape(value)}"`;
    } else {
      return '';
    }
  }
}
