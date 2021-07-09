import { KeyValue } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SafeUrl } from '@angular/platform-browser';
import { FileTreeComponent } from 'app/file-tree/file-tree.component';
import { bootstrap4largeModalSize } from 'app/shared/constants';
import { FileService } from 'app/shared/file.service';
import { SourceFile, ToolDescriptor, WorkflowVersion } from 'app/shared/openapi';
import { Validation } from 'app/shared/swagger';
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
  fileTabs: Map<string, SourceFile[]>;

  readonly fileTab1 = {tabName: "Dockerfile", fileTypes: [SourceFile.TypeEnum.DOCKERFILE]}
  readonly fileTab2 = {tabName: "Configuration", fileTypes: [SourceFile.TypeEnum.DOCKSTORESERVICEYML]}
  readonly fileTab3 = {tabName: "Descriptor Files", fileTypes: [SourceFile.TypeEnum.DOCKSTORECWL, SourceFile.TypeEnum.DOCKSTOREWDL, SourceFile.TypeEnum.NEXTFLOWCONFIG, SourceFile.TypeEnum.DOCKSTORESWL, SourceFile.TypeEnum.NEXTFLOW, SourceFile.TypeEnum.DOCKSTORESERVICEOTHER, SourceFile.TypeEnum.DOCKSTOREGXFORMAT2]}
  readonly fileTab4 = {tabName: "Test Parameter Files", fileTypes: [SourceFile.TypeEnum.CWLTESTJSON, SourceFile.TypeEnum.WDLTESTJSON, SourceFile.TypeEnum.NEXTFLOWTESTPARAMS, SourceFile.TypeEnum.DOCKSTORESERVICETESTJSON, SourceFile.TypeEnum.GXFORMAT2TESTFILE, SourceFile.TypeEnum.SWLTESTJSON]}
  readonly fileTab5 = {tabName: "Configuration", fileTypes: [SourceFile.TypeEnum.DOCKSTOREYML]}
  readonly fileTabsSchematic = [this.fileTab1, this.fileTab2, this.fileTab3, this.fileTab4, this.fileTab5]

  /**
   * To prevent the Angular keyvalue pipe from sorting
   */
  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
  }

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
          this.fileTabs = this.convertSourceFilesToFileTabs(sourceFiles);
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

  private convertSourceFilesToFileTabs(sourcefiles: SourceFile[]):  Map<string, SourceFile[]> {
    let fileTabs = new Map<string, SourceFile[]>();
    if (!sourcefiles || sourcefiles.length === 0) {
      return fileTabs;
    }
    this.fileTabsSchematic.forEach(fileTab => {
      fileTab.fileTypes.forEach(fileType => {
        const sourceFilesMatchingType = sourcefiles.filter(sourcefile => sourcefile.type === fileType);
        if (sourceFilesMatchingType.length > 0) {
          if (fileTabs.has(fileTab.tabName)) {
            fileTabs.set(fileTab.tabName, fileTabs.get(fileTab.tabName).concat(sourceFilesMatchingType));
          } else {
            fileTabs.set(fileTab.tabName, sourceFilesMatchingType);
          }
        }
      });
    });
    console.log(fileTabs);
    return fileTabs;
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
    console.log(event);
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
}
