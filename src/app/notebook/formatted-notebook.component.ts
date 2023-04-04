import { Component, ElementRef, Inject, Input, OnChanges, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SourceFile, Workflow, WorkflowVersion, WorkflowsService } from 'app/shared/openapi';
import { MarkdownWrapperService } from '../shared/markdown-wrapper/markdown-wrapper.service';
import DOMPurify from 'dompurify';

@Component({
  selector: 'app-formatted-notebook',
  templateUrl: './formatted-notebook.component.html',
})
export class FormattedNotebookComponent implements OnChanges {
  constructor(
    private workflowsService: WorkflowsService,
    private markdownWrapperService: MarkdownWrapperService,
    @Inject(DOCUMENT) private document: Document
  ) {}
  @Input() workflow: Workflow;
  @Input() version: WorkflowVersion;
  @Input() baseUrl: string;
  @ViewChild('notebookTarget') notebookTarget: ElementRef;
  loading = true;
  displayError = false;
  private currentSubscription: Subscription = null;

  ngOnChanges() {
    this.retrieveAndFormatNotebook();
  }

  retrieveAndFormatNotebook() {
    this.notebookTarget?.nativeElement.replaceChildren(); // Remove the current formatted notebook.
    this.loading = true;
    this.displayError = false;
    // The next line cancels any previous request that is still in progress,
    // because if we're here, the @Inputs have changed, and we're about to
    // launch a new request to retrieve the corresponding notebook file,
    // which we will display when it arrives.  The previous response is now
    // irrelevant, and could actually cause problems if it arrives out of
    // order.
    // Assuming that Angular calls a component's `ngOnChanges()` directly
    // after setting its @Input fields, a pleasant side effect of said
    // cancellation is that when we handle a response, we know that @Input
    // fields have the same values as when the corresponding request was
    // started, which simplifies the code.  For example, the methods
    // called by the handler to format the notebook can safely use the
    // value of the `workflow` field to determine the notebook language.
    this.currentSubscription?.unsubscribe();
    this.currentSubscription = this.workflowsService
      .getWorkflowVersionsSourcefiles(this.workflow.id, this.version.id, ['DOCKSTORE_JUPYTER'])
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (sourceFiles: SourceFile[]) => {
          for (const sourceFile of sourceFiles) {
            if (this.isPrimaryDescriptor(sourceFile.path)) {
              try {
                // Create an element containing the formatted notebook,
                // and make it the single child of the template's '#notebookTarget' placeholder.
                const notebookElement = this.createFormattedNotebookElement(sourceFile.content);
                this.notebookTarget.nativeElement.replaceChildren(notebookElement);
              } catch (e) {
                console.log('Exception formatting notebook');
                console.log(e.message);
                this.displayError = true;
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

  /**
   * Convert the specified notebook to a DOM element that represents it.
   */
  createFormattedNotebookElement(notebook: string): any {
    // Create the notebook container div.
    const element: any = this.document.createElement('div');
    element.classList.add('notebook');
    // Set the body of the container div to the formatted notebook HTML.
    element.innerHTML = this.format(notebook);
    // Render the equations in each markdown cell.
    for (const markdownElement of element.getElementsByClassName('markdown')) {
      this.markdownWrapperService.equations(markdownElement);
    }
    // Highlight the code elements in the "source" div of each code cell.
    for (const codeElement of element.querySelectorAll('.source code')) {
      this.markdownWrapperService.highlight(codeElement);
      codeElement.innerHTML = this.sanitizeLightly(codeElement.innerHTML);
    }
    return element;
  }

  /**
   * Convert the specified notebook to a HTML string that represents it.
   *
   * The Jupyter notebook format:
   * https://nbformat.readthedocs.io/en/latest/
   *
   * We examine and convert each notebook cell to HTML, one by one,
   * and return the concatenated result.  The functions with names
   * prefixed by `format` are helpers for the formatting process, and
   * generally take a portion of the notebook json as an argument, and
   * return a list of strings that represent the formatted notebook HTML.
   */
  format(notebook: string): string {
    const json = JSON.parse(notebook);
    const divs = this.formatCells(this.filterSpam(json.cells));
    return divs.join('\n');
  }

  /**
   * This function iterates over the input `values`, which represent portion(s) of the notebook
   * file such as cells or cell outputs, using the `typeName` property of each value to select
   * a formatter fn, which is used to convert the value to HTML, represented by a list of strings.
   * The resulting strings are concatenated in order and returned.
   *
   * `typeName` is the name of the "type" property, and `typeToFormatter` maps the type value to
   * an appropriate formatter function.  For example:
   *
   * `formatByType([{cell_type: 'typeA'}, {cell_type, 'typeB'}], 'cell_type', map)`
   *
   * would format the first value using the formatter in `map` corresponding to `typeA`,
   * then format the second value using the formatter in `map` corresponding to `typeB`, and
   * return the concatenated list of results from the formatters.
   */
  formatByType(values: any, typeName: string, typeToFormatter: Map<string, (json: any) => string[]>): string[] {
    const formatted: string[] = [];
    (values.forEach ? values : [values]).forEach((value) => {
      const formatter = typeToFormatter.get(value[typeName]);
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
    let adjusted = markdown;
    adjusted = this.convertBackslashedDollars(adjusted);
    adjusted = this.inlineAttachedImages(adjusted, attachments);
    adjusted = this.preprocessLatexMath(adjusted);
    return this.markdownWrapperService.customCompile(adjusted, this.baseUrl);
  }

  /**
   * Change any dollar sign preceded by a backslash to the dollar HTML entity.
   */
  convertBackslashedDollars(markdown: string): string {
    return markdown.replace(/\\\$/g, '&dollar;');
  }

  /**
   * Convert 'attachment:' image references to data urls.
   */
  inlineAttachedImages(markdown: string, attachments: any) {
    if (attachments == undefined) {
      return markdown;
    }
    return markdown
      .split('\n')
      .map((line) => {
        // If we're in a code block, don't change anything.
        if (line.startsWith('    ')) {
          return line;
        }
        return line.replace(/]\(attachment:([^) "]+)/g, (match, key) => {
          const mimeBundle = attachments[key] ?? {};
          const mimeObject = this.selectBestFromMimeBundle(mimeBundle);
          if (mimeObject) {
            return `](data:${mimeObject.mimeType};base64,${mimeObject.data}`;
          } else {
            return match;
          }
        });
      })
      .join('\n');
  }

  /**
   * For any text between a run of dollar signs that looks like TeX mathematics,
   * escape the double backslashes.
   */
  preprocessLatexMath(markdown: string): string {
    return markdown.replace(/(\$+)([^$]+)(?=\$+)/gms, (match, leadingDollars, content) => {
      if (content.match(/^\s*\\begin\{[^}]*}/ms) && content.match(/\\end\{[^}]*}\s*$/ms)) {
        return leadingDollars + this.replaceAll(content, '\\\\', '\\\\\\\\');
      }
      return match;
    });
  }

  replaceAll(value: string, from: string, to: string) {
    return value.split(from).join(to);
  }

  /**
   * A list of the mime types we will display, ordered from "best" to "worst".
   */
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
    if (mimeType === 'text/html') {
      return data;
    }
    if (mimeType?.startsWith('text/')) {
      return this.escape(data);
    }
    return undefined;
  }

  filterSpam(cells: any[]): any[] {
    return cells.filter((cell) => !this.isSpam(cell));
  }

  isSpam(cell: any): boolean {
    // Flag the "Open in Colab" cell that Google Colab inserts at the top of the notebook.
    return cell.cell_type === 'markdown' && cell.metadata?.id === 'view-in-github' && cell.metadata?.colab_type === 'text';
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
