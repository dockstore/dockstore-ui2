import { Component, Input, OnChanges } from '@angular/core';
import { join, escape, selectBestFromMimeBundle } from './helpers';
import { MarkdownWrapperService } from '../shared/markdown-wrapper/markdown-wrapper.service';

@Component({
  selector: 'app-notebook-mime-bundle-output',
  templateUrl: './notebook-mime-bundle-output.component.html',
})
export class NotebookMimeBundleOutputComponent implements OnChanges {
  @Input() output: any;
  html: string;

  constructor(private markdownWrapperService: MarkdownWrapperService) {}

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
      return this.markdownWrapperService.customSanitize(data);
    }
    if (mimeType?.startsWith('text/')) {
      return `<pre>${escape(data)}</pre>`;
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
