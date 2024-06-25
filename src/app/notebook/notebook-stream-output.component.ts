import { Component, Input, OnChanges } from '@angular/core';
import { join } from './notebook-helpers';
import { Output } from './notebook-types';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-notebook-stream-output',
  templateUrl: './notebook-stream-output.component.html',
  standalone: true,
  imports: [NgIf],
})
export class NotebookStreamOutputComponent implements OnChanges {
  @Input() output: Output;
  text: string;
  name: string;

  constructor() {}

  ngOnChanges(): void {
    this.text = join(this.output?.text);
    const name = join(this.output?.name);
    if (name === 'stderr' || name === 'stdout') {
      this.name = name;
    } else {
      this.name = undefined;
    }
  }
}
