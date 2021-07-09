import { Injectable } from '@angular/core';
import { DescriptorTypeCompatService } from 'app/shared/descriptor-type-compat.service';
import { FileService } from 'app/shared/file.service';
import { SourceFile, ToolDescriptor, WorkflowsService, WorkflowVersion } from 'app/shared/openapi';
import { Validation } from 'app/shared/swagger';
import { Observable } from 'rxjs';
import { ga4ghWorkflowIdPrefix } from '../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class SourceFileTabsService {
  constructor(
    private workflowsService: WorkflowsService,
    private fileService: FileService,
    private descriptorTypeCompatService: DescriptorTypeCompatService
  ) {}


  readonly fileTab1 = {tabName: "Dockerfile", fileTypes: [SourceFile.TypeEnum.DOCKERFILE]}
  readonly fileTab2 = {tabName: "Configuration", fileTypes: [SourceFile.TypeEnum.DOCKSTORESERVICEYML]}
  readonly fileTab3 = {tabName: "Descriptor Files", fileTypes: [SourceFile.TypeEnum.DOCKSTORECWL, SourceFile.TypeEnum.DOCKSTOREWDL, SourceFile.TypeEnum.NEXTFLOWCONFIG, SourceFile.TypeEnum.DOCKSTORESWL, SourceFile.TypeEnum.NEXTFLOW, SourceFile.TypeEnum.DOCKSTORESERVICEOTHER, SourceFile.TypeEnum.DOCKSTOREGXFORMAT2]}
  readonly fileTab4 = {tabName: "Test Parameter Files", fileTypes: [SourceFile.TypeEnum.CWLTESTJSON, SourceFile.TypeEnum.WDLTESTJSON, SourceFile.TypeEnum.NEXTFLOWTESTPARAMS, SourceFile.TypeEnum.DOCKSTORESERVICETESTJSON, SourceFile.TypeEnum.GXFORMAT2TESTFILE, SourceFile.TypeEnum.SWLTESTJSON]}
  readonly fileTab5 = {tabName: "Configuration", fileTypes: [SourceFile.TypeEnum.DOCKSTOREYML]}
  readonly fileTabsSchematic = [this.fileTab1, this.fileTab2, this.fileTab3, this.fileTab4, this.fileTab5]

  /**
   * Retrieve all source files for the given workflow version
   * @param workflowId
   * @param versionId
   */
  getSourceFiles(workflowId: number, versionId: number): Observable<SourceFile[]> {
    return this.workflowsService.getWorkflowVersionsSourcefiles(workflowId, versionId);
  }

  convertSourceFilesToFileTabs(sourcefiles: SourceFile[]):  Map<string, SourceFile[]> {
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
    return fileTabs;
  }

  /**
   * Given the sourcefiles in the current tab, return the validation message object that should be shown
   */
  getValidationMessage(sourcefiles: SourceFile[], version: WorkflowVersion): Object {
    let validationMessage = null;
    version.validations.forEach((validation: Validation) => {
      sourcefiles.forEach(file => {
        if (validation.type === file.type && !validation.valid) {
          validationMessage = JSON.parse(validation.message);
        }
      })
    });
    return validationMessage;
  }

  /**
   * Return a set of file types for the given file set
   * @param files
   */
  getFileTypes(files: SourceFile[]): SourceFile.TypeEnum[] {
    const fileTypes = [];
    files.forEach((file: SourceFile) => {
      if (!fileTypes.includes(file.type)) {
        fileTypes.push(file.type);
      }
    });
    // Push /dockstore.yml configuration files to the end
    let ymlIndex = fileTypes.indexOf(SourceFile.TypeEnum.DOCKSTOREYML);
    if (ymlIndex >= 0) {
      fileTypes.splice(ymlIndex, 1);
      fileTypes.push(SourceFile.TypeEnum.DOCKSTOREYML);
    }

    ymlIndex = fileTypes.indexOf(SourceFile.TypeEnum.DOCKSTORESERVICEYML);
    if (ymlIndex >= 0) {
      fileTypes.splice(ymlIndex, 1);
      fileTypes.push(SourceFile.TypeEnum.DOCKSTORESERVICEYML);
    }
    return fileTypes;
  }

  /**
   * Retrieve download path for a sourcefile
   * @param descriptorType
   * @param filePath
   * @param versionName
   */
  getDescriptorPath(descriptorType: ToolDescriptor.TypeEnum, filePath: string, versionName: string): string {
    const type = this.descriptorTypeCompatService.toolDescriptorTypeEnumToPlainTRS(descriptorType);
    if (type === null) {
      return null;
    }
    const id = ga4ghWorkflowIdPrefix + filePath;
    return this.fileService.getDownloadFilePath(id, versionName, type, filePath);
  }
}
