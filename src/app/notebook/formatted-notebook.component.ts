import { Component, Input, OnChanges } from '@angular/core';
import { FileService } from 'app/shared/file.service';
import { SourceFile, Workflow, WorkflowVersion } from 'app/shared/openapi';
import { finalize } from 'rxjs/operators';
import { SourceFileTabsService } from '../source-file-tabs/source-file-tabs.service';
import { WorkflowQuery } from '../shared/state/workflow.query';
import { Observable } from 'rxjs';
import { NotebookFormatter } from './formatter';
import { MarkdownWrapperService } from '../shared/markdown-wrapper/markdown-wrapper.service';
import { Renderer } from 'marked';

@Component({
  selector: 'app-formatted-notebook',
  templateUrl: './formatted-notebook.component.html',
  styleUrls: ['./formatted-notebook.component.scss'],
})
export class FormattedNotebookComponent implements OnChanges {
  constructor(
    private fileService: FileService,
    private sourceFileTabsService: SourceFileTabsService,
    private markdownWrapperService: MarkdownWrapperService
  ) {}
  @Input() workflow: Workflow;
  @Input() version: WorkflowVersion;
  loading = true;
  formatted = '';
  displayError = false;

  ngOnChanges() {
    this.retrieveAndFormatNotebook();
  }

  retrieveAndFormatNotebook() {
    this.loading = true;
    this.displayError = false;
    this.sourceFileTabsService
      .getSourceFiles(this.workflow.id, this.version.id)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (sourceFiles: SourceFile[]) => {
          sourceFiles.forEach((sourceFile) => {
            if (this.isPrimaryDescriptor(sourceFile.path)) {
              this.formatted = this.format(sourceFile.content);
            }
          });
        },
        () => {
          this.displayError = true;
        }
      );
  }

  isPrimaryDescriptor(path: string): boolean {
    return path === this.version.workflow_path;
  }

  format(notebook: string): string {
    const json = JSON.parse(notebook);
    const chunks = this.convertCells(json['cells']);
    return chunks.join('\n');
  }

  formatByType(values: any, typeField: string, typeToFormatter: Map<string, (json: any) => string[]>) {
    const formatted: string[] = [];
    (values.forEach ? values : [values]).forEach((value) => {
      const formatter = typeToFormatter.get(value[typeField]);
      if (formatter != undefined) {
        formatted.push(...formatter.call(this, value));
      }
    });
    return formatted;
  }

  cellTypeToFormatter = new Map<string, (json: any) => string[]>([
    ['markdown', this.convertMarkdownCell],
    ['code', this.convertCodeCell],
  ]);

  convertCells(cells: any): string[] {
    return this.formatByType(cells, 'cell_type', this.cellTypeToFormatter);
  }

  convertMarkdownCell(cell: any): string[] {
    return [this.div(this.renderMarkdown(this.join(cell['source']), cell['attachments']), 'markdown')];
  }

  convertCodeCell(cell: any): string[] {
    return [this.escapeAndDiv(this.join(cell['source']), 'code'), ...this.convertOutputs(cell['outputs'])];
  }

  outputTypeToFormatter = new Map<string, (json: any) => string[]>([
    ['stream', this.convertStreamOutput],
    ['display_data', this.convertDisplayDataOutput],
  ]);

  convertOutputs(outputs: any): string[] {
    return this.formatByType(outputs, 'output_type', this.outputTypeToFormatter);
  }

  convertStreamOutput(output: any): string[] {
    return [this.escapeAndDiv(this.join(output['text']), 'output stream')];
  }

  convertDisplayDataOutput(output: any): string[] {
    return [this.escapeAndDiv('A display_data output goes here.', 'output display_data')];
  }

  div(content: string, classes: string) {
    return '<div class="' + classes + '">' + this.sanitize(content) + '</div>';
  }

  escapeAndDiv(content: string, classes: string) {
    return this.div(this.escape(content), classes);
  }

  renderMarkdown(markdown: string, attachments: any): string {
    const renderer = new Renderer();
    const escape = this.escape;
    const dataFromMimeBundle = this.dataFromMimeBundle;
    renderer.image = function (href, title, text) {
      if (href.startsWith('attachment:')) {
        const name = href.substring('attachment:'.length);
        const mimeBundle = attachments[name] ?? {};
        const data = dataFromMimeBundle(mimeBundle);
        if (data != undefined) {
          return '<img src="data:mime-type;base64,<base64data>">';
        }
      }
      return undefined;
    };
    return this.markdownWrapperService.customCompileWithOptions(markdown, { baseUrl: '', renderer: renderer });
  }

  sanitize(html: string): string {
    return this.markdownWrapperService.customSanitize(html);
  }

  dataFromMimeBundle(mimeBundle: any) {
    return '349034903490'; // TODO fix
  }

  // TODO make better https://stackoverflow.com/questions/1787322/what-is-the-htmlspecialchars-equivalent-in-javascript
  escape(text: string): string {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };

    return text.replace(/[&<>"']/g, function (m) {
      return map[m];
    });
  }

  join(value: any): string {
    if (value == null || value == undefined) {
      return '';
    }
    if (value.join) {
      return value.join('\n');
    }
    if (value.toString) {
      return value.toString();
    }
    return '' + value;
  }
}
