import { Component, Input, OnChanges } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SourceFile, Workflow, WorkflowVersion, WorkflowsService } from 'app/shared/openapi';

/**
 * Convert the specified notebook to user-friendly preview that represents it.
 *
 * The Jupyter notebook format:
 * https://nbformat.readthedocs.io/en/latest/
 */

@Component({
  selector: 'app-formatted-notebook',
  templateUrl: './formatted-notebook.component.html',
})
export class FormattedNotebookComponent implements OnChanges {
  constructor(private workflowsService: WorkflowsService) {}
  @Input() notebook: Workflow;
  @Input() version: WorkflowVersion;
  @Input() baseUrl: string;
  loading = true;
  displayError = false;
  cells = null;
  private currentSubscription: Subscription = null;

  ngOnChanges() {
    this.retrieveAndFormatNotebook();
  }

  retrieveAndFormatNotebook() {
    this.loading = true;
    this.displayError = false;
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
        (sourceFiles: SourceFile[]) => {
          for (const sourceFile of sourceFiles) {
            if (this.isPrimaryDescriptor(sourceFile.path)) {
              try {
                const json = JSON.parse(sourceFile.content);
                if (!Array.isArray(json?.cells)) {
                  this.displayError = true;
                  return;
                }
                this.cells = this.filterSpam(json.cells);
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

  filterSpam(cells: any[]): any[] {
    return cells.filter((cell) => !this.isSpam(cell));
  }

  isSpam(cell: any): boolean {
    // Flag the "Open in Colab" cell that Google Colab inserts at the top of the notebook.
    return cell.cell_type === 'markdown' && cell.metadata?.id === 'view-in-github' && cell.metadata?.colab_type === 'text';
  }

  arrayOf(value: any): any[] {
    return Array.isArray(value) ? value : [];
  }
}
