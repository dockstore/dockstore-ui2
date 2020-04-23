import { Injectable } from '@angular/core';
import { DescriptorLanguageService } from '../entry/descriptor-language.service';
import { SourceFile, ToolDescriptor, Validation } from '../swagger';
import { FileCategory } from './code-editor-list.component';

/**
 * This service currently only handles CWL, WDL, NFL, and Galaxy. All plugin languages and SERVICE will not work correctly.
 *
 * @export
 * @class CodeEditorListService
 */
@Injectable({
  providedIn: 'root'
})
export class CodeEditorListService {
  static readonly NEXTFLOW_CONFIG_PATH = '/nextflow.config';
  static readonly NEXTFLOW_PATH = '/main.nf';
  constructor() {}
  /**
   * Determines whether to show the current sourcefile based on the descriptor type and tab
   *
   * @static
   * @param {(SourceFile.TypeEnum | null | undefined)} sourcefileType
   * @param {FileCategory} fileCategory
   * @param {ToolDescriptor.TypeEnum} descriptorType
   * @returns {boolean} Whether to show sourcefile or not
   * @memberof CodeEditorListService
   */
  static showSourcefile(
    sourcefileType: SourceFile.TypeEnum | null | undefined,
    fileCategory: FileCategory | null | undefined,
    descriptorType: ToolDescriptor.TypeEnum | null | undefined
  ): boolean {
    if (!sourcefileType || !fileCategory || !descriptorType) {
      return true;
    }
    switch (fileCategory) {
      case 'dockerfile': {
        return true;
      }
      case 'descriptor': {
        return (
          (descriptorType === ToolDescriptor.TypeEnum.CWL && sourcefileType === SourceFile.TypeEnum.DOCKSTORECWL) ||
          (descriptorType === ToolDescriptor.TypeEnum.WDL && sourcefileType === SourceFile.TypeEnum.DOCKSTOREWDL) ||
          (descriptorType === ToolDescriptor.TypeEnum.NFL &&
            (sourcefileType === SourceFile.TypeEnum.NEXTFLOW || sourcefileType === SourceFile.TypeEnum.NEXTFLOWCONFIG)) ||
          (descriptorType === ToolDescriptor.TypeEnum.GXFORMAT2 && sourcefileType === Validation.TypeEnum.DOCKSTOREGXFORMAT2)
        );
      }
      case 'testParam': {
        return (
          (descriptorType === ToolDescriptor.TypeEnum.CWL && sourcefileType === SourceFile.TypeEnum.CWLTESTJSON) ||
          (descriptorType === ToolDescriptor.TypeEnum.WDL && sourcefileType === SourceFile.TypeEnum.WDLTESTJSON) ||
          (descriptorType === ToolDescriptor.TypeEnum.NFL && sourcefileType === SourceFile.TypeEnum.NEXTFLOWTESTPARAMS) ||
          (descriptorType === ToolDescriptor.TypeEnum.GXFORMAT2 && sourcefileType === Validation.TypeEnum.GXFORMAT2TESTFILE)
        );
      }
    }
  }

  static isPrimaryDescriptor(path: string | null): boolean {
    if (!path) {
      return false;
    }
    const primaryDescriptors = [
      '/Dockstore.cwl',
      '/Dockstore.wdl',
      CodeEditorListService.NEXTFLOW_CONFIG_PATH,
      CodeEditorListService.NEXTFLOW_PATH
    ];
    return primaryDescriptors.includes(path);
  }

  static determineFilesToAdd(
    descriptorType: ToolDescriptor.TypeEnum | null | undefined,
    fileType: FileCategory | null | undefined,
    sourcefiles: SourceFile[] | null | undefined
  ): SourceFile[] {
    if (!descriptorType || !fileType || !sourcefiles) {
      return [];
    }
    const filesToAdd: SourceFile[] = [];
    const newFilePath = CodeEditorListService.getDefaultPath(fileType, descriptorType);
    if (!CodeEditorListService.hasPrimaryDescriptor(descriptorType, sourcefiles) && fileType === 'descriptor') {
      switch (descriptorType) {
        case ToolDescriptor.TypeEnum.NFL: {
          const nextflowConfigFile = CodeEditorListService.createFileObject(CodeEditorListService.NEXTFLOW_PATH, descriptorType, fileType);
          if (nextflowConfigFile) {
            CodeEditorListService.pushFileIfNotNull(filesToAdd, nextflowConfigFile);
          }
          CodeEditorListService.pushFileIfNotNull(
            filesToAdd,
            CodeEditorListService.createFileObject(CodeEditorListService.NEXTFLOW_CONFIG_PATH, descriptorType, fileType)
          );
          break;
        }
        case ToolDescriptor.TypeEnum.CWL:
        case ToolDescriptor.TypeEnum.WDL:
        case ToolDescriptor.TypeEnum.GXFORMAT2: {
          const defaultDescriptorPath = DescriptorLanguageService.toolDescriptorTypeEnumToDefaultDescriptorPath(descriptorType);
          if (defaultDescriptorPath) {
            CodeEditorListService.pushFileIfNotNull(
              filesToAdd,
              CodeEditorListService.createFileObject(defaultDescriptorPath, descriptorType, fileType)
            );
          }
          break;
        }
        default: {
          CodeEditorListService.unhandledHostedWorkflowDescriptorType(descriptorType);
          CodeEditorListService.pushFileIfNotNull(
            filesToAdd,
            CodeEditorListService.createFileObject('/Dockstore' + newFilePath, descriptorType, fileType)
          );
        }
      }
    } else if (!CodeEditorListService.hasPrimaryTestParam(descriptorType, sourcefiles) && fileType === 'testParam') {
      if (descriptorType === ToolDescriptor.TypeEnum.GXFORMAT2) {
        CodeEditorListService.pushFileIfNotNull(
          filesToAdd,
          CodeEditorListService.createFileObject('/test.galaxy.json', descriptorType, fileType)
        );
      } else {
        CodeEditorListService.pushFileIfNotNull(
          filesToAdd,
          CodeEditorListService.createFileObject('/test.' + descriptorType.toLowerCase() + newFilePath, descriptorType, fileType)
        );
      }
    } else {
      CodeEditorListService.pushFileIfNotNull(
        filesToAdd,
        CodeEditorListService.createFileObject('/' + newFilePath, descriptorType, fileType)
      );
    }
    return filesToAdd;
  }

  private static pushFileIfNotNull(filesToAdd: SourceFile[], sourcefile: SourceFile | null) {
    if (sourcefile) {
      filesToAdd.push(sourcefile);
    }
  }

  /**
   * Get the file type enum
   * TODO: Actually return an enum
   * @param {string} filepath Path of the file
   * @param {ToolDescriptor.TypeEnum} descriptorType Descriptor Type
   * @param {string} fileType Weird string denoting the type of file it is
   * @returns
   * @memberof CodeEditorListComponent
   */
  private static getFileType(
    filepath: string,
    descriptorType: ToolDescriptor.TypeEnum,
    fileType: FileCategory
  ): SourceFile.TypeEnum | null {
    switch (fileType) {
      case 'descriptor': {
        switch (descriptorType) {
          case ToolDescriptor.TypeEnum.NFL: {
            if (filepath === CodeEditorListService.NEXTFLOW_CONFIG_PATH) {
              return SourceFile.TypeEnum.NEXTFLOWCONFIG;
            } else {
              return SourceFile.TypeEnum.NEXTFLOW;
            }
          }
          case ToolDescriptor.TypeEnum.CWL:
          case ToolDescriptor.TypeEnum.WDL:
          case ToolDescriptor.TypeEnum.GXFORMAT2: {
            const descriptorFileTypes = DescriptorLanguageService.toolDescriptorTypeEnumToExtendedDescriptorLanguageBean(descriptorType)
              .descriptorFileTypes;
            if (descriptorFileTypes && descriptorFileTypes.length > 0) {
              return descriptorFileTypes[0];
            } else {
              CodeEditorListService.unhandledHostedWorkflowDescriptorType(descriptorType);
              // Defaulting to CWL for some reason
              return SourceFile.TypeEnum.DOCKSTORECWL;
            }
          }
          default: {
            CodeEditorListService.unhandledHostedWorkflowDescriptorType(descriptorType);
            // Defaulting to CWL for some reason
            return SourceFile.TypeEnum.DOCKSTORECWL;
          }
        }
      }
      case 'testParam': {
        return DescriptorLanguageService.toolDescriptorTypeEnumTotestParameterFileType(descriptorType);
      }
      case 'dockerfile': {
        return SourceFile.TypeEnum.DOCKERFILE;
      }
    }
  }
  private static createFileObject(newFilePath: string, descriptorType: ToolDescriptor.TypeEnum, fileType: FileCategory): SourceFile | null {
    const type = CodeEditorListService.getFileType(newFilePath, descriptorType, fileType);
    if (type) {
      return {
        absolutePath: newFilePath,
        content: '',
        path: newFilePath,
        type: type
      };
    } else {
      return null;
    }
  }

  /**
   * Get the default path extension
   *
   * @static
   * @param {FileCategory} fileType Weird string denoting the type of file it is
   * @param {ToolDescriptor.TypeEnum} descriptorType  The descriptor type (used when fileType is descriptor)
   * @returns The default path extension
   * @memberof CodeEditorListComponent
   */
  private static getDefaultPath(fileType: FileCategory, descriptorType: ToolDescriptor.TypeEnum): string {
    switch (fileType) {
      case 'descriptor': {
        switch (descriptorType) {
          case ToolDescriptor.TypeEnum.NFL: {
            return '.nf';
          }
          case ToolDescriptor.TypeEnum.GXFORMAT2: {
            return '.yml';
          }
          default: {
            return '.' + descriptorType.toLowerCase();
          }
        }
      }
      case 'testParam': {
        return '.json';
      }
      case 'dockerfile': {
        return 'Dockerfile';
      }
    }
  }

  /**
   * Determines if there exists a sourcefile with the given file path
   * @param  path File path to look for
   * @return {boolean}      Whether a sourcefile with the path exists
   */
  private static hasFilePath(path: string, sourcefiles: Array<SourceFile>): boolean {
    for (const sourcefile of sourcefiles) {
      if (sourcefile.path === path) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks for the given descriptor type, does there already exist a primary test json
   * @return {boolean} whether or not version has a primary test json
   */
  private static hasPrimaryTestParam(descriptorType: ToolDescriptor.TypeEnum, sourcefiles: SourceFile[]): boolean {
    const pathToFind = 'test.' + descriptorType.toLowerCase() + '.json';
    return CodeEditorListService.hasFilePath(pathToFind, sourcefiles);
  }

  /**
   * Checks for the given descriptor type, does there already exist a primary descriptor
   * @return {boolean} whether or not version has a primary descriptor
   */
  private static hasPrimaryDescriptor(descriptorType: ToolDescriptor.TypeEnum, sourcefiles: SourceFile[]): boolean {
    const pathToFind = '/Dockstore.' + descriptorType.toLowerCase();
    switch (descriptorType) {
      case ToolDescriptor.TypeEnum.NFL: {
        return (
          CodeEditorListService.hasFilePath(CodeEditorListService.NEXTFLOW_PATH, sourcefiles) &&
          CodeEditorListService.hasFilePath(CodeEditorListService.NEXTFLOW_CONFIG_PATH, sourcefiles)
        );
      }
      case ToolDescriptor.TypeEnum.GXFORMAT2: {
        return CodeEditorListService.hasFilePath('/Dockstore.yml', sourcefiles);
      }
      default: {
        return CodeEditorListService.hasFilePath(pathToFind, sourcefiles);
      }
    }
  }

  private static unhandledHostedWorkflowDescriptorType(descriptorType: ToolDescriptor.TypeEnum) {
    console.error('Unhandled hosted workflow descriptor type: ' + descriptorType);
  }
}
