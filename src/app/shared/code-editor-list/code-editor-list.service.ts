import { Injectable } from '@angular/core';
import { DescriptorLanguageService } from '../entry/descriptor-language.service';
import { SourceFile, ToolDescriptor, Validation } from '../swagger';
import { FileCategory } from './code-editor-list.component';

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
    fileCategory: FileCategory,
    descriptorType: ToolDescriptor.TypeEnum
  ): boolean {
    if (sourcefileType === null || sourcefileType === undefined) {
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
      default: {
        console.error('Unrecognized fileCategory: ' + fileCategory);
        return true;
      }
    }
  }

  static isPrimaryDescriptor(path: string): boolean {
    const primaryDescriptors = [
      '/Dockstore.cwl',
      '/Dockstore.wdl',
      CodeEditorListService.NEXTFLOW_CONFIG_PATH,
      CodeEditorListService.NEXTFLOW_PATH
    ];
    return primaryDescriptors.includes(path);
  }

  static determineFilesToAdd(descriptorType: ToolDescriptor.TypeEnum, fileType: FileCategory, sourcefiles: SourceFile[]): SourceFile[] {
    const filesToAdd = [];
    const newFilePath = CodeEditorListService.getDefaultPath(fileType, descriptorType);
    if (!CodeEditorListService.hasPrimaryDescriptor(descriptorType, sourcefiles) && fileType === 'descriptor') {
      switch (descriptorType) {
        case ToolDescriptor.TypeEnum.NFL: {
          filesToAdd.push(CodeEditorListService.createFileObject(CodeEditorListService.NEXTFLOW_PATH, descriptorType, fileType));
          filesToAdd.push(CodeEditorListService.createFileObject(CodeEditorListService.NEXTFLOW_CONFIG_PATH, descriptorType, fileType));
          break;
        }
        case ToolDescriptor.TypeEnum.CWL:
        case ToolDescriptor.TypeEnum.WDL:
        case ToolDescriptor.TypeEnum.GXFORMAT2: {
          const defaultDescriptorPath = DescriptorLanguageService.toolDescriptorTypeEnumToDefaultDescriptorPath(descriptorType);
          filesToAdd.push(CodeEditorListService.createFileObject(defaultDescriptorPath, descriptorType, fileType));
          break;
        }
        default: {
          console.log('Possibly unsupported hosted workflow language: ' + descriptorType);
          filesToAdd.push(CodeEditorListService.createFileObject('/Dockstore' + newFilePath, descriptorType, fileType));
        }
      }
    } else if (!CodeEditorListService.hasPrimaryTestParam(descriptorType, sourcefiles) && fileType === 'testParam') {
      if (descriptorType === ToolDescriptor.TypeEnum.GXFORMAT2) {
        filesToAdd.push(CodeEditorListService.createFileObject('/test.galaxy.json', descriptorType, fileType));
      } else {
        filesToAdd.push(
          CodeEditorListService.createFileObject('/test.' + descriptorType.toLowerCase() + newFilePath, descriptorType, fileType)
        );
      }
    } else {
      filesToAdd.push(CodeEditorListService.createFileObject('/' + newFilePath, descriptorType, fileType));
    }
    return filesToAdd;
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
  private static getFileType(filepath: string, descriptorType: ToolDescriptor.TypeEnum, fileType: FileCategory): SourceFile.TypeEnum {
    switch (fileType) {
      case 'descriptor': {
        if (descriptorType) {
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
                // Defaulting to CWL for some reason
                return SourceFile.TypeEnum.DOCKSTORECWL;
              }
            }
            default: {
              // Defaulting to CWL for some reason
              return SourceFile.TypeEnum.DOCKSTORECWL;
            }
          }
        } else {
          return SourceFile.TypeEnum.DOCKSTORECWL;
        }
      }
      case 'testParam': {
        if (descriptorType) {
          return DescriptorLanguageService.toolDescriptorTypeEnumTotestParameterFileType(descriptorType);
        } else {
          // Defaulting to CWL for some reason
          return SourceFile.TypeEnum.DOCKSTORECWL;
        }
      }
      case 'dockerfile': {
        return SourceFile.TypeEnum.DOCKERFILE;
      }
    }
  }
  private static createFileObject(newFilePath: string, descriptorType: ToolDescriptor.TypeEnum, fileType: FileCategory): SourceFile {
    return {
      absolutePath: newFilePath,
      content: '',
      path: newFilePath,
      type: CodeEditorListService.getFileType(newFilePath, descriptorType, fileType)
    };
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
        if (descriptorType) {
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
        } else {
          console.error('No descriptor type. How odd');
          return '.cwl';
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
    if (descriptorType === null || descriptorType === undefined) {
      return false;
    }
    const pathToFind = 'test.' + descriptorType.toLowerCase() + '.json';
    return CodeEditorListService.hasFilePath(pathToFind, sourcefiles);
  }

  /**
   * Checks for the given descriptor type, does there already exist a primary descriptor
   * @return {boolean} whether or not version has a primary descriptor
   */
  private static hasPrimaryDescriptor(descriptorType: ToolDescriptor.TypeEnum, sourcefiles: SourceFile[]): boolean {
    if (descriptorType === null || descriptorType === undefined) {
      return false;
    }

    const pathToFind = '/Dockstore.' + descriptorType.toLowerCase();
    if (descriptorType === ToolDescriptor.TypeEnum.NFL) {
      return (
        CodeEditorListService.hasFilePath(CodeEditorListService.NEXTFLOW_PATH, sourcefiles) &&
        CodeEditorListService.hasFilePath(CodeEditorListService.NEXTFLOW_CONFIG_PATH, sourcefiles)
      );
    }
    return CodeEditorListService.hasFilePath(pathToFind, sourcefiles);
  }
}
