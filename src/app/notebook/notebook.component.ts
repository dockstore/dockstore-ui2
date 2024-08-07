import { Component, Input, OnChanges } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SourceFile, Workflow, WorkflowVersion, WorkflowsService } from 'app/shared/openapi';
import { Cell } from './notebook-types';
import { NotebookMimeBundleOutputComponent } from './notebook-mime-bundle-output.component';
import { NotebookStreamOutputComponent } from './notebook-stream-output.component';
import { NotebookSourceComponent } from './notebook-source.component';
import { NotebookMarkdownComponent } from './notebook-markdown.component';
import { NgIf, NgFor } from '@angular/common';

/**
 * Convert the specified notebook to user-friendly preview that represents it.
 *
 * The Jupyter notebook format:
 * https://nbformat.readthedocs.io/en/latest/
 */

const ERROR_MESSAGE = 'The notebook could not be displayed.';

@Component({
  selector: 'app-notebook',
  templateUrl: './notebook.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NotebookMarkdownComponent,
    NotebookSourceComponent,
    NotebookStreamOutputComponent,
    NotebookMimeBundleOutputComponent,
  ],
})
export class NotebookComponent implements OnChanges {
  constructor(private workflowsService: WorkflowsService) {}
  @Input() notebook: Workflow;
  @Input() version: WorkflowVersion;
  @Input() baseUrl: string;
  loading: boolean = true;
  error: string | null = null;
  cells: Cell[] = [];
  private currentSubscription: Subscription = null;

  ngOnChanges() {
    this.retrieveAndFormatNotebook();
  }

  retrieveAndFormatNotebook() {
    this.loading = true;
    this.error = null;
    this.cells = [];
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
    // value of the `notebook` field to determine the notebook language.
    this.currentSubscription?.unsubscribe();
    this.currentSubscription = this.workflowsService
      .getWorkflowVersionsSourcefiles(this.notebook.id, this.version.id, ['DOCKSTORE_JUPYTER'])
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        // Success.
        (sourceFiles: SourceFile[]) => {
          for (const sourceFile of sourceFiles) {
            if (this.isPrimaryDescriptor(sourceFile.path)) {
              if (sourceFile.state === 'COMPLETE') {
                this.formatNotebook(sourceFile.content);
              } else {
                this.error = this.incompleteSourceFileErrorMessage(sourceFile);
              }
              return;
            }
          }
          this.error = ERROR_MESSAGE;
        },
        // Failure.
        () => {
          this.error = ERROR_MESSAGE;
        }
      );
  }

  formatNotebook(content: string): void {
    try {
      // Parse the JSON content of the notebook file.
      const json = JSON.parse(content);
      // Find the cells and, if necessary, convert them to a representation that approximates nbformat 4.
      const cells = json?.nbformat < 4 ? this.cellsToNbformat4(json?.worksheets[0]?.cells) : json?.cells;
      // If the `cells` property is an array, filter spam, "pass" the cells to the template, and return.
      if (this.isArray(cells)) {
        this.cells = this.filterSpam(cells);
        this.error = null;
        return;
      }
    } catch (e) {
      console.log('Exception formatting notebook:');
      console.log(e.message);
    }
    this.error = ERROR_MESSAGE;
  }

  incompleteSourceFileErrorMessage(file: SourceFile): string {
    var message = ERROR_MESSAGE;
    if (file.state === 'NOT_STORED') {
      message = message + ' ' + file.content;
    }
    return message;
  }

  isPrimaryDescriptor(path: string): boolean {
    return path === this.version.workflow_path;
  }

  filterSpam(cells: Cell[]): Cell[] {
    return cells.filter((cell) => !this.isSpam(cell));
  }

  isSpam(cell: Cell): boolean {
    // Flag the "Open in Colab" cell that Google Colab inserts at the top of the notebook.
    return cell.cell_type === 'markdown' && cell.metadata?.id === 'view-in-github' && cell.metadata?.colab_type === 'text';
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  cellsToNbformat4(cells: Cell[]): Cell[] {
    if (this.isArray(cells)) {
      cells.forEach((cell) => this.cellToNbFormat4(cell));
    }
    return cells;
  }

  cellToNbFormat4(cell: Cell): void {
    if (cell.cell_type === 'code') {
      // Handle some field name changes: 'input' -> 'source', 'prompt_number' -> 'execution_count'
      cell.source ??= cell['input'];
      cell.execution_count ??= cell['prompt_number'];
      // Convert each output.
      if (this.isArray(cell.outputs)) {
        cell.outputs.forEach(
          (output) =>
            // Map the old representation of rich outputs to a "mime bundle'.
            (output.data ??= {
              'text/plain': output['text'],
              'text/html': output['html'],
              'image/png': output['png'],
            })
        );
      }
    }
  }
}
