import { KeyValue, Location, NgIf, NgFor, AsyncPipe, KeyValuePipe } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacySelectChange as MatSelectChange, MatLegacySelectModule } from '@angular/material/legacy-select';
import { MatLegacyTabChangeEvent as MatTabChangeEvent, MatLegacyTabsModule } from '@angular/material/legacy-tabs';
import { FileTreeComponent } from 'app/file-tree/file-tree.component';
import { bootstrap4largeModalSize } from 'app/shared/constants';
import { FileService } from 'app/shared/file.service';
import { EntryType, SourceFile, ToolDescriptor, WorkflowVersion, BioWorkflow, Notebook, Service } from 'app/shared/openapi';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { WorkflowQuery } from '../shared/state/workflow.query';
import { SourceFileTabsService } from './source-file-tabs.service';
import { CodeEditorComponent } from '../shared/code-editor/code-editor.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatLegacyOptionModule } from '@angular/material/legacy-core';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { LoadingComponent } from '../shared/loading/loading.component';

@Component({
  selector: 'app-source-file-tabs',
  templateUrl: './source-file-tabs.component.html',
  styleUrls: ['./source-file-tabs.component.scss'],
  standalone: true,
  imports: [
    LoadingComponent,
    NgIf,
    MatLegacyCardModule,
    MatIconModule,
    NgFor,
    MatLegacyTabsModule,
    MatToolbarModule,
    FlexModule,
    MatLegacyButtonModule,
    MatLegacyTooltipModule,
    MatLegacyFormFieldModule,
    MatLegacySelectModule,
    MatLegacyOptionModule,
    ClipboardModule,
    CodeEditorComponent,
    AsyncPipe,
    KeyValuePipe,
  ],
})
export class SourceFileTabsComponent implements OnChanges {
  constructor(
    private fileService: FileService,
    private sourceFileTabsService: SourceFileTabsService,
    private matDialog: MatDialog,
    private workflowQuery: WorkflowQuery,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    this.isPublished$ = this.workflowQuery.workflowIsPublished$;
    this.primaryDescriptors = [];
  }
  @Input() entry: BioWorkflow | Service | Notebook;
  // Used to generate the TRS file path
  @Input() descriptorType: ToolDescriptor.TypeEnum;
  // Version is strictly non-null because everything that uses this component has a truthy-check guard
  @Input() version: WorkflowVersion;
  loading = true;
  displayError = false;
  notFoundError = false;
  currentFile: SourceFile | null;
  validationMessage: Map<string, string>;
  fileName: string;
  relativePath: string;
  downloadFilePath: string;
  fileTabs: Map<string, SourceFile[]>;
  selectedTabIndex: number = 0;
  primaryDescriptors: SourceFile[] | null;
  primaryDescriptorPath: string;
  isCurrentFilePrimary: boolean | null;
  protected isPublished$: Observable<boolean>;
  /**
   * To prevent the Angular's keyvalue pipe from sorting by key
   */
  originalOrder = (a: KeyValue<string, SourceFile[]>, b: KeyValue<string, SourceFile[]>): number => {
    return 0;
  };

  ngOnChanges() {
    this.setupVersionFileTabs();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.findFile();
    });
  }

  setupVersionFileTabs() {
    this.loading = true;
    this.displayError = false;
    this.sourceFileTabsService
      .getSourceFiles(this.entry.id, this.version.id)
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
          sourceFiles.forEach((sourceFile) => {
            if (this.isPrimaryDescriptor(sourceFile.path)) {
              this.primaryDescriptors.push(sourceFile);
              this.primaryDescriptorPath = sourceFile.path;
            }
          });
          this.findFile();
        },
        () => {
          this.displayError = true;
        }
      );
  }

  findFile() {
    const queryFilePath = this.activatedRoute.snapshot.queryParams['file'];
    if (this.fileTabs?.size > 0) {
      // Attempt to find the file that is indicated by the 'file' query parameter.
      // If we are successful, select the file, change the tab, and return.
      if (queryFilePath) {
        for (let tabIndex = 0; tabIndex < this.fileTabs.size; tabIndex++) {
          const sourceFiles = Array.from(this.fileTabs.values())[tabIndex];
          for (let sourceFile of sourceFiles) {
            if (sourceFile.absolutePath === queryFilePath) {
              this.selectFile(sourceFile);
              this.changeTab(tabIndex);
              return;
            }
          }
        }
      }
      // Otherwise, select the first file in the first tab.
      const files = this.fileTabs.values().next().value;
      this.selectFile(files[0]);
      this.changeTab(0);
    }
    // If there was a 'file' query parameter and we've gotten to this point, we couldn't find a matching file.
    if (queryFilePath) {
      this.notFoundError = true;
    }
  }

  changeTab(tabIndex: number) {
    this.selectedTabIndex = tabIndex;
  }

  /**
   * Sets the validation message and new default selected file
   * @param fileType
   */
  changeFileType(files: SourceFile[]) {
    this.validationMessage = this.sourceFileTabsService.getValidationMessage(files, this.version);
  }

  selectFile(file: SourceFile) {
    if (file) {
      this.fileName = this.fileService.getFileName(file.path);
      this.relativePath = file.absolutePath;
      this.downloadFilePath = this.sourceFileTabsService.getDescriptorPath(
        this.entry,
        this.descriptorType,
        this.version.name,
        this.relativePath
      );
      this.isCurrentFilePrimary = this.isPrimaryDescriptor(file.path);
    } else {
      this.fileName = null;
      this.relativePath = null;
      this.downloadFilePath = null;
      this.isCurrentFilePrimary = false;
    }
    this.currentFile = file;
    this.setFilePathInLocation(file);
    this.notFoundError = false;
  }

  setFilePathInLocation(file: SourceFile) {
    const url = this.location.path();
    const root = url.split('?')[0];
    const params = new URLSearchParams(url.split('?')[1] ?? '');
    // Don't modify the URL if it's not tracking the current tab.
    if (!params.has('tab')) {
      return;
    }
    // Add the sourcefile's absolute path as the 'file' query parameter.
    if (file) {
      params.set('file', file.absolutePath);
    } else {
      params.delete('file');
    }
    this.location.replaceState(root, params.toString());
  }

  matTabChange(event: MatTabChangeEvent) {
    const files = this.fileTabs.get(event.tab.textLabel);
    // If the new tab has files, select the first one.
    if (files.indexOf(this.currentFile) < 0) {
      this.selectFile(files[0]);
    }
    this.changeFileType(files);
  }

  matSelectChange(event: MatSelectChange) {
    this.selectFile(event.value);
  }

  openFileTree(sourceFiles: SourceFile[]) {
    this.matDialog
      .open(FileTreeComponent, {
        width: bootstrap4largeModalSize,
        data: {
          files: sourceFiles,
          selectedFile: this.currentFile,
          entryPath: this.entry.full_workflow_path,
          versionName: this.version.name,
          descriptorType: this.descriptorType,
          versionPath: this.version.workflow_path,
          entryType: this.entry.entryType,
        },
      })
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

  isPrimaryDescriptor(path: string): boolean {
    return path === this.version.workflow_path && this.entry.entryType !== EntryType.NOTEBOOK;
  }
}
