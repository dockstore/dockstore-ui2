import { KeyValue } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FileTreeComponent } from 'app/file-tree/file-tree.component';
import { bootstrap4largeModalSize } from 'app/shared/constants';
import { FileService } from 'app/shared/file.service';
import { SourceFile, ToolDescriptor, WorkflowVersion, Workflow } from 'app/shared/openapi';
import { finalize } from 'rxjs/operators';
import { SourceFileTabsService } from './source-file-tabs.service';

@Component({
  selector: 'app-source-file-tabs',
  templateUrl: './source-file-tabs.component.html',
  styleUrls: ['./source-file-tabs.component.scss'],
})
export class SourceFileTabsComponent implements OnChanges {
  constructor(private fileService: FileService, private sourceFileTabsService: SourceFileTabsService, private matDialog: MatDialog) {}
  @Input() workflowId: number;
  // Used to generate the TRS file path
  @Input() descriptorType: ToolDescriptor.TypeEnum;
  // Version is strictly non-null because everything that uses this component has a truthy-check guard
  @Input() version: WorkflowVersion;
  loading = true;
  displayError = false;
  currentFile: SourceFile | null;
  noFileInTabWarning: string;
  validationMessage: Map<string, string>;
  fileName: string;
  relativePath: string;
  downloadFilePath: string;
  fileTabs: Map<string, SourceFile[]>;
  isPublished: boolean;

  /**
   * To prevent the Angular's keyvalue pipe from sorting by key
   */
  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  };

  ngOnChanges() {
    this.setupVersionFileTabs();
  }

  setupVersionFileTabs() {
    this.loading = true;
    this.displayError = false;
    this.sourceFileTabsService
      .getSourceFiles(this.workflowId, this.version.id)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (sourceFiles: SourceFile[]) => {
          this.fileTabs = this.sourceFileTabsService.convertSourceFilesToFileTabs(
            sourceFiles,
            this.version.workflow_path,
            this.descriptorType
          );
          if (this.fileTabs.size > 0) {
            this.changeFileType(this.fileTabs.values().next().value);
          }
        },
        () => {
          this.displayError = true;
        }
      );
  }

  /**
   * Sets up the TRS URL of the selected file and whether it is published
   */
  setupDownloadFilePath(relativePath: string) {
    this.loading = true;
    this.displayError = false;
    this.sourceFileTabsService
      .getWorkflow(this.workflowId)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (currentWorkflow: Workflow) => {
          this.isPublished = currentWorkflow.is_published;
          this.downloadFilePath = this.sourceFileTabsService.getDescriptorPath(
            this.workflowId,
            this.descriptorType,
            currentWorkflow.full_workflow_path,
            this.version.name,
            relativePath
          );
        },
        () => {
          this.displayError = true;
        }
      );
  }

  /**
   * Sets the validation message and new default selected file
   * @param fileType
   */
  changeFileType(files: SourceFile[]) {
    this.selectFile(files[0]);
    this.validationMessage = this.sourceFileTabsService.getValidationMessage(files, this.version);
  }

  selectFile(file: SourceFile) {
    if (file) {
      this.fileName = this.fileService.getFileName(file.path);
      this.relativePath = file.absolutePath;
      this.setupDownloadFilePath(this.relativePath);
    } else {
      this.fileName = null;
      this.relativePath = null;
      this.downloadFilePath = null;
    }
    this.currentFile = file;
  }

  matTabChange(event: MatTabChangeEvent) {
    this.changeFileType(this.fileTabs.get(event.tab.textLabel));
  }

  matSelectChange(event: MatSelectChange) {
    this.selectFile(event.value);
  }

  openFileTree(sourceFiles: SourceFile[]) {
    this.matDialog
      .open(FileTreeComponent, { width: bootstrap4largeModalSize, data: { files: sourceFiles, selectedFile: this.currentFile } })
      .afterClosed()
      .subscribe((absoluteFilePath) => {
        const foundFile = sourceFiles.find((file) => file.absolutePath === absoluteFilePath);
        if (foundFile) {
          this.selectFile(foundFile);
        }
      });
  }

  downloadFileContent() {
    this.fileService.downloadFileContent(this.currentFile.content, this.fileName);
  }
}
