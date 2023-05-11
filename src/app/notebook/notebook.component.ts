import { Component, Input, OnChanges } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SourceFile, Workflow, WorkflowVersion, WorkflowsService } from 'app/shared/openapi';
import { Cell } from './notebook-types';

/**
 * Convert the specified notebook to user-friendly preview that represents it.
 *
 * The Jupyter notebook format:
 * https://nbformat.readthedocs.io/en/latest/
 */

@Component({
  selector: 'app-notebook',
  templateUrl: './notebook.component.html',
})
export class NotebookComponent implements OnChanges {
  constructor(private workflowsService: WorkflowsService) {}
  @Input() notebook: Workflow;
  @Input() version: WorkflowVersion;
  @Input() baseUrl: string;
  loading: boolean = true;
  error: boolean = false;
  cells: Cell[] = [];
  private currentSubscription: Subscription = null;

  ngOnChanges() {
    this.retrieveAndFormatNotebook();
  }

  retrieveAndFormatNotebook() {
    this.loading = true;
    this.error = false;
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
              try {
                // Parse the JSON content of the notebook file.
                const json = JSON.parse(sourceFile.content);
                // Find the cells and, if necessary, convert them to a representation that approximates nbformat 4.
                const cells = json?.nbformat >= 4 ? json?.cells : this.cellsToNbformat4(json?.worksheets[0]?.cells);
                // If the `cells` property is an array, filter spam and "pass" the cells to the template.
                if (this.isArray(cells)) {
                  this.cells = this.filterSpam(cells);
                  this.error = false;
                  return;
                }
              } catch (e) {
                console.log('Exception formatting notebook:');
                console.log(e.message);
              }
              this.error = true;
              return;
            }
          }
          this.error = true;
        },
        // Failure.
        () => {
          this.error = true;
        }
      );
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
      cells.map((cell) => this.cellToNbFormat4(cell));
    }
    return cells;
  }

  cellToNbFormat4(cell: Cell): Cell {
    if (cell.cell_type === 'code') {
      // Handle some field name changes: 'input' -> 'source', 'prompt_number' -> 'execution_count'
      cell.source ??= cell['input'];
      cell.execution_count ??= cell['prompt_number'];
      // Convert each output.
      if (this.isArray(cell.outputs)) {
        cell.outputs.forEach(
          (output) =>
            // Map the previous representation of rich outputs to a "mime bundle'.
            (output.data ??= {
              'text/plain': output['text'],
              'text/html': output['html'],
              'image/png': output['png'],
            })
        );
      }
    }
    return cell;
  }
}
