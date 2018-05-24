import { Component, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ace } from './../grammars/custom-grammars.js';

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
  @Input() set filepath(filepath: string) {
    if (filepath !== undefined) {
      this.setMode(filepath);
      this.editorFilepath = filepath;
    }
  }

  @Input() set content(content: string) {
    this.editorContent = content;
    if (this.editor !== undefined && content) {
      this.editor.setValue(this.editorContent, -1);
    }
  }

  @ViewChild('aceEditor') aceEditor: ElementRef;

  constructor(private elementRef: ElementRef) {
    // The purpose of the aceId is to deal with cases where multiple editors exist on a page
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
      } else if (filepath.endsWith('config')) {
        this.mode = 'groovy';
      } else if (filepath.endsWith('nf')) {
        this.mode = 'nfl';
      } else {
        this.mode = 'text';
      }
      if (this.editor !== undefined) {
        this.editor.session.setMode('ace/mode/' + this.mode);
      }
    }
  }

}
