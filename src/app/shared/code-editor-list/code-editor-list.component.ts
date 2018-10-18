import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { WorkflowQuery } from '../state/workflow.query';
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
  @Input() descriptorType: string;
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
    const filesToAdd = [];
    const newFilePath = this.getDefaultPath();
    if (!this.hasPrimaryDescriptor() && this.fileType === 'descriptor') {
      if (this.descriptorType === this.DescriptorType.NFL.toLowerCase()) {
        filesToAdd.push(this.createFileObject(this.NEXTFLOW_PATH));
        filesToAdd.push(this.createFileObject(this.NEXTFLOW_CONFIG_PATH));
      } else {
        filesToAdd.push(this.createFileObject('/Dockstore' + newFilePath));
      }
    } else if (!this.hasPrimaryTestParam() && this.fileType === 'testParam') {
      filesToAdd.push(this.createFileObject('test.' + this.descriptorType + newFilePath));
    } else {
      filesToAdd.push(this.createFileObject(newFilePath));
    }

    if (this.sourcefiles === undefined) {
      this.sourcefiles = [];
    }
    filesToAdd.forEach((file) => {
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
   * Deletes the file at the given index
   * @param  index index of file to delete
   */
  deleteFile(index: number) {
    this.sourcefiles[index].content = null;
  }

  /**
   * Get the file type enum
   * @return {string} The file type enum
   */
  getFileType(filepath) {
    if (this.fileType === 'descriptor') {
      if (this.descriptorType) {
        if (this.descriptorType === this.DescriptorType.NFL.toLowerCase()) {
          if (filepath === this.NEXTFLOW_CONFIG_PATH) {
            return 'NEXTFLOW_CONFIG';
          } else {
            return 'NEXTFLOW';
          }
        } else {
          return 'DOCKSTORE_' + this.descriptorType.toUpperCase();
        }
      } else {
        return 'DOCKSTORE_CWL';
      }
    } else if (this.fileType === 'testParam') {
      if (this.descriptorType) {
        if (this.descriptorType === this.DescriptorType.NFL.toLowerCase()) {
          return 'NEXTFLOW_TEST_PARAMS';
        } else {
          return this.descriptorType.toUpperCase() + '_TEST_JSON';
        }
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
        if (this.descriptorType === this.DescriptorType.NFL.toLowerCase()) {
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
      return '/Dockerfile';
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
      return (this.descriptorType === 'cwl' && type === 'DOCKSTORE_CWL') || (this.descriptorType === 'wdl' && type === 'DOCKSTORE_WDL')
        || (this.descriptorType === 'nfl' && (type === 'NEXTFLOW' || type === 'NEXTFLOW_CONFIG'));
    } else if (this.fileType === 'testParam') {
      return (this.descriptorType === 'cwl' && type === 'CWL_TEST_JSON') || (this.descriptorType === 'wdl' && type === 'WDL_TEST_JSON')
        || (this.descriptorType === 'nfl' && type === 'NEXTFLOW_TEST_PARAMS');
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

    const pathToFind = '/Dockstore.' + this.descriptorType;
    if (this.descriptorType === this.DescriptorType.NFL.toLowerCase()) {
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
    const pathToFind = 'test.' + this.descriptorType + '.json';
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
