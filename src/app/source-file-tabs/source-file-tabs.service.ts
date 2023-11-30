import { Injectable } from '@angular/core';
import { DescriptorTypeCompatService } from 'app/shared/descriptor-type-compat.service';
import { DescriptorLanguageService } from 'app/shared/entry/descriptor-language.service';
import { FileService } from 'app/shared/file.service';
import {
  SourceFile,
  ToolDescriptor,
  WorkflowsService,
  WorkflowVersion,
  BioWorkflow,
  Notebook,
  Service,
  Validation,
} from 'app/shared/openapi';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SourceFileTabsService {
  constructor(
    private workflowsService: WorkflowsService,
    private fileService: FileService,
    private descriptorTypeCompatService: DescriptorTypeCompatService,
    private descriptorLanguageService: DescriptorLanguageService
  ) {}

  /**
   * Retrieve all source files for the given workflow version
   * @param workflowId
   * @param versionId
   */
  getSourceFiles(workflowId: number, versionId: number): Observable<SourceFile[]> {
    return this.workflowsService.getWorkflowVersionsSourcefiles(workflowId, versionId);
  }

  convertSourceFilesToFileTabs(
    sourcefiles: SourceFile[],
    mainDescriptorAbsolutePath: string,
    descriptorLanguage: ToolDescriptor.TypeEnum
  ): Map<string, SourceFile[]> {
    let fileTabs = new Map<string, SourceFile[]>();
    const fileTabsSchematic =
      this.descriptorLanguageService.toolDescriptorTypeEnumToExtendedDescriptorLanguageBean(descriptorLanguage).fileTabs;

    // Display all of the tabs, even if they are empty.
    fileTabsSchematic.forEach((fileTab) => {
      fileTabs.set(fileTab.tabName, []);
    });
    if (!sourcefiles || sourcefiles.length === 0) {
      return fileTabs;
    }
    fileTabsSchematic.forEach((fileTab) => {
      fileTab.fileTypes.forEach((fileType) => {
        // Find all the files of the type that's not the main descriptor
        const sourceFilesMatchingType = sourcefiles.filter(
          (sourcefile) => sourcefile.type === fileType && sourcefile.absolutePath !== mainDescriptorAbsolutePath
        );
        // Find the file of the type that is the main descriptor
        const mainDescriptorFile = sourcefiles.find(
          (sourcefile) => sourcefile.type === fileType && sourcefile.absolutePath === mainDescriptorAbsolutePath
        );
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
      const matchingSourcefile = sourcefiles.find((file) => validation.type === file.type && !validation.valid);
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
  getDescriptorPath(
    entry: BioWorkflow | Service | Notebook,
    descriptorType: ToolDescriptor.TypeEnum,
    versionName: string,
    relativePath: string
  ): string {
    const type = this.descriptorTypeCompatService.toolDescriptorTypeEnumToPlainTRS(descriptorType);
    if (type === null) {
      return null;
    }
    const fileId = entry.full_workflow_path;
    const id = entry.entryTypeMetadata.trsPrefix + fileId;
    return this.fileService.getDownloadFilePath(id, versionName, type, relativePath);
  }
}
