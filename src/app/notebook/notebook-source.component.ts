import { Component, Input, OnChanges } from '@angular/core';
import { escape, join } from './notebook-helpers';
import { Cell } from './notebook-types';
import './prism';

@Component({
  selector: 'app-notebook-source',
  templateUrl: './notebook-source.component.html',
})
export class NotebookSourceComponent implements OnChanges {
  @Input() cell: Cell;
  @Input() language: string;
  html: string;

  constructor() {}

  ngOnChanges(): void {
    this.html = this.highlight(join(this.cell?.source));
  }

  highlight(code: string): string {
    const language = (this.language ?? 'python').toLowerCase();
    const Prism = (<any>window)?.Prism;
    const module = Prism?.languages[language];
    if (module === undefined || module === null) {
      return escape(code);
    }
    return Prism.highlight(code, module, language);
  }
}
