import { Component, Input, OnInit, ViewChild } from '@angular/core';
import DOMPurify from 'dompurify';
import { MarkdownComponent, MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'markdown-wrapper',
  templateUrl: './markdown-wrapper.component.html',
  styleUrls: ['./markdown-wrapper.component.scss'],
})

/**
 Wrapper for user-input markdown to provide custom sanitization not accessible through the built-in sanitizer, DOMSanitize.
 DOMSanitize's safe-lists can be seen https://github.com/angular/angular/blob/master/packages/core/src/sanitization/html_sanitizer.ts
 */
export class MarkdownWrapperComponent implements OnInit {
  @ViewChild(MarkdownComponent) mkdRef;
  @Input() data: string;
  forbid_tags: string[];
  forbid_attr: string[];

  constructor(private markdownService: MarkdownService) {}

  ngOnInit() {
    // tags and attributes that will be sanitized by DOMPurify.
    // specifically sanitize the 'class' attribute to prevent possible phishing scams by allowing user input to access
    // Dockstore's style classes.
    this.forbid_tags = [];
    this.forbid_attr = ['class'];

    // Sets config for DOMPurify until otherwise specified.
    DOMPurify.setConfig({
      FORBID_TAGS: this.forbid_tags,
      FORBID_ATTR: this.forbid_attr,
    });
  }

  customSanitize(data) {
    // compile markdown into html then pass it to DOMPurify to be sanitized.
    return DOMPurify.sanitize(this.markdownService.compile(data));
  }
}
