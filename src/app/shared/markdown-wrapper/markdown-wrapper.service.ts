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
    return this.markdownService.parse(data, parseOptions);
  }

  customSanitize(html): string {
    // Passes HTML to DOMPurify to be sanitized.
    return DOMPurify.sanitize(html, {
      FORBID_TAGS: this.forbidTags,
      FORBID_ATTR: this.forbidAttr,
    });
  }
}
