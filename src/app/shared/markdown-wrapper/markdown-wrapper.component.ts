import { Component, Input, OnInit } from '@angular/core';
import DOMPurify from 'dompurify';

@Component({
  selector: 'markdown-wrapper',
  templateUrl: './markdown-wrapper.component.html',
  styleUrls: ['./markdown-wrapper.component.scss'],
})

// Wrapper for user-input markdown to provide custom sanitization not accessible through the built-in sanitizer, DOMSanitize.
// DOMSanitize's safe-lists can be seen https://github.com/angular/angular/blob/master/packages/core/src/sanitization/html_sanitizer.ts
export class MarkdownWrapperComponent implements OnInit {
  @Input() data: string;
  forbid_tags: string[];
  forbid_attr: string[];

  ngOnInit() {
    // list of tags and attributes that will be sanitized by DOMPurify.
    this.forbid_tags = [];
    this.forbid_attr = ['class'];

    // Sets config for DOMPurify until otherwise specified.
    DOMPurify.setConfig({
      FORBID_TAGS: this.forbid_tags,
      FORBID_ATTR: this.forbid_attr,
    });
  }

  customSanitize(content: string) {
    // Sanitize using DOMPurify, as it provides us with customization. If the content passed contains Markdown, that will
    // not be sanitized by DOMPurify, and be passed on to DOMSanitizer. ngx-markdown sanitizes input with DOMSanitizer.
    return DOMPurify.sanitize(content);
  }
}
