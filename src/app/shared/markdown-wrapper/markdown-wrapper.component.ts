import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import DOMPurify from 'dompurify';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'markdown-wrapper',
  templateUrl: './markdown-wrapper.component.html',
  styleUrls: ['./markdown-wrapper.component.scss'],
})

// Wrapper for user-input markdown to provide custom sanitization not accessible through the built-in sanitizer, DOMSanitize.
// DOMSanitize's safe-lists can be seen https://github.com/angular/angular/blob/master/packages/core/src/sanitization/html_sanitizer.ts
export class MarkdownWrapperComponent implements OnInit, AfterViewInit {
  @ViewChild(MarkdownComponent) mkdRef;
  @Input() data: string;
  forbid_tags: string[];
  forbid_attr: string[];

  ngOnInit() {
    // tags and attributes that will be sanitized by DOMPurify.
    this.forbid_tags = [];
    this.forbid_attr = ['class'];

    // Sets config for DOMPurify until otherwise specified.
    DOMPurify.setConfig({
      FORBID_TAGS: this.forbid_tags,
      FORBID_ATTR: this.forbid_attr,
    });
  }

  ngAfterViewInit() {
    // after the data has been passed through ngx-markdown, we can further sanitize the resulting HTML to our own
    // specifications
    this.mkdRef.element.nativeElement.innerHTML = DOMPurify.sanitize(this.mkdRef.element.nativeElement.innerHTML);
  }
}
