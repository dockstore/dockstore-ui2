import { Component, Input, OnInit } from '@angular/core';
import { MatSelectChange, MatTabChangeEvent } from '@angular/material';
import { SourceFile, WorkflowsService, WorkflowVersion } from 'app/shared/openapi';
import { Validation } from 'app/shared/swagger';

@Component({
  selector: 'app-source-file-tabs',
  templateUrl: './source-file-tabs.component.html',
  styleUrls: ['./source-file-tabs.component.scss']
})
export class SourceFileTabsComponent implements OnInit {
  @Input() workflowId: number;
  @Input() set version(value: WorkflowVersion) {
    if (value != null) {
      this.currentVersion = value;
      this.setupVersionFileTabs();
    }
  }
  currentVersion: WorkflowVersion;
  files: SourceFile[];
  filteredFiles: SourceFile[];
  currentFile: SourceFile;
  fileTypes: SourceFile.TypeEnum[];
  currentFileType: SourceFile.TypeEnum;
  validationMessage: Object;

  constructor(private workflowsService: WorkflowsService) {}

  ngOnInit() {
    this.setupVersionFileTabs();
  }

  setupVersionFileTabs() {
    this.workflowsService.getWorkflowVersionsSourcefiles(this.workflowId, this.currentVersion.id).subscribe(
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
      error => console.log(error)
    );
  }

  changeFileType(fileType: SourceFile.TypeEnum) {
    this.currentFileType = fileType;

    this.filteredFiles = this.files.filter((file: SourceFile) => {
      return file.type === this.currentFileType;
    });

    if (this.filteredFiles.length > 0) {
      this.currentFile = this.filteredFiles[0];
    }
    this.currentVersion.validations.forEach((validation: Validation) => {
      this.validationMessage = null;
      if (validation.type === this.currentFileType && !validation.valid) {
        this.validationMessage = JSON.parse(validation.message);
      }
    });
  }

  matTabChange(event: MatTabChangeEvent) {
    const fileType: SourceFile.TypeEnum = this.fileTypes[event.index];
    this.changeFileType(fileType);
  }

  matSelectChange(event: MatSelectChange) {
    this.currentFile = event.value;
  }
}
