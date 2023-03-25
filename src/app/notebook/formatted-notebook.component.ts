import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { FileService } from 'app/shared/file.service';
import { SourceFile, Workflow, WorkflowVersion } from 'app/shared/openapi';
import { finalize } from 'rxjs/operators';
import { SourceFileTabsService } from '../source-file-tabs/source-file-tabs.service';
import { WorkflowQuery } from '../shared/state/workflow.query';
import { Observable } from 'rxjs';
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
  @Input() baseUrl: string;
  @ViewChild('notebookTarget') target: ElementRef;
  loading = true;
  formatted = '';
  displayError = false;

  ngOnChanges() {
    this.retrieveAndFormatNotebook();
  }

  retrieveAndFormatNotebook() {
    this.loading = true;
    this.formatted = '';
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
              try {
                this.target.nativeElement.innerHTML = this.format(sourceFile.content);
                for (const element of this.target.nativeElement.getElementsByClassName('markdown')) {
                  this.markdownWrapperService.katex(element);
                }
                /*
                TODO syntax highlighting
                for (const element of this.target.nativeElement.getElementsByClassName('code')) {
                  this.markdownWrapperService.katex(element);
                }
                */
              } catch (e) {
                this.displayError = true;
                console.log('Exception formatting notebook');
                console.log(e.message);
                throw e;
              }
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
    return ['<div class="notebook">', ...chunks, '</div>'].join('\n');
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
    return [
      this.div(
        this.renderMarkdown(
          this.join(cell['source']) + ' $a=b^2b^2b^2b^2b^2b^2b^2b^2b^2b^2b^2b^2b^2b^2b^2b^2b^2b^2b^2b^2b^2b^2b^2b^2b^2b^2b^2b^2b^2b^2$',
          cell['attachments']
        ),
        'markdown'
      ),
    ];
  }

  convertCodeCell(cell: any): string[] {
    return [
      this.escapeAndDiv(`[${cell['execution_count'] ?? ' '}]:`, 'count'),
      this.escapeAndDiv(this.join(cell['source']), 'code'),
      ...this.convertOutputs(cell['outputs']),
    ];
  }

  outputTypeToFormatter = new Map<string, (json: any) => string[]>([
    ['stream', this.convertStreamOutput],
    ['display_data', this.convertMimeBundleOutput],
    ['execute_result', this.convertMimeBundleOutput],
  ]);

  convertOutputs(outputs: any): string[] {
    return this.formatByType(outputs, 'output_type', this.outputTypeToFormatter);
  }

  convertStreamOutput(output: any): string[] {
    return [this.escapeAndDiv(this.join(output['text']), 'output stream')];
  }

  convertMimeBundleOutput(output: any): string[] {
    const mimeBundle = output['data'] ?? {};
    const metadataBundle = output['metadata'] ?? {};
    const html = this.createHtmlFromBundles(mimeBundle, metadataBundle, undefined, undefined);
    if (html != undefined) {
      return [this.div(html, 'output display_data')];
    } else {
      return [];
    }
  }

  div(content: string, classes: string) {
    return `<div class="${classes}">${this.sanitize(content)}</div>`;
  }

  escapeAndDiv(content: string, classes: string) {
    return this.div(this.escape(content), classes);
  }

  sanitize(html: string): string {
    return this.markdownWrapperService.customSanitize(html);
  }

  renderMarkdown(markdown: string, attachments: any): string {
    const renderer = this.createAttachedImageRenderer(attachments);
    return this.markdownWrapperService.customCompileWithOptions(markdown, { baseUrl: this.baseUrl, renderer: renderer });
  }

  createAttachedImageRenderer(attachments: any): Renderer {
    const renderer = new Renderer();
    const createHtmlFromBundles = this.createHtmlFromBundles;
    renderer.image = function (href, title, text) {
      if (href.startsWith('attachment:')) {
        const name = href.substring('attachment:'.length);
        const mimeBundle = attachments[name] ?? {};
        return createHtmlFromBundles(mimeBundle, {}, text, title);
      }
      return undefined;
    };
    return renderer;
  }

  supportedMimeTypes = ['image/png', 'image/webp', 'image/jpeg', 'image/gif', 'text/html', 'text/json', 'text/plain'];

  selectBestFromMimeBundle(mimeBundle: any): { mimeType: string; data: string } {
    for (const mimeType of this.supportedMimeTypes) {
      const data = mimeBundle[mimeType];
      if (data != undefined) {
        return { mimeType: mimeType, data: this.join(data) };
      }
    }
    return undefined;
  }

  createAttribute(name: string, value: string): string {
    if (value != undefined) {
      return ` ${name}="${this.escape(value)}"`;
    } else {
      return '';
    }
  }

  createHtmlFromBundles(mimeBundle: any, metadataBundle: any, alt: string, title: string): string {
    const mimeObject = this.selectBestFromMimeBundle(mimeBundle);
    const mimeType = mimeObject?.mimeType;
    const data = mimeObject?.data;
    const metadata = metadataBundle[mimeType];
    if (mimeType?.startsWith('image/')) {
      return (
        '<img' +
        this.createAttribute('src', `data:${mimeType};base64,${data}`) +
        this.createAttribute('alt', alt) +
        this.createAttribute('title', title) +
        this.createAttribute('width', metadata?.width) +
        this.createAttribute('height', metadata?.height) +
        '>'
      );
    }
    if (mimeType?.startsWith('text/')) {
      return this.escape(data);
    }
    return undefined;
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
    if (value == undefined) {
      return '';
    }
    if (Array.isArray(value)) {
      return value.join('');
    }
    return String(value);
  }
}
