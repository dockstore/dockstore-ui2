import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnChanges, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MarkdownWrapperService } from '../shared/markdown-wrapper/markdown-wrapper.service';
import { join, replaceAll, selectBestFromMimeBundle } from './notebook-helpers';

@Component({
  selector: 'app-notebook-markdown',
  templateUrl: './notebook-markdown.component.html',
})
export class NotebookMarkdownComponent implements OnChanges {
  @Input() cell: any;
  @Input() baseUrl: string;
  html: string | SafeHtml = '';
  private domParser = new DOMParser();

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

    // Mark as pre-sanitized and assign to html field.
    this.html = this.sanitizer.bypassSecurityTrustHtml(mathjaxedSanitizedHtml);
  }

  compileMarkdown(markdown: string, attachments: any): string {
    // Adjustment the markdown to support attached notebook images and embedded TeX math expressions.
    let adjusted = markdown;
    adjusted = this.convertBackslashedDollars(adjusted);
    adjusted = this.inlineAttachedImages(adjusted, attachments);
    adjusted = this.preprocessLatexMath(adjusted);
    // Convert the adjusted markdown to HTML using our wrapper.
    return this.markdownWrapperService.customCompile(adjusted, this.baseUrl);
  }

  formatMath(html: string): string {
    // Format embedded math using MathJax: https://docs.mathjax.org/en/latest/web/typeset.html
    // Find the global MathJax object.
    const mathjax = (<any>this.document?.defaultView)?.MathJax;
    if (mathjax == undefined) {
      console.log('mathjax not found');
      return html;
    }

    // Convert the input HTML to a DOM representation.
    // DOMParser creates nodes that are detached from the browser context,
    // which should prevent any embedded code or handlers from firing.
    // For example, an `img` tag with an `onerror` handler.
    const doc = this.domParser.parseFromString(html, 'text/html');

    // Apply mathjax to the DOM representation.
    mathjax.startup.output.clearCache();
    mathjax.typeset([doc.body]);

    // Get a list of "math items", which are things that MathJax says it has changed.
    const mathItems = mathjax.startup.document.getMathItemsWithin(doc.body);

    // If something changed, sanitize each element that MathJax says it generated,
    // concatenate the MathJax-generated CSS with the modified+sanitized HTML, and return.
    // Otherwise, return the original HTML.
    if (mathItems.length > 0) {
      for (const item of mathItems) {
        this.sanitizeMathElement(item.typesetRoot);
      }
      const styleHtml = mathjax.chtmlStylesheet().outerHTML;
      const formattedHtml = doc.body.innerHTML;
      return styleHtml + formattedHtml;
    } else {
      return html;
    }
  }

  sanitizeMathElement(node: Node) {
    const type = node.nodeType;
    const name = node.nodeName;
    const isText = type === Node.TEXT_NODE;
    const isMjx = type === Node.ELEMENT_NODE && name.toLowerCase().startsWith('mjx-');
    // Remove any node that's not text or an element generated by MathJax (which would have
    // a name that begins with 'mjx-').
    if (!(isText || isMjx)) {
      node.parentElement.removeChild(node);
      return;
    }
    // Recursively sanitize each child node.
    // childNodes is "live" so we duplicate it beforehand to avoid problems if we delete a child.
    for (const child of this.dup(node.childNodes)) {
      this.sanitizeMathElement(child);
    }
  }

  dup(nodes: NodeListOf<Node>): Node[] {
    // The clumsy syntax below is necessary because in ES5, NodeListOf is not iterable.
    // In ES6, we could write this as a for-of loop, and even better, replace the above
    // dup() invocation with [...iterable].
    const list: Node[] = [];
    for (let i = 0; i < nodes.length; i++) {
      list.push(nodes[i]);
    }
    return list;
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
   * escape the double backslashes so that the markdown conversion doesn't mangle them.
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
