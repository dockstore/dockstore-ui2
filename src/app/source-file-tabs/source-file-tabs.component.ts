import { Component, Input, OnInit } from '@angular/core';
import { MatSelectChange, MatTabChangeEvent } from '@angular/material';
import { SafeUrl } from '@angular/platform-browser';
import { DescriptorTypeCompatService } from 'app/shared/descriptor-type-compat.service';
import { FileService } from 'app/shared/file.service';
import { SourceFile, ToolDescriptor, WorkflowsService, WorkflowVersion } from 'app/shared/openapi';
import { Validation } from 'app/shared/swagger';
import { finalize } from 'rxjs/operators';
import { ga4ghWorkflowIdPrefix } from '../shared/constants';

@Component({
  selector: 'app-source-file-tabs',
  templateUrl: './source-file-tabs.component.html',
  styleUrls: ['./source-file-tabs.component.scss']
})
export class SourceFileTabsComponent implements OnInit {
  @Input() workflowId: number;
  @Input() descriptorType: ToolDescriptor.TypeEnum;
  @Input() set version(value: WorkflowVersion) {
    if (value != null) {
      this.currentVersion = value;
      this.setupVersionFileTabs();
    }
  }
  loading = true;
  currentVersion: WorkflowVersion;
  files: SourceFile[];
  filteredFiles: SourceFile[];
  currentFile: SourceFile;
  fileTypes: SourceFile.TypeEnum[];
  currentFileType: SourceFile.TypeEnum;
  validationMessage: Object;
  customDownloadHREF: SafeUrl;
  customDownloadPath: String;
  filePath: String;

  constructor(
    private workflowsService: WorkflowsService,
    private fileService: FileService,
    private descriptorTypeCompatService: DescriptorTypeCompatService
  ) {}

  ngOnInit() {
    this.setupVersionFileTabs();
  }

  setupVersionFileTabs() {
    this.loading = true;
    this.workflowsService
      .getWorkflowVersionsSourcefiles(this.workflowId, this.currentVersion.id)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (sourceFiles: SourceFile[]) => {
          this.files = sourceFiles;
          this.fileTypes = [];
          this.files.forEach((file: SourceFile) => {
            if (!this.fileTypes.includes(file.type)) {
              this.fileTypes.push(file.type);
            }
          });
          if (this.fileTypes.length > 0) {
            this.changeFileType(this.fileTypes[0]);
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  /**
   * Sets the file type to display and loads validation messages
   * @param fileType
   */
  changeFileType(fileType: SourceFile.TypeEnum) {
    this.currentFileType = fileType;

    this.filteredFiles = this.files.filter((file: SourceFile) => {
      return file.type === this.currentFileType;
    });

    if (this.filteredFiles.length > 0) {
      this.selectFile(this.filteredFiles[0]);
    }
    this.currentVersion.validations.forEach((validation: Validation) => {
      this.validationMessage = null;
      if (validation.type === this.currentFileType && !validation.valid) {
        this.validationMessage = JSON.parse(validation.message);
      }
    });
  }

  selectFile(file: SourceFile) {
    this.currentFile = file;
    this.customDownloadHREF = this.fileService.getFileData(this.currentFile.content);
    this.customDownloadPath = this.fileService.getFileName(this.currentFile.path);
    this.filePath = this.getDescriptorPath();
  }

  matTabChange(event: MatTabChangeEvent) {
    const fileType: SourceFile.TypeEnum = this.fileTypes[event.index];
    this.changeFileType(fileType);
  }

  matSelectChange(event: MatSelectChange) {
    this.selectFile(event.value);
  }

  getDescriptorPath(): string {
    const type = this.descriptorTypeCompatService.toolDescriptorTypeEnumToPlainTRS(this.descriptorType);
    if (type === null) {
      return null;
    }
    const id = ga4ghWorkflowIdPrefix + this.currentFile.path;
    return this.fileService.getDownloadFilePath(id, this.currentVersion.name, type, this.currentFile.path);
  }
}
