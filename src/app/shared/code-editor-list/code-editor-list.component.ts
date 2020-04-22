import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { DescriptorLanguageService } from '../entry/descriptor-language.service';
import { WorkflowQuery } from '../state/workflow.query';
import { Validation } from '../swagger';
import { ToolDescriptor } from './../../shared/swagger/model/toolDescriptor';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';

@Component({
  selector: 'app-code-editor-list',
  templateUrl: './code-editor-list.component.html',
  styleUrls: ['./code-editor-list.component.scss']
})
export class CodeEditorListComponent {
  @Input() sourcefiles: Array<any>;
  @Input() editing: boolean;
  @Input() fileType: string;
  @Input() descriptorType: ToolDescriptor.TypeEnum;
  @Input() entryType: string;
  @Input() entrypath: string;
  @Input() selectedVersion: WorkflowVersion;
  protected published$: Observable<boolean>;
  public downloadFilePath: string;
  NEXTFLOW_CONFIG_PATH = '/nextflow.config';
  NEXTFLOW_PATH = '/main.nf';
  public DescriptorType = ToolDescriptor.TypeEnum;

  constructor(private workflowQuery: WorkflowQuery) {
    this.published$ = this.workflowQuery.workflowIsPublished$;
  }

  /**
   * Adds a new file editor
   */
  addFile() {
    const descriptorType = this.descriptorType;
    const filesToAdd = [];
    const newFilePath = this.getDefaultPath();
    if (!this.hasPrimaryDescriptor() && this.fileType === 'descriptor') {
      switch (descriptorType) {
        case ToolDescriptor.TypeEnum.NFL: {
          filesToAdd.push(this.createFileObject(this.NEXTFLOW_PATH));
          filesToAdd.push(this.createFileObject(this.NEXTFLOW_CONFIG_PATH));
          break;
        }
        case ToolDescriptor.TypeEnum.CWL:
        case ToolDescriptor.TypeEnum.WDL:
        case ToolDescriptor.TypeEnum.GXFORMAT2: {
          const defaultDescriptorPath = DescriptorLanguageService.toolDescriptorTypeEnumToDefaultDescriptorPath(descriptorType);
          filesToAdd.push(this.createFileObject(defaultDescriptorPath));
          break;
        }
        default: {
          console.log('Possibly unsupported hosted workflow language: ' + descriptorType);
          filesToAdd.push(this.createFileObject('/Dockstore' + newFilePath));
        }
      }
    } else if (!this.hasPrimaryTestParam() && this.fileType === 'testParam') {
      if (descriptorType === ToolDescriptor.TypeEnum.GXFORMAT2) {
        filesToAdd.push(this.createFileObject('/test.galaxy.json'));
      } else {
        filesToAdd.push(this.createFileObject('/test.' + descriptorType.toLowerCase() + newFilePath));
      }
    } else {
      filesToAdd.push(this.createFileObject('/' + newFilePath));
    }

    if (this.sourcefiles === undefined) {
      this.sourcefiles = [];
    }
    filesToAdd.forEach(file => {
      this.sourcefiles.push(file);
    });
  }

  createFileObject(newFilePath) {
    return {
      content: '',
      path: newFilePath,
      type: this.getFileType(newFilePath)
    };
  }

  /**
   * Deletes the file at the given index by setting content to null.
   * If it is a new file being deleted (not from previous version) then just remove from the list
   * @param  index index of file to delete
   */
  deleteFile(index: number) {
    this.sourcefiles[index].content = null;
    if (this.sourcefiles[index].id === undefined || this.sourcefiles[index].id === null) {
      this.sourcefiles.splice(index, 1);
    }
  }

  /**
   * Get the file type enum
   * @return {string} The file type enum
   */
  getFileType(filepath) {
    if (this.fileType === 'descriptor') {
      if (this.descriptorType) {
        if (this.descriptorType === ToolDescriptor.TypeEnum.NFL) {
          if (filepath === this.NEXTFLOW_CONFIG_PATH) {
            return 'NEXTFLOW_CONFIG';
          } else {
            return 'NEXTFLOW';
          }
        } else {
          return 'DOCKSTORE_' + this.descriptorType;
        }
      } else {
        return 'DOCKSTORE_CWL';
      }
    } else if (this.fileType === 'testParam') {
      if (this.descriptorType) {
        return DescriptorLanguageService.toolDescriptorTypeEnumTotestParameterFileType(this.descriptorType);
      } else {
        return 'CWL_TEST_JSON';
      }
    } else if (this.fileType === 'dockerfile') {
      return 'DOCKERFILE';
    } else {
      return null;
    }
  }

  /**
   * Get the default path extension
   * @return {string}the default path extension
   */
  getDefaultPath() {
    if (this.fileType === 'descriptor') {
      if (this.descriptorType) {
        if (this.descriptorType === this.DescriptorType.NFL) {
          return '.nf';
        } else {
          return '.' + this.descriptorType.toLowerCase();
        }
      } else {
        return '.cwl';
      }
    } else if (this.fileType === 'testParam') {
      return '.json';
    } else if (this.fileType === 'dockerfile') {
      return 'Dockerfile';
    }
  }

  /**
   * Returns true if path is the primary descriptor, false otherwise
   * @param  path Path to check
   * @return {boolean}      Is path for primary descriptor
   */
  isPrimaryDescriptor(path: string): boolean {
    return path === '/Dockstore.cwl' || path === '/Dockstore.wdl' || path === this.NEXTFLOW_CONFIG_PATH || path === this.NEXTFLOW_PATH;
  }

  /**
   * Returns true if path is the dockerfile, false otherwise
   * @param  path Path to check
   * @return {boolean}      Is path for dockerfile
   */
  isDockerFile(path: string): boolean {
    return path === '/Dockerfile';
  }

  /**
   * TODO: Fix this execution of this function.  This function is being executed a bajillion times
   * Determines whether to show the current sourcefile based on the descriptor type and tab
   * @param  type sourcefile type
   * @return {boolean}      whether or not to show file
   */
  showSourcefile(type: string): boolean {
    if (type === null || type === undefined) {
      return true;
    } else if (this.fileType === 'dockerfile') {
      return true;
    } else if (this.fileType === 'descriptor') {
      return (
        (this.descriptorType === ToolDescriptor.TypeEnum.CWL && type === 'DOCKSTORE_CWL') ||
        (this.descriptorType === ToolDescriptor.TypeEnum.WDL && type === 'DOCKSTORE_WDL') ||
        (this.descriptorType === ToolDescriptor.TypeEnum.NFL && (type === 'NEXTFLOW' || type === 'NEXTFLOW_CONFIG')) ||
        (this.descriptorType === ToolDescriptor.TypeEnum.GXFORMAT2 && type === Validation.TypeEnum.DOCKSTOREGXFORMAT2)
      );
    } else if (this.fileType === 'testParam') {
      return (
        (this.descriptorType === ToolDescriptor.TypeEnum.CWL && type === 'CWL_TEST_JSON') ||
        (this.descriptorType === ToolDescriptor.TypeEnum.WDL && type === 'WDL_TEST_JSON') ||
        (this.descriptorType === ToolDescriptor.TypeEnum.NFL && type === 'NEXTFLOW_TEST_PARAMS') ||
        (this.descriptorType === ToolDescriptor.TypeEnum.GXFORMAT2 && type === Validation.TypeEnum.GXFORMAT2TESTFILE)
      );
    } else {
      return true;
    }
  }

  /**
   * Checks for the given descriptor type, does there already exist a primary descriptor
   * @return {boolean} whether or not version has a primary descriptor
   */
  hasPrimaryDescriptor(): boolean {
    if (this.descriptorType === null || this.descriptorType === undefined) {
      return false;
    }

    const pathToFind = '/Dockstore.' + this.descriptorType.toLowerCase();
    if (this.descriptorType === ToolDescriptor.TypeEnum.NFL) {
      return this.hasFilePath(this.NEXTFLOW_PATH) && this.hasFilePath(this.NEXTFLOW_CONFIG_PATH);
    }
    return this.hasFilePath(pathToFind);
  }

  /**
   * Checks for the given descriptor type, does there already exist a primary test json
   * @return {boolean} whether or not version has a primary test json
   */
  hasPrimaryTestParam(): boolean {
    if (this.descriptorType === null || this.descriptorType === undefined) {
      return false;
    }
    const pathToFind = 'test.' + this.descriptorType.toLowerCase() + '.json';
    return this.hasFilePath(pathToFind);
  }

  /**
   * Determines if there exists a sourcefile with the given file path
   * @param  path File path to look for
   * @return {boolean}      Whether a sourcefile with the path exists
   */
  hasFilePath(path: string): boolean {
    for (const sourcefile of this.sourcefiles) {
      if (sourcefile.path === path) {
        return true;
      }
    }
    return false;
  }
}
