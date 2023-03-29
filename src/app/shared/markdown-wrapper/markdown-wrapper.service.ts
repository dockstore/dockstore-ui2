import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import DOMPurify from 'dompurify';
import { MarkdownService } from 'ngx-markdown';

/**
 Wrapper for ngx-markdown's MarkdownService. Allows custom sanitization of user-input markdown through DOMPurify, which is not accessible
 through the built-in sanitizer, DOMSanitize.
 DOMSanitize's safe-lists can be seen https://github.com/angular/angular/blob/master/packages/core/src/sanitization/html_sanitizer.ts

 Also specifies the base url used for relative links.
 */
@Injectable({
  providedIn: 'root',
})
export class MarkdownWrapperService {
  // tags and attributes that will be sanitized by DOMPurify.
  // specifically sanitize the 'class' attribute to prevent possible phishing scams by allowing user input to access
  // Dockstore's style classes.
  forbidTags: string[] = [];
  forbidAttr: string[] = ['class'];

  constructor(private markdownService: MarkdownService, @Inject(DOCUMENT) private document: Document) {
    DOMPurify.setConfig({
      FORBID_TAGS: this.forbidTags,
      FORBID_ATTR: this.forbidAttr,
    });
  }

  /**
   * Compiles markdown into HTML with custom options.
   * @param data
   * @param baseUrl A base url used as a prefix for relative links
   * @returns {string} HTML string
   */
  customCompile(data, baseUrl): string {
    return this.customCompileWithOptions(data, { baseUrl: baseUrl });
  }

  customCompileWithOptions(data, options): string {
    return this.markdownService.parse(data, { markedOptions: options });
  }

  customSanitize(html): string {
    // Passes HTML to DOMPurify to be sanitized.
    return DOMPurify.sanitize(html);
  }

  katex(element) {
    (<any>this.document?.defaultView)?.renderMathInElement(element, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ],
    });
  }

  highlight(element) {
    (<any>this.document?.defaultView)?.Prism?.highlightElement(element);
  }
}
