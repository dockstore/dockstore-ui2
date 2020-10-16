import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'markdown-wrapper',
  templateUrl: './markdown-wrapper.component.html',
  styleUrls: ['./markdown-wrapper.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})

// Wrapper for user-input markdown to prevent access to global CSS classes.
export class MarkdownWrapperComponent {
  @Input() data: string;
}
