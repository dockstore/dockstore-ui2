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

  readonly fileTab1 = { tabName: 'Dockerfile', fileTypes: [SourceFile.TypeEnum.DOCKERFILE] };
  readonly fileTab2 = {
    tabName: 'Descriptor Files',
    fileTypes: [
      SourceFile.TypeEnum.DOCKSTORECWL,
      SourceFile.TypeEnum.DOCKSTOREWDL,
      SourceFile.TypeEnum.NEXTFLOWCONFIG,
      SourceFile.TypeEnum.DOCKSTORESWL,
      SourceFile.TypeEnum.NEXTFLOW,
      SourceFile.TypeEnum.DOCKSTORESERVICEOTHER,
      SourceFile.TypeEnum.DOCKSTOREGXFORMAT2,
    ],
  };
  readonly fileTab3 = {
    tabName: 'Test Parameter Files',
    fileTypes: [
      SourceFile.TypeEnum.CWLTESTJSON,
      SourceFile.TypeEnum.WDLTESTJSON,
      SourceFile.TypeEnum.NEXTFLOWTESTPARAMS,
      SourceFile.TypeEnum.DOCKSTORESERVICETESTJSON,
      SourceFile.TypeEnum.GXFORMAT2TESTFILE,
      SourceFile.TypeEnum.SWLTESTJSON,
    ],
  };
  readonly fileTab4 = { tabName: 'Configuration', fileTypes: [SourceFile.TypeEnum.DOCKSTOREYML, SourceFile.TypeEnum.DOCKSTORESERVICEYML] };
  readonly fileTabsSchematic = [this.fileTab1, this.fileTab2, this.fileTab3, this.fileTab4];

  /**
   * Retrieve all source files for the given workflow version
   * @param workflowId
   * @param versionId
   */
  getSourceFiles(workflowId: number, versionId: number): Observable<SourceFile[]> {
    return this.workflowsService.getWorkflowVersionsSourcefiles(workflowId, versionId);
  }

  convertSourceFilesToFileTabs(sourcefiles: SourceFile[], mainDescriptorAbsolutePath: string):  Map<string, SourceFile[]> {
    let fileTabs = new Map<string, SourceFile[]>();
    // Always have the Descriptor Files Tab and Test Parameter Files tab
    fileTabs.set(this.fileTab2.tabName, []);
    fileTabs.set(this.fileTab3.tabName, []);
    if (!sourcefiles || sourcefiles.length === 0) {
      return fileTabs;
    }
    this.fileTabsSchematic.forEach(fileTab => {
      fileTab.fileTypes.forEach(fileType => {
        // Find all the files of the type that's not the main descriptor
        const sourceFilesMatchingType = sourcefiles.filter(sourcefile => sourcefile.type === fileType && sourcefile.absolutePath !== mainDescriptorAbsolutePath);
        // Find the file of the type that is the main descriptor 
        const mainDescriptorFile = sourcefiles.find(sourcefile => sourcefile.type === fileType && sourcefile.absolutePath === mainDescriptorAbsolutePath);
        if (mainDescriptorFile) {
          // Add main descriptor to the front of the array
          sourceFilesMatchingType.unshift(mainDescriptorFile);
        }
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
  getValidationMessage(sourcefiles: SourceFile[], version: WorkflowVersion): Map<string, string> {
    let validationMessage = null;
    version.validations.forEach((validation: Validation) => {
      const matchingSourcefile = sourcefiles.find(file => validation.type === file.type && !validation.valid);
      if (matchingSourcefile) {
          validationMessage = JSON.parse(validation.message);
        }
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
