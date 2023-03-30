import { Component, ElementRef, Inject, Input, OnChanges, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SourceFile, Workflow, WorkflowVersion } from 'app/shared/openapi';
import { SourceFileTabsService } from '../source-file-tabs/source-file-tabs.service';
import { WorkflowQuery } from '../shared/state/workflow.query';
import { MarkdownWrapperService } from '../shared/markdown-wrapper/markdown-wrapper.service';
import { Renderer } from 'marked';
import DOMPurify from 'dompurify';

@Component({
  selector: 'app-formatted-notebook',
  templateUrl: './formatted-notebook.component.html',
  styleUrls: ['./formatted-notebook.component.scss'],
})
export class FormattedNotebookComponent implements OnChanges {
  constructor(
    private sourceFileTabsService: SourceFileTabsService,
    private markdownWrapperService: MarkdownWrapperService,
    @Inject(DOCUMENT) private document: Document
  ) {}
  @Input() workflow: Workflow;
  @Input() version: WorkflowVersion;
  @Input() baseUrl: string;
  @ViewChild('notebookTarget') notebookTarget: ElementRef;
  loading = true;
  displayError = false;

  ngOnChanges() {
    this.retrieveAndFormatNotebook();
  }

  retrieveAndFormatNotebook() {
    this.notebookTarget?.nativeElement.replaceChildren();
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
          for (const sourceFile of sourceFiles) {
            // Look for the primary descriptor with Jupyter file type.
            if (this.isPrimaryDescriptor(sourceFile.path) && sourceFile.type === SourceFile.TypeEnum.DOCKSTOREJUPYTER) {
              try {
                // Create an element containing the formatted notebook,
                // and make it the child of template's '#notebookTarget' placeholder.
                const notebookElement = this.createFormattedNotebookElement(sourceFile.content);
                this.notebookTarget.nativeElement.replaceChildren(notebookElement);
              } catch (e) {
                this.displayError = true;
                console.log('Exception formatting notebook');
                console.log(e.message);
                return;
              }
              this.displayError = false;
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

  createFormattedNotebookElement(notebookJson: string): any {
    // Create the notebook container div.
    const element: any = this.document.createElement('div');
    element.classList.add('notebook');
    // Set the body of the container div to the formatted notebook HTML.
    element.innerHTML = this.format(notebookJson);
    // Render the equations in each markdown cell.
    for (const markdownElement of element.getElementsByClassName('markdown')) {
      this.markdownWrapperService.katex(markdownElement);
    }
    // Highlight the code elements in the source of each code cell.
    for (const codeElement of element.querySelectorAll('.source code')) {
      this.markdownWrapperService.highlight(codeElement);
    }
    // Lightly sanitize the entirety of the generated HTML, conserving 'class' attribute values to
    // prevent mangling the output of the equation rendering and syntax highlighting steps,
    // which set the 'class' attribute on the elements they generate, so that they may be styled.
    // The sanitize() method delegates to the MarkdownWrapper sanitizer, which removes 'class' attrs.
    element.innerHTML = this.sanitizeLightly(element.innerHTML);
    return element;
  }

  format(notebook: string): string {
    const json = JSON.parse(notebook);
    const divs = this.formatCells(json.cells);
    return divs.join('\n');
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

  divMarkdown(html: string): string {
    return `<div class="markdown">${this.sanitize(html)}</div>`;
  }

  divCount(html: string): string {
    return `<div class="count">${this.sanitize(html)}</div>`;
  }

  divSource(html: string): string {
    const languageClass = `language-${this.workflow.descriptorTypeSubclass.toLowerCase() ?? 'none'}`;
    return `<div class="source"><pre><code class="${this.escape(languageClass)}">${this.sanitize(html)}</code></pre></div>`;
  }

  divOutput(html: string, classes: string): string {
    return `<div class="output ${this.escape(classes)}"><pre>${this.sanitize(html)}</pre></div>`;
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

  sanitizeLightly(html: string): string {
    return DOMPurify.sanitize(html, { FORBID_TAGS: [], FORBID_ATTR: [] });
  }

  // The below escape() implementation is adapted from mustache.js
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
