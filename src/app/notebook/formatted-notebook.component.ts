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
  @ViewChild('notebookTarget') notebookRef: ElementRef;
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
          for (const sourceFile of sourceFiles) {
            if (this.isPrimaryDescriptor(sourceFile.path) && sourceFile.type === SourceFile.TypeEnum.DOCKSTOREJUPYTER) {
              try {
                const notebookElement = this.notebookRef.nativeElement;
                notebookElement.innerHTML = this.format(sourceFile.content);
                for (const element of notebookElement.getElementsByClassName('markdown')) {
                  this.markdownWrapperService.katex(element);
                }
                for (const element of notebookElement.querySelectorAll('.source code')) {
                  this.markdownWrapperService.highlight(element);
                }
              } catch (e) {
                this.displayError = true;
                console.log('Exception formatting notebook');
                console.log(e.message);
              }
              return;
            }
          }
          this.displayError = true;
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
    const divs = this.formatCells(json.cells);
    return ['<div class="notebook">', ...divs, '</div>'].join('\n');
  }

  formatByType(values: any, typeField: string, typeToFormatter: Map<string, (json: any) => string[]>): string[] {
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
    ['markdown', this.formatMarkdownCell],
    ['code', this.formatCodeCell],
  ]);

  formatCells(cells: any): string[] {
    return this.formatByType(cells, 'cell_type', this.cellTypeToFormatter);
  }

  formatMarkdownCell(cell: any): string[] {
    return [this.divMarkdown(this.compileMarkdown(this.join(cell.source), cell.attachments))];
  }

  formatCodeCell(cell: any): string[] {
    const divs = [];
    const showSource = !cell?.metadata?.source_hidden;
    if (showSource) {
      const divCount = this.divCount(this.escape(`[${cell.execution_count ?? ' '}]:`));
      const divSource = this.divSource(this.escape(this.join(cell.source)));
      divs.push(divCount, divSource);
    }
    const showOutputs = !cell?.metadata?.outputs_hidden;
    if (showOutputs) {
      const divsOutputs = this.formatOutputs(cell.outputs);
      divs.push(...divsOutputs);
    }
    return divs;
  }

  outputTypeToFormatter = new Map<string, (json: any) => string[]>([
    ['stream', this.formatStreamOutput],
    ['display_data', this.formatMimeBundleOutput],
    ['execute_result', this.formatMimeBundleOutput],
  ]);

  formatOutputs(outputs: any): string[] {
    return this.formatByType(outputs, 'output_type', this.outputTypeToFormatter);
  }

  formatStreamOutput(output: any): string[] {
    return [this.divOutput(this.escape(this.join(output.text)), 'stream')];
  }

  formatMimeBundleOutput(output: any): string[] {
    const mimeBundle = output.data ?? {};
    const metadataBundle = output.metadata ?? {};
    const html = this.createHtmlFromBundles(mimeBundle, metadataBundle, undefined, undefined);
    if (html != undefined) {
      return [this.divOutput(html, 'display_data')];
    } else {
      return [];
    }
  }

  divMarkdown(content: string): string {
    return `<div class="markdown">${this.sanitize(content)}</div>`;
  }

  divCount(content: string): string {
    return `<div class="count">${this.sanitize(content)}</div>`;
  }

  divSource(content: string): string {
    const languageClass = `language-${this.workflow.descriptorTypeSubclass.toLowerCase() ?? 'none'}`;
    return `<div class="source"><pre><code class="${languageClass}">${this.sanitize(content)}</code></pre></div>`;
  }

  divOutput(content: string, classes: string): string {
    return `<div class="output ${classes}"><pre>${this.sanitize(content)}</pre></div>`;
  }

  compileMarkdown(markdown: string, attachments: any): string {
    const renderer = this.createAttachedImageRenderer(attachments);
    const escapedDollars = markdown.replace(/\\+\$/g, '<span>$</span>');
    return this.markdownWrapperService.customCompileWithOptions(escapedDollars, { baseUrl: this.baseUrl, renderer: renderer });
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

  sanitize(html: string): string {
    return this.markdownWrapperService.customSanitize(html);
  }

  // the below escape() implementation is adapted from mustache.js
  // https://github.com/janl/mustache.js/blob/972fd2b27a036888acfcb60d6119317744fac7ee/mustache.js#L60
  charToEntity = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };

  escape(text: any): string {
    return String(text).replace(/[&<>"'`=\/]/g, (c) => {
      return this.charToEntity[c];
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
