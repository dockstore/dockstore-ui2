import { Component, Inject, Input, OnChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { escape, join } from './notebook-helpers';
import { Cell } from './notebook-types';

@Component({
  selector: 'app-notebook-source',
  templateUrl: './notebook-source.component.html',
})
export class NotebookSourceComponent implements OnChanges {
  @Input() cell: Cell;
  @Input() language: string;
  html: string;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnChanges(): void {
    this.html = this.highlight(join(this.cell?.source));
  }

  highlight(code: string): string {
    const language = (this.language ?? 'python').toLowerCase();
    const Prism = (<any>this.document?.defaultView)?.Prism;
    const module = Prism?.languages[language];
    if (module == undefined) {
      return escape(code);
    }
    return Prism.highlight(code, module, language);
  }
}
