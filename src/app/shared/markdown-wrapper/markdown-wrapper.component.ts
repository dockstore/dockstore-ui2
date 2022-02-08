import { Component, Input, OnChanges, OnInit } from '@angular/core';
import DOMPurify from 'dompurify';
import { MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'app-markdown-wrapper',
  templateUrl: './markdown-wrapper.component.html',
  styleUrls: ['./markdown-wrapper.component.scss'],
})

/**
 Wrapper for ngx-markdown. Allows custom sanitization of user-input markdown through DOMPurify, which is not accessible
 through the built-in sanitizer, DOMSanitize.
 DOMSanitize's safe-lists can be seen https://github.com/angular/angular/blob/master/packages/core/src/sanitization/html_sanitizer.ts

 Also specifies the base url used for relative links.
 */
export class MarkdownWrapperComponent implements OnInit, OnChanges {
  @Input() data: string;
  @Input() baseUrl?: string;
  cleanedData: string;

  // tags and attributes that will be sanitized by DOMPurify.
  // specifically sanitize the 'class' attribute to prevent possible phishing scams by allowing user input to access
  // Dockstore's style classes.
  forbidTags: string[] = [];
  forbidAttr: string[] = ['class'];

  constructor(private markdownService: MarkdownService) {}

  ngOnChanges(): void {
    this.cleanedData = this.customSanitize(this.customCompile(this.data, this.baseUrl));
  }

  ngOnInit(): void {
    // Sets config for DOMPurify until otherwise specified.
    DOMPurify.setConfig({
      FORBID_TAGS: this.forbidTags,
      FORBID_ATTR: this.forbidAttr,
    });
  }

  /**
   * Compiles markdown into HTML with custom options.
   * @param data
   * @param baseUrl A base url used as a prefix for relative links
   * @returns
   */
  customCompile(data, baseUrl): string {
    return this.markdownService.compile(data, undefined, undefined, {
      baseUrl: baseUrl,
    });
  }

  customSanitize(data): string {
    // compile markdown into html then pass it to DOMPurify to be sanitized.
    return DOMPurify.sanitize(data);
  }
}
