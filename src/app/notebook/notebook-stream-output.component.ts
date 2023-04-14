import { Component, Input, OnChanges } from '@angular/core';
import { join } from './helpers';

@Component({
  selector: 'app-notebook-stream-output',
  templateUrl: './notebook-stream-output.component.html',
  styleUrls: ['./notebook-display-contents.scss'],
})
export class NotebookStreamOutputComponent implements OnChanges {
  @Input() output: any;
  text: string;

  constructor() {}

  ngOnChanges(): void {
    this.text = join(this.output.text);
  }
}
