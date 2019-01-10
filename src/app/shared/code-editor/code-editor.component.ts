import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { ace } from './../grammars/custom-grammars.js';

let ACE_EDITOR_INSTANCE = 0;

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements AfterViewInit {
  editorContent: string;
  editor: any;
  mode = 'yaml';
  editorFilepath: string;
  aceId: string;
  readOnly = true;
  @Input() set editing(value: string) {
    if (value !== undefined) {
      this.toggleReadOnly(!value);
    }
  }
  @Input() set filepath(filepath: string) {
    if (filepath !== undefined) {
      this.setMode(filepath);
      this.editorFilepath = filepath;
    }
  }

  @Input() set content(content: string) {
    if (this.editorContent == null || this.readOnly) {
      this.editorContent = content;
      if (this.editor !== undefined) {
        if (this.editorContent != null) {
          this.editor.setValue(this.editorContent, -1);
        }
      }
    }
  }

  @Output() contentChange = new EventEmitter<any>();

  constructor() {
    // The purpose of the aceId is to deal with cases where multiple editors exist on a page
    this.aceId = 'aceEditor_' + ACE_EDITOR_INSTANCE++;
  }

  ngAfterViewInit() {
    const aceMode = 'ace/mode/' + this.mode;
    this.editor = ace.edit(this.aceId,
      {
        mode: aceMode,
        readOnly: this.readOnly,
        showLineNumbers: true,
        maxLines: 60,
        theme: 'ace/theme/idle_fingers',
        fontSize: '12pt'
      }
    );

    this.editor.getSession().on('change', () => {
      this.contentChange.emit(this.editor.getValue());
    });

    // Set content if possible
    if (this.editorContent) {
      this.editor.setValue(this.editorContent, -1);
    }
  }

  /**
   * Changes the mode of the editor based on the filepath, fallback is text mode
   * @param filepath Filepath of file
   */
  setMode(filepath: string): void {
    if (filepath !== undefined && filepath !== null) {
      if (filepath.endsWith('.cwl')) {
        this.mode = 'cwl';
      } else if (filepath.endsWith('.wdl')) {
        this.mode = 'wdl';
      } else if (filepath.includes('Dockerfile')) {
        this.mode = 'dockerfile';
      } else if (filepath.endsWith('.json')) {
        this.mode = 'json';
      } else if (filepath.endsWith('.yml') || filepath.endsWith('.yaml')) {
        this.mode = 'yaml';
      } else if (filepath.endsWith('.config')) {
        this.mode = 'groovy';
      } else if (filepath.endsWith('.nf')) {
        this.mode = 'nfl';
      } else if (filepath.endsWith('.r')) {
        this.mode = 'r';
      } else if (filepath.endsWith('.py')) {
        this.mode = 'python';
      } else if (filepath.endsWith('.html')) {
        this.mode = 'html';
      } else if (filepath.endsWith('.js')) {
        this.mode = 'javascript';
      } else if (filepath.endsWith('.xml')) {
        this.mode = 'xml';
      } else if (filepath.endsWith('.pl')) {
        this.mode = 'perl';
      } else {
        this.mode = 'text';
      }
      if (this.editor !== undefined) {
        this.editor.session.setMode('ace/mode/' + this.mode);
      }
    }
  }

  toggleReadOnly(readOnly: boolean): void {
    this.readOnly = readOnly;
    if (this.editor !== undefined) {
      this.editor.setReadOnly(readOnly);
    }
  }

}
