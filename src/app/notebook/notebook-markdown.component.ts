import { Component, Input, OnChanges, SecurityContext } from '@angular/core';
import { MarkdownWrapperService } from '../shared/markdown-wrapper/markdown-wrapper.service';
import { join, replaceAll, selectBestFromMimeBundle } from './helpers';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-notebook-markdown',
  templateUrl: './notebook-markdown.component.html',
})
export class NotebookMarkdownComponent implements OnChanges {
  @Input() cell: any;
  @Input() baseUrl: string;
  html: string;

  constructor(private markdownWrapperService: MarkdownWrapperService, private sanitizer: DomSanitizer) {}

  ngOnChanges(): void {
    // Be very careful when modifying this function, because to accomodate MathJax markup,
    // it must implement its own sanitization scheme.
    const dangerousHtml = this.compileMarkdown(join(this.cell.source), this.cell.attachments);
    // Sanitize using both the markdown wrapper and Angular sanitizers.
    const sanitizedHtml = this.sanitizer.sanitize(SecurityContext.HTML, this.markdownWrapperService.customSanitize(dangerousHtml));

    // TODO Find, format, and sanitize the math expressions in <p> text
    const mathjaxedSanitizedHtml = this.formatMath(sanitizedHtml);

    // TODO Mark as pre-sanitized and assign to html field
    this.html = mathjaxedSanitizedHtml;
  }

  compileMarkdown(markdown: string, attachments: any): string {
    let adjusted = markdown;
    // Make some adjustments to the input markdown to support attached
    // notebook images and embedded TeX math expressions.
    adjusted = this.convertBackslashedDollars(adjusted);
    adjusted = this.inlineAttachedImages(adjusted, attachments);
    adjusted = this.preprocessLatexMath(adjusted);
    // Convert the adjusted markdown to HTML using our wrapper.
    return this.markdownWrapperService.customCompile(adjusted, this.baseUrl);
  }

  formatMath(html: string): string {
    // parse html into elements
    // find the non-code elements
    return html;
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
          const mimeObject = selectBestFromMimeBundle(mimeBundle);
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
        return leadingDollars + replaceAll(content, '\\\\', '\\\\\\\\');
      }
      return match;
    });
  }
}
