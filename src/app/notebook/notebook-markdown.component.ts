import { Component, Input, OnChanges, SecurityContext } from '@angular/core';
import { MarkdownWrapperService } from '../shared/markdown-wrapper/markdown-wrapper.service';
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { join, replaceAll, selectBestFromMimeBundle } from './helpers';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

@Component({
  selector: 'app-notebook-markdown',
  templateUrl: './notebook-markdown.component.html',
})
export class NotebookMarkdownComponent implements OnChanges {
  @Input() cell: any;
  @Input() baseUrl: string;
  html: string | SafeHtml;
  domParser = new DOMParser();

  constructor(
    private markdownWrapperService: MarkdownWrapperService,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnChanges(): void {
    // BE VERY CAREFUL when modifying this function, because to accomodate MathJax markup,
    // which is destroyed by the Angular sanitizer, it must implement its own sanitization scheme.
    const dangerousHtml = this.compileMarkdown(join(this.cell.source), this.cell.attachments);
    // Sanitize using both the markdown wrapper and Angular sanitizers.
    const sanitizedHtml = this.sanitizer.sanitize(SecurityContext.HTML, this.markdownWrapperService.customSanitize(dangerousHtml));

    // Format embedded TeX math expressions.
    const mathjaxedSanitizedHtml = this.formatMath(sanitizedHtml);

    // TODO Mark as pre-sanitized and assign to html field
    this.html = this.sanitizer.bypassSecurityTrustHtml(mathjaxedSanitizedHtml);
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
    // Find the global MathJax object.
    const mathjax = (<any>this.document?.defaultView)?.MathJax;
    if (mathjax == undefined) {
      console.log('mathjax not found');
      return html;
    }

    // Convert the input HTML to a DOM representation.
    const doc = this.domParser.parseFromString(html, 'text/html');

    // Apply mathjax to the DOM representation.
    mathjax.startup.output.clearCache();
    mathjax.typeset([doc.body]);

    // Get a list of things that MathJax changed.
    const mathItems = mathjax.startup.document.getMathItemsWithin(doc.body);

    // If something changed, sanitize the elements that MathJax says it changed,
    // convert the result to HTML, and prepend the MathJax Css.
    // Otherwise, return the original HTML.
    if (mathItems) {
      // For each item that MathJax formatted, inspect the resulting
      // elements and remove all elements with names that don't begin with 'mjx-'.
      for (const item of mathItems) {
        this.sanitizeMathElement(item.typesetRoot);
      }
      // Concatenate the MathJax stylesheet with the MathJax formatted HTML.
      const styleHtml = mathjax.chtmlStylesheet().outerHTML;
      const formattedHtml = doc.body.innerHTML;
      return styleHtml + formattedHtml;
    } else {
      return html;
    }
  }

  sanitizeMathElement(node: any) {
    const type = node.nodeType;
    const name = node.nodeName;
    const isText = type === 3; // TODO change to constant
    const isMjx = type === 1 && name.toLowerCase().startsWith('mjx-');
    if (!(isText || isMjx)) {
      node.parentElement.removeChild(node);
      return;
    }
    for (const child of [...node.childNodes]) {
      this.sanitizeMathElement(child);
    }
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
