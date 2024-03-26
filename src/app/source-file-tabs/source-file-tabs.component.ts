import { KeyValue, Location } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacySelectChange as MatSelectChange } from '@angular/material/legacy-select';
import { MatLegacyTabChangeEvent as MatTabChangeEvent } from '@angular/material/legacy-tabs';
import { FileTreeComponent } from 'app/file-tree/file-tree.component';
import { bootstrap4largeModalSize } from 'app/shared/constants';
import { FileService } from 'app/shared/file.service';
import { EntryType, SourceFile, ToolDescriptor, WorkflowVersion, BioWorkflow, Notebook, Service } from 'app/shared/openapi';
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { WorkflowQuery } from '../shared/state/workflow.query';
import { SourceFileTabsService } from './source-file-tabs.service';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-source-file-tabs',
  templateUrl: './source-file-tabs.component.html',
  styleUrls: ['./source-file-tabs.component.scss'],
})
export class SourceFileTabsComponent implements OnChanges, AfterViewInit {
  private location: Location;
  constructor(
    private fileService: FileService,
    private sourceFileTabsService: SourceFileTabsService,
    private matDialog: MatDialog,
    private workflowQuery: WorkflowQuery,
    private router: Router,
    public locationService: Location,
    public activatedRoute: ActivatedRoute
  ) {
    this.isPublished$ = this.workflowQuery.workflowIsPublished$;
    this.primaryDescriptors = [];
    this.location = locationService;
  }
  @Input() entry: BioWorkflow | Service | Notebook;
  // Used to generate the TRS file path
  @Input() descriptorType: ToolDescriptor.TypeEnum;
  // Version is strictly non-null because everything that uses this component has a truthy-check guard
  @Input() version: WorkflowVersion;
  loading = true;
  displayError = false;
  currentFile: SourceFile | null;
  validationMessage: Map<string, string>;
  fileName: string;
  relativePath: string;
  downloadFilePath: string;
  fileTabs: Map<string, SourceFile[]>;
  sourceFiles: SourceFile[];
  sourceFilePaths: string[];
  primaryDescriptors: SourceFile[] | null;
  primaryDescriptorPath: string;
  isCurrentFilePrimary: boolean | null;
  queryParams = new HttpParams();
  protected isPublished$: Observable<boolean>;
  protected ngUnsubscribe: Subject<{}> = new Subject();
  /**
   * To prevent the Angular's keyvalue pipe from sorting by key
   */
  originalOrder = (a: KeyValue<string, SourceFile[]>, b: KeyValue<string, SourceFile[]>): number => {
    return 0;
  };

  ngAfterViewInit() {
    this.router.navigate([], { queryParams: { tab: 'files' } });
  }

  ngOnChanges() {
    this.setupVersionFileTabs();
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
          this.sourceFiles = [];
          this.sourceFilePaths = [];
          this.fileTabs = this.sourceFileTabsService.convertSourceFilesToFileTabs(
            sourceFiles,
            this.version.workflow_path,
            this.descriptorType
          );
          if (this.fileTabs.size > 0) {
            this.changeFileType(this.fileTabs.values().next().value);
          }
          sourceFiles.forEach((sourceFile) => {
            this.sourceFiles.push(sourceFile);
            this.sourceFilePaths.push(sourceFile.path);
            if (this.isPrimaryDescriptor(sourceFile.path)) {
              this.primaryDescriptors.push(sourceFile);
              this.primaryDescriptorPath = sourceFile.path;
            }
          });
          this.updateFileSelection(this.queryParams);
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
    if (this.queryParams.toString().includes('file=')) {
      this.updateFileSelection(this.queryParams);
    } else {
      this.selectFile(files[0]);
      this.validationMessage = this.sourceFileTabsService.getValidationMessage(files, this.version);
    }
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
    } else {
      this.fileName = null;
      this.relativePath = null;
      this.downloadFilePath = null;
    }
    this.currentFile = file;
    this.isCurrentFilePrimary = this.isPrimaryDescriptor(this.currentFile.path);
    this.queryParams = this.queryParams.set('file', this.currentFile.path);
    this.location.replaceState(this.router.url + '&' + this.queryParams.toString());
  }

  updateFileSelection(queryParams: HttpParams) {
    let selectedFilePath = this.queryParams.toString().split('file=')[1]; // splits the url to get file=
    console.log(selectedFilePath);
    const fileIndex = this.sourceFilePaths.indexOf(selectedFilePath);
    if (fileIndex > -1) {
      this.selectFile(this.sourceFiles[fileIndex]);
      console.log(this.currentFile);
    }
  }

  matTabChange(event: MatTabChangeEvent) {
    this.changeFileType(this.fileTabs.get(event.tab.textLabel));
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
