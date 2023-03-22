import { Component, Input, OnChanges } from '@angular/core';
import { FileService } from 'app/shared/file.service';
import { SourceFile, Workflow, WorkflowVersion } from 'app/shared/openapi';
import { finalize } from 'rxjs/operators';
import { SourceFileTabsService } from '../source-file-tabs/source-file-tabs.service';
import { WorkflowQuery } from '../shared/state/workflow.query';
import { Observable } from 'rxjs';
import { NotebookFormatter } from './formatter';

@Component({
  selector: 'app-formatted-notebook',
  templateUrl: './formatted-notebook.component.html',
  styleUrls: ['./formatted-notebook.component.scss'],
})
export class FormattedNotebookComponent implements OnChanges {
  constructor(private fileService: FileService, private sourceFileTabsService: SourceFileTabsService) {}
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
              let formatted = 'Notebook path: ' + sourceFile.path;
              formatted += '<br>' + sourceFile.content;
              this.formatted = new NotebookFormatter().format(formatted);
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
}
