import { Injectable } from '@angular/core';
import { DescriptorLanguageService } from '../entry/descriptor-language.service';
import { SourceFile, ToolDescriptor } from '../swagger';
import { FileCategory } from './code-editor-list.component';

/**
 * This service currently only handles CWL, WDL, NFL, and Galaxy. All plugin languages and SERVICE will not work correctly.
 *
 * @export
 * @class CodeEditorListService
 */
@Injectable({
  providedIn: 'root',
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
        return DescriptorLanguageService.toolDescriptorTypeEnumToExtendedDescriptorLanguageBean(
          descriptorType
        ).descriptorFileTypes.includes(sourcefileType);
      }
      case 'testParam': {
        return (
          DescriptorLanguageService.toolDescriptorTypeEnumToExtendedDescriptorLanguageBean(descriptorType).testParameterFileType ===
          sourcefileType
        );
      }
    }
  }

  /**
   * Determines whether the path is a primary descriptor.
   * This is kind of easy to break.
   * @static
   * @param {(string | null)} path
   * @returns {boolean}
   * @memberof CodeEditorListService
   */
  static isPrimaryDescriptor(path: string | null): boolean {
    if (!path) {
      return false;
    }
    const primaryDescriptors = DescriptorLanguageService.getDescriptorLanguagesDefaultDescriptorPaths();
    // CodeEditorListService.NEXTFLOW_PATH isn't currently in Nextflow.ts/extendedDescriptorLanguage
    primaryDescriptors.push(CodeEditorListService.NEXTFLOW_PATH);
    return primaryDescriptors.includes(path);
  }

  /**
   * Determines the SourceFile(s) to add. DescriptorType should be truthy even if it's a Dockerfile.
   *
   * @static
   * @param {(ToolDescriptor.TypeEnum | null | undefined)} descriptorType The descriptor type
   * @param {(FileCategory | null | undefined)} fileType The tab the user is currently on
   * @param {(SourceFile[] | null | undefined)} sourcefiles The existing sourcefiles
   * @returns {SourceFile[]}
   * @memberof CodeEditorListService
   */
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
      if (descriptorType === ToolDescriptor.TypeEnum.NFL) {
        const nextflowConfigFile = CodeEditorListService.createSourceFile(CodeEditorListService.NEXTFLOW_PATH, descriptorType, fileType);
        if (nextflowConfigFile) {
          CodeEditorListService.pushFileIfNotNull(filesToAdd, nextflowConfigFile);
        }
        CodeEditorListService.pushFileIfNotNull(
          filesToAdd,
          CodeEditorListService.createSourceFile(CodeEditorListService.NEXTFLOW_CONFIG_PATH, descriptorType, fileType)
        );
      } else {
        const defaultDescriptorPath = DescriptorLanguageService.toolDescriptorTypeEnumToDefaultDescriptorPath(descriptorType);
        if (defaultDescriptorPath) {
          CodeEditorListService.pushFileIfNotNull(
            filesToAdd,
            CodeEditorListService.createSourceFile(defaultDescriptorPath, descriptorType, fileType)
          );
        } else {
          CodeEditorListService.unhandledHostedWorkflowDescriptorType(descriptorType);
          CodeEditorListService.pushFileIfNotNull(
            filesToAdd,
            CodeEditorListService.createSourceFile('/Dockstore' + newFilePath, descriptorType, fileType)
          );
        }
      }
    } else if (!CodeEditorListService.hasPrimaryTestParam(descriptorType, sourcefiles) && fileType === 'testParam') {
      if (descriptorType === ToolDescriptor.TypeEnum.GXFORMAT2) {
        CodeEditorListService.pushFileIfNotNull(
          filesToAdd,
          CodeEditorListService.createSourceFile('/test.galaxy.json', descriptorType, fileType)
        );
      } else {
        CodeEditorListService.pushFileIfNotNull(
          filesToAdd,
          CodeEditorListService.createSourceFile('/test.' + descriptorType.toLowerCase() + newFilePath, descriptorType, fileType)
        );
      }
    } else {
      CodeEditorListService.pushFileIfNotNull(
        filesToAdd,
        CodeEditorListService.createSourceFile('/' + newFilePath, descriptorType, fileType)
      );
    }
    return filesToAdd;
  }

  /**
   * Handles when the sourcefile is falsey
   *
   * @private
   * @static
   * @param {SourceFile[]} filesToAdd
   * @param {(SourceFile | null | undefined)} sourcefile
   * @memberof CodeEditorListService
   */
  private static pushFileIfNotNull(filesToAdd: SourceFile[], sourcefile: SourceFile | null | undefined) {
    if (sourcefile) {
      filesToAdd.push(sourcefile);
    }
  }

  /**
   * Get the file type enum
   *
   * @private
   * @static
   * @param {string} filepath Path of the file
   * @param {ToolDescriptor.TypeEnum} descriptorType Descriptor type
   * @param {FileCategory} fileType Weird string denoting the file category
   * @returns {(SourceFile.TypeEnum | null)}
   * @memberof CodeEditorListService
   */
  private static getFileType(
    filepath: string,
    descriptorType: ToolDescriptor.TypeEnum,
    fileType: FileCategory
  ): SourceFile.TypeEnum | null {
    switch (fileType) {
      case 'descriptor': {
        if (descriptorType === ToolDescriptor.TypeEnum.NFL) {
          if (filepath === CodeEditorListService.NEXTFLOW_CONFIG_PATH) {
            return SourceFile.TypeEnum.NEXTFLOWCONFIG;
          } else {
            return SourceFile.TypeEnum.NEXTFLOW;
          }
        } else {
          const descriptorFileTypes =
            DescriptorLanguageService.toolDescriptorTypeEnumToExtendedDescriptorLanguageBean(descriptorType).descriptorFileTypes;
          if (descriptorFileTypes && descriptorFileTypes.length > 0) {
            return descriptorFileTypes[0];
          } else {
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

  /**
   * Create the bare minimum sourcefile to add
   *
   * @private
   * @static
   * @param {string} newFilePath
   * @param {ToolDescriptor.TypeEnum} descriptorType
   * @param {FileCategory} fileType
   * @returns {(SourceFile | null)}
   * @memberof CodeEditorListService
   */
  private static createSourceFile(newFilePath: string, descriptorType: ToolDescriptor.TypeEnum, fileType: FileCategory): SourceFile | null {
    const type = CodeEditorListService.getFileType(newFilePath, descriptorType, fileType);
    if (type) {
      return {
        // Absolute path is completely unused by the backend
        absolutePath: newFilePath,
        content: '',
        path: newFilePath,
        type: type,
      };
    } else {
      return null;
    }
  }

  /**
   * Get the default path extension
   *
   * @private
   * @static
   * @param {FileCategory} fileType Weird string denoting the type of file it is
   * @param {ToolDescriptor.TypeEnum} descriptorType The descriptor type (used when fileType is descriptor)
   * @returns {string} The default path extension
   * @memberof CodeEditorListService
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
   *
   * @private
   * @static
   * @param {string} path File path to look for
   * @param {Array<SourceFile>} sourcefiles Current sourcefiles
   * @returns {boolean} Whether a sourcefile with the path exists
   * @memberof CodeEditorListService
   */
  private static hasFilePath(path: string, sourcefiles: Array<SourceFile>): boolean {
    return sourcefiles.some((sourcefile) => sourcefile.path === path);
  }

  /**
   * Checks for the given descriptor type, does there already exist a primary test json
   *
   * @private
   * @static
   * @param {ToolDescriptor.TypeEnum} descriptorType
   * @param {SourceFile[]} sourcefiles
   * @returns {boolean} whether or not version has a primary test json
   * @memberof CodeEditorListService
   */
  private static hasPrimaryTestParam(descriptorType: ToolDescriptor.TypeEnum, sourcefiles: SourceFile[]): boolean {
    const pathToFind = 'test.' + descriptorType.toLowerCase() + '.json';
    return CodeEditorListService.hasFilePath(pathToFind, sourcefiles);
  }

  /**
   * Checks for the given descriptor type, does there already exist a primary descriptor
   *
   * @private
   * @static
   * @param {ToolDescriptor.TypeEnum} descriptorType
   * @param {SourceFile[]} sourcefiles
   * @returns {boolean} whether or not version has a primary descriptor
   * @memberof CodeEditorListService
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

  /**
   * This services doesn't support certain cases of descriptorTypes.
   * Logs it in a consistent way.
   *
   * @private
   * @static
   * @param {ToolDescriptor.TypeEnum} descriptorType
   * @memberof CodeEditorListService
   */
  private static unhandledHostedWorkflowDescriptorType(descriptorType: ToolDescriptor.TypeEnum) {
    console.error('Unhandled hosted workflow descriptor type: ' + descriptorType);
  }
}
