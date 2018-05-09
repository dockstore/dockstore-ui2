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
  _filepath: string;
  aceId: string;
  @Input() set filepath(filepath: string) {
    if (filepath !== undefined) {
      this.setMode(filepath);
      this._filepath = filepath;
    }
  }

  @Input() set content(content: string) {
    this._content = content;
    if (this.editor !== undefined && content) {
      this.editor.setValue(this._content, -1);
    }
  }

  @ViewChild('aceEditor') aceEditor: ElementRef;

  constructor(private elementRef: ElementRef) {
    this.aceId = Math.floor(Math.random() * 100000).toString();
  }

  ngAfterViewInit() {
    const aceMode = 'ace/mode/' + this.mode;
    this.editor = ace.edit('aceEditor_' + this.aceId,
      {
        mode: aceMode,
        readOnly: true,
        showLineNumbers: true,
        maxLines: 60,
        theme: 'ace/theme/idle_fingers',
        fontSize: '14pt'
      }
    );

    // Set content if possible
    if (this._content) {
      this.editor.setValue(this._content, -1);
    }
  }

  /**
   * Changes the mode of the editor based on the filepath
   * @param filepath Filepath of file
   */
  setMode(filepath: string): void {
    if (filepath !== undefined && filepath !== null) {
      if (filepath.endsWith('cwl')) {
        this.mode = 'cwl';
      } else if (filepath.endsWith('wdl')) {
        this.mode = 'wdl';
      } else if (filepath.includes('Dockerfile')) {
        this.mode = 'dockerfile';
      } else if (filepath.endsWith('json')) {
        this.mode = 'json';
      } else if (filepath.endsWith('yml') || filepath.endsWith('yaml')) {
        this.mode = 'yaml';
      } else {
        this.mode = 'text';
      }
      if (this.editor !== undefined) {
        this.editor.session.setMode('ace/mode/' + this.mode);
      }
    }
  }

}
