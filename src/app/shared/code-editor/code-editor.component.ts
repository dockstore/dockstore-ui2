import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';

import { ace } from './../grammars/custom-grammars.js';
import { EntryType } from '../openapi/model/entryType';

let ACE_EDITOR_INSTANCE = 0;

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
  standalone: true,
})
export class CodeEditorComponent implements AfterViewInit {
  editorContent: string;
  editor: any;
  mode = 'yaml';
  editorFilepath: string;
  aceId: string;
  readOnly = true;
  @Input() entryType: EntryType;
  @Input() set editing(value: boolean) {
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

  constructor(private httpClient: HttpClient) {
    // The purpose of the aceId is to deal with cases where multiple editors exist on a page
    this.aceId = 'aceEditor_' + ACE_EDITOR_INSTANCE++;
  }

  ngAfterViewInit() {
    const aceMode = 'ace/mode/' + this.mode;
    ace.config.set('workerPath', '../assets/ace');
    this.editor = ace.edit(this.aceId, {
      mode: aceMode,
      readOnly: this.readOnly,
      showLineNumbers: true,
      maxLines: 60,
      wrap: true,
      theme: 'ace/theme/idle_fingers',
      fontSize: '12pt',
    });

    // Set content if possible
    const setContent = (content: string, cursorPos = 0): void => {
      this.editorContent = content;

      this.editor.getSession().on('change', () => {
        this.contentChange.emit(this.editor.getValue());
      });

      if (this.editorContent) {
        this.editor.setValue(this.editorContent, cursorPos);
      }

      if (!this.readOnly) {
        this.editor.focus();
      }
    };

    let sampleCodeUrl = '';

    // Load sample code by default when editing empty CWL/WDL/Nextflow files
    if (!this.editorContent) {
      if (this.mode === 'cwl') {
        if (this.entryType === EntryType.TOOL) {
          sampleCodeUrl = '../assets/text/sample-tool.cwl';
        } else if (this.entryType === EntryType.WORKFLOW) {
          sampleCodeUrl = '../assets/text/sample-workflow.cwl';
        }
      } else if (this.mode === 'wdl') {
        sampleCodeUrl = '../assets/text/sample.wdl';
      } else if (this.mode === 'nfl') {
        sampleCodeUrl = '../assets/text/sample.nf';
      } else if (this.editorFilepath === '/nextflow.config') {
        sampleCodeUrl = '../assets/text/nextflow.config';
      } else if (this.mode === 'yaml') {
        if (this.entryType === EntryType.WORKFLOW) {
          sampleCodeUrl = '../assets/text/sample-workflow-dockstore.yml';
        } else if (this.entryType === EntryType.APPTOOL) {
          sampleCodeUrl = '../assets/text/sample-tool-dockstore.yml';
        } else if (this.entryType === EntryType.NOTEBOOK) {
          sampleCodeUrl = '../assets/text/sample-notebook-dockstore.yml';
        } else if (this.entryType === EntryType.SERVICE) {
          sampleCodeUrl = '../assets/text/sample-service-dockstore.yml';
        }
      }
    }
    if (sampleCodeUrl) {
      const httpOptions: Object = { responseType: 'text' };
      this.httpClient.get(sampleCodeUrl, httpOptions).subscribe((content: string) => setContent(content, this.readOnly ? -1 : 0));
    } else {
      setContent(this.editorContent, -1);
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
      } else if (filepath.endsWith('.json') || filepath.endsWith('.ga')) {
        this.mode = 'json';
      } else if (filepath.endsWith('.yml') || filepath.endsWith('.yaml')) {
        this.mode = 'yaml';
      } else if (filepath.endsWith('.groovy') || filepath.endsWith('.config')) {
        this.mode = 'groovy';
      } else if (filepath.endsWith('.nf')) {
        this.mode = 'nfl';
      } else if (filepath.endsWith('.r')) {
        this.mode = 'r';
      } else if (filepath.endsWith('.py') || filepath.endsWith('.smk') || filepath.endsWith('Snakefile')) {
        this.mode = 'python';
      } else if (filepath.endsWith('.html')) {
        this.mode = 'html';
      } else if (filepath.endsWith('.js')) {
        this.mode = 'javascript';
      } else if (filepath.endsWith('.xml')) {
        this.mode = 'xml';
      } else if (filepath.endsWith('.pl')) {
        this.mode = 'perl';
      } else if (filepath.endsWith('.md')) {
        this.mode = 'markdown';
      } else if (filepath.endsWith('.sh')) {
        this.mode = 'sh';
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
