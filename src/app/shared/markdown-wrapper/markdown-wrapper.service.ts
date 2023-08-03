import { Injectable } from '@angular/core';
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
  // list of potentially "dangerous" tags: https://stackoverflow.com/questions/17369559/html-dangerous-tags-to-avoid-while-developing-a-chat-application
  // specifically sanitize the 'class' attribute to prevent possible phishing scams by allowing user input to access.
  // Dockstore's style classes.
  forbidTags: string[] = [
    'body',
    'title',
    'head',
    'button',
    'video',
    'object',
    'applet',
    'script',
    'style',
    'link',
    'iframe',
    'frameset',
    'comment',
    'embed',
    'link',
    'listing',
    'meta',
    'noscript',
    'plaintext',
    'xmp',
    'form',
  ];
  forbidAttr: string[] = [
    'class',
    'style',
    'id',
    'onabort',
    'onblur',
    'onchange',
    'onclick',
    'ondblclick',
    'ondrag',
    'ondragend',
    'ondragenter',
    'ondragleave',
    'ondragover',
    'ondragstart',
    'ondrop',
    'onerror',
    'onfocus',
    'oninput',
    'onkeydown',
    'onkeypress',
    'onkeyup',
    'onload',
    'onmousedown',
    'onmousemove',
    'onmouseout',
    'onmouseup',
    'onpageshow',
    'onpropertychange',
    'onreset',
    'onresize',
    'onscroll',
    'onselect',
    'onsubmit',
    'onunload',
  ];

  constructor(private markdownService: MarkdownService) {}

  /**
   * Compiles markdown into HTML with custom options.
   * @param data
   * @param baseUrl A base url used as a prefix for relative links
   * @returns {string} HTML string
   */
  customCompile(data, baseUrl): string {
    const parseOptions = { markedOptions: { baseUrl: baseUrl } };
    const markdownData = this.removeTabsFromTableHeaders(data);
    return this.markdownService.parse(markdownData, parseOptions);
  }

  customSanitize(html): string {
    // Passes HTML to DOMPurify to be sanitized.
    return DOMPurify.sanitize(html, {
      FORBID_TAGS: this.forbidTags,
      FORBID_ATTR: this.forbidAttr,
    });
  }

  /**
   * Removes tab characters from markdown table headers or they won't display properly
   * Markdown uses pipes with three or more hyphens in between to create columns and headers, and colons to align text
   * E.g., |---|---|---| or | :--- | ---: | where there can be spaces between pipes and hyphens but not tabs
   * @param {string} data A string containing the markdown data
   * @returns {string}
   */
  removeTabsFromTableHeaders(data: string): string {
    return data
      .replace(/(?<=\|[\t ]*)\t(?=[\t ]*:?-{3,}:?[\t ]*\|)/g, '    ') // remove tabs after the starting pipe before the hyphens
      .replace(/(?<=\|[\t ]*:?-{3,}:?[\t ]*)\t(?=[\t ]*\|)/g, '    '); // remove tabs after the hyphens before the ending pipe
  }
}
