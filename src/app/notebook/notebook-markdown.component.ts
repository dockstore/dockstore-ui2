import { Component, Input, OnChanges } from '@angular/core';
import { MarkdownWrapperService } from '../shared/markdown-wrapper/markdown-wrapper.service';

@Component({
  selector: 'app-notebook-markdown',
  templateUrl: './notebook-markdown.component.html',
})
export class NotebookMarkdownComponent implements OnChanges {
  @Input() cell: any;
  @Input() baseUrl: string;
  html: string;

  constructor(private markdownWrapperService: MarkdownWrapperService) {}

  ngOnChanges(): void {
    this.html = this.compileMarkdown(this.join(this.cell.source), this.cell.attachments);
  }

  compileMarkdown(markdown: string, attachments: any): string {
    let adjusted = markdown;
    adjusted = this.convertBackslashedDollars(adjusted);
    adjusted = this.inlineAttachedImages(adjusted, attachments);
    adjusted = this.preprocessLatexMath(adjusted);
    return this.markdownWrapperService.customCompile(adjusted, this.baseUrl);
  }

  /**
   * Change any dollar sign preceded by a backslash to the dollar HTML entity.
   */
  convertBackslashedDollars(markdown: string): string {
    return markdown.replace(/\\\$/g, '&dollar;');
  }

  /**
   * Convert 'attachment:' image references to data urls.
   */
  inlineAttachedImages(markdown: string, attachments: any) {
    if (attachments == undefined) {
      return markdown;
    }
    return markdown
      .split('\n')
      .map((line) => {
        // If we're in a code block, don't change anything.
        if (line.startsWith('    ')) {
          return line;
        }
        return line.replace(/]\(attachment:([^) "]+)/g, (match, key) => {
          const mimeBundle = attachments[key] ?? {};
          const mimeObject = this.selectBestFromMimeBundle(mimeBundle);
          if (mimeObject) {
            return `](data:${mimeObject.mimeType};base64,${mimeObject.data}`;
          } else {
            return match;
          }
        });
      })
      .join('\n');
  }

  /**
   * For any text between a run of dollar signs that looks like TeX mathematics,
   * escape the double backslashes.
   */
  preprocessLatexMath(markdown: string): string {
    return markdown.replace(/(\$+)([^$]+)(?=\$+)/gms, (match, leadingDollars, content) => {
      if (content.match(/^\s*\\begin\{[^}]*}/ms) && content.match(/\\end\{[^}]*}\s*$/ms)) {
        return leadingDollars + this.replaceAll(content, '\\\\', '\\\\\\\\');
      }
      return match;
    });
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

  join(value: any): string {
    if (value == undefined) {
      return '';
    }
    if (Array.isArray(value)) {
      return value.join('');
    }
    return String(value);
  }

  replaceAll(value: string, from: string, to: string) {
    return value.split(from).join(to);
  }
}
