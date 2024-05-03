import { KeyValue, Location } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacySelectChange as MatSelectChange } from '@angular/material/legacy-select';
import { MatLegacyTabChangeEvent as MatTabChangeEvent } from '@angular/material/legacy-tabs';
import { FileTreeComponent } from 'app/file-tree/file-tree.component';
import { bootstrap4largeModalSize } from 'app/shared/constants';
import { FileService } from 'app/shared/file.service';
import { EntryType, SourceFile, ToolDescriptor, WorkflowVersion, BioWorkflow, Notebook, Service } from 'app/shared/openapi';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { WorkflowQuery } from '../shared/state/workflow.query';
import { SourceFileTabsService } from './source-file-tabs.service';

@Component({
  selector: 'app-source-file-tabs',
  templateUrl: './source-file-tabs.component.html',
  styleUrls: ['./source-file-tabs.component.scss'],
})
export class SourceFileTabsComponent implements OnChanges {
  constructor(
    private fileService: FileService,
    private sourceFileTabsService: SourceFileTabsService,
    private matDialog: MatDialog,
    private workflowQuery: WorkflowQuery,
    private route: ActivatedRoute,
    private router: Router,
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
    this.route.queryParams.subscribe((params) => {
      if (this.fileTabs) {
        this.selectTabAndFile();
      }
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
          this.selectTabAndFile();
        },
        () => {
          this.displayError = true;
        }
      );
  }

  selectTabAndFile() {
    console.log(this.fileTabs.size);
    if (this.fileTabs.size > 0) {
      // Attempt to set the file as indicated by the 'file' query parameter.
      const queryFileName = this.route.snapshot.queryParams['file'];
      console.log('PARAM ' + queryFileName);
      if (queryFileName) {
        // console.log("VALUES " + JSON.stringify(this.fileTabs.values()));
        for (let tabIndex = 0; tabIndex < this.fileTabs.size; tabIndex++) {
          const sourceFiles = Array.from(this.fileTabs.values())[tabIndex];
          // console.log("SOURCEFILES " + JSON.stringify(sourceFiles));
          for (let sourceFile of sourceFiles) {
            console.log('CMP ' + sourceFile.absolutePath + ' ' + queryFileName);
            // console.log("SOURCEFILE " + JSON.stringify(sourceFile));
            if (sourceFile.absolutePath === queryFileName) {
              this.changeTab(tabIndex);
              console.log('INDEXOF ' + sourceFiles.indexOf(sourceFile));
              this.selectFile(sourceFile);
              this.changeTab(tabIndex);
              return;
            }
          }
        }
      }

      // Otherwise, select the first file in the first tab.
      console.log('DEFAULT');
      const files = this.fileTabs.values().next().value;
      this.selectFile(files[0]);
      this.changeTab(0);
    }
  }

  changeTab(tabIndex: number) {
    console.log('CHANGETAB ' + this.selectedTabIndex + ' ' + tabIndex);
    this.selectedTabIndex = tabIndex;
  }

  /**
   * Sets the validation message and new default selected file
   * @param fileType
   */
  changeFileType(files: SourceFile[]) {
    console.log('CHANGEFILETYPE');
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
    }
    this.currentFile = file;
    this.setUrl(file);
  }

  setUrl(file: SourceFile) {
    let query = 'tab=files';
    if (file) {
      query += `&file=${file.absolutePath}`;
    }
    const root = this.router.url.split('?')[0];
    this.location.replaceState(root, query);
  }

  matTabChange(event: MatTabChangeEvent) {
    console.log('MAT TAB CHANGE');
    const files = this.fileTabs.get(event.tab.textLabel);
    if (files.indexOf(this.currentFile) < 0) {
      this.selectFile(files[0]);
    }
    this.changeFileType(files);
  }

  matSelectChange(event: MatSelectChange) {
    console.log('MAT SELECT CHANGE ' + event.value);
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
