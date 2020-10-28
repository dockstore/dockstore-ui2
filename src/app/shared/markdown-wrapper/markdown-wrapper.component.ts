import { Component, Input, OnChanges, OnInit } from '@angular/core';
import DOMPurify from 'dompurify';
import { MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'markdown-wrapper',
  templateUrl: './markdown-wrapper.component.html',
  styleUrls: ['./markdown-wrapper.component.scss'],
})

/**
 Wrapper for user-input markdown to provide custom sanitization not accessible through the built-in sanitizer, DOMSanitize.
 DOMSanitize's safe-lists can be seen https://github.com/angular/angular/blob/master/packages/core/src/sanitization/html_sanitizer.ts
 */
export class MarkdownWrapperComponent implements OnInit, OnChanges {
  @Input() data: string;
  cleanedData: string;
  forbidTags: string[];
  forbidAttr: string[];

  constructor(private markdownService: MarkdownService) {}

  ngOnChanges(): void {
    this.cleanedData = this.customSanitize(this.data);
  }

  ngOnInit(): void {
    // tags and attributes that will be sanitized by DOMPurify.
    // specifically sanitize the 'class' attribute to prevent possible phishing scams by allowing user input to access
    // Dockstore's style classes.
    this.forbidTags = [];
    this.forbidAttr = ['class'];

    // Sets config for DOMPurify until otherwise specified.
    DOMPurify.setConfig({
      FORBID_TAGS: this.forbidTags,
      FORBID_ATTR: this.forbidAttr,
    });
  }

  customSanitize(data): string {
    // compile markdown into html then pass it to DOMPurify to be sanitized.
    return DOMPurify.sanitize(this.markdownService.compile(data));
  }
}
