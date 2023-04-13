import { Component, Input, OnChanges } from '@angular/core';
import { MarkdownWrapperService } from '../shared/markdown-wrapper/markdown-wrapper.service';

@Component({
  selector: 'app-notebook-source',
  templateUrl: './notebook-source.component.html',
})
export class NotebookSourceComponent implements OnChanges {
  @Input() cell: any;
  @Input() language: string;
  html: string;

  constructor(private markdownWrapperService: MarkdownWrapperService) {}

  ngOnChanges(): void {
    this.html = this.highlight(this.cell?.source, this.language ?? 'python');
  }

  highlight(code: string, language: string): string {
    return this.markdownWrapperService.highlight(code, language);
  }
}
