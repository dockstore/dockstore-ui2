import { Component, Input, OnChanges } from '@angular/core';
import { MarkdownWrapperService } from './markdown-wrapper.service';

@Component({
  selector: 'app-markdown-wrapper',
  templateUrl: './markdown-wrapper.component.html',
  styleUrls: ['./markdown-wrapper.component.scss'],
})
export class MarkdownWrapperComponent implements OnChanges {
  @Input() data: string;
  @Input() baseUrl?: string;
  cleanedData: string;

  constructor(private markdownWrapperService: MarkdownWrapperService) {}

  ngOnChanges(): void {
    this.cleanedData = this.markdownWrapperService.customSanitize(this.markdownWrapperService.customCompile(this.data, this.baseUrl));
  }
}
