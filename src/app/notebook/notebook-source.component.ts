import { Component, Input, OnChanges } from '@angular/core';
import { MarkdownWrapperService } from '../shared/markdown-wrapper/markdown-wrapper.service';
import { join, escape } from './helpers';

@Component({
  selector: 'app-notebook-source',
  templateUrl: './notebook-source.component.html',
})
export class NotebookSourceComponent implements OnChanges {
  @Input() cell: any;
  @Input() language: string;
  html: string = '';

  constructor(private markdownWrapperService: MarkdownWrapperService) {}

  ngOnChanges(): void {
    this.html = this.highlight(join(this.cell?.source));
  }

  highlight(code: string): string {
    // TODO move this into here
    return this.markdownWrapperService.highlight(code, this.language);
  }
}
