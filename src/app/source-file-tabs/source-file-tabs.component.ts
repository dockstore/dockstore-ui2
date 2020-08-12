import { Component, Input, OnChanges } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SafeUrl } from '@angular/platform-browser';
import { FileService } from 'app/shared/file.service';
import { SourceFile, ToolDescriptor, WorkflowVersion } from 'app/shared/openapi';
import { Validation } from 'app/shared/swagger';
import { finalize } from 'rxjs/operators';
import { SourceFileTabsService } from './source-file-tabs.service';

@Component({
  selector: 'app-source-file-tabs',
  templateUrl: './source-file-tabs.component.html',
  styleUrls: ['./source-file-tabs.component.scss']
})
export class SourceFileTabsComponent implements OnChanges {
  @Input() workflowId: number;
  @Input() descriptorType: ToolDescriptor.TypeEnum;
  // Version is strictly non-null because everything that uses this component has a truthy-check guard
  @Input() version: WorkflowVersion;
  loading = true;
  displayError = false;
  files: SourceFile[];
  filteredFiles: SourceFile[];
  currentFile: SourceFile;
  fileTypes: SourceFile.TypeEnum[];
  currentFileType: SourceFile.TypeEnum;
  validationMessage: Object;
  customDownloadHREF: SafeUrl;
  customDownloadPath: String;
  filePath: String;

  constructor(private fileService: FileService, private sourceFileTabsService: SourceFileTabsService) {}

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
          const fileTypes = this.sourceFileTabsService.getFileTypes(sourceFiles);
          if (fileTypes.length > 0) {
            this.changeFileType(fileTypes[0], sourceFiles);
          }
          this.files = sourceFiles;
          this.fileTypes = fileTypes;
        },
        () => {
          this.displayError = true;
        }
      );
  }

  /**
   * Sets the file type to display and loads validation messages
   * @param fileType
   */
  changeFileType(fileType: SourceFile.TypeEnum, files: SourceFile[]) {
    let validationMessage = null;
    this.version.validations.forEach((validation: Validation) => {
      if (validation.type === fileType && !validation.valid) {
        validationMessage = JSON.parse(validation.message);
      }
    });

    const filteredFiles = files.filter((file: SourceFile) => {
      return file.type === fileType;
    });
    if (filteredFiles.length > 0) {
      this.selectFile(filteredFiles[0]);
    }

    this.currentFileType = fileType;
    this.filteredFiles = filteredFiles;
    this.validationMessage = validationMessage;
  }

  selectFile(file: SourceFile) {
    this.customDownloadHREF = this.fileService.getFileData(file.content);
    this.customDownloadPath = this.fileService.getFileName(file.path);
    this.filePath = this.sourceFileTabsService.getDescriptorPath(this.descriptorType, file.path, this.version.name);
    this.currentFile = file;
  }

  matTabChange(event: MatTabChangeEvent) {
    const fileType: SourceFile.TypeEnum = this.fileTypes[event.index];
    this.changeFileType(fileType, this.files);
  }

  matSelectChange(event: MatSelectChange) {
    this.selectFile(event.value);
  }
}
