import { Component, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ace } from './../grammars/custom-grammars.js';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements AfterViewInit {
  _content: string;
  editor: any;
  mode = 'yaml';
  @Input() set filepath(filepath: string) {
    if (filepath !== undefined) {
      this.setMode(filepath);
    }
  }

  @Input() set content(content: string) {
    this._content = content;
    if (this.editor !== undefined && content !== undefined) {
      this.editor.setValue(this._content, -1);
    }
  }

  @ViewChild('aceEditor') aceEditor: ElementRef;

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    const aceMode = 'ace/mode/' + this.mode;
    this.editor = ace.edit('aceEditor',
      {
        mode: aceMode,
        readOnly: true,
        showLineNumbers: true,
        maxLines: 60,
        theme: 'ace/theme/dracula',
        fontSize: '14pt'
      }
    );

    // Set content if possible
    if (this._content !== null && this._content !== undefined) {
      this.editor.setValue(this._content, -1);
    }
  }

  setMode(filepath: string): void {
    if (filepath.endsWith('cwl')) {
      this.mode = 'cwl';
    } else if (filepath.endsWith('wdl')) {
      this.mode = 'wdl';
    } else {
      this.mode = 'yaml';
    }
    this.editor.session.setMode('ace/mode/' + this.mode);
  }

}
