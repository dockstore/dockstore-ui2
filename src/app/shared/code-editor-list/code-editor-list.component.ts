import { Component, Input } from '@angular/core';
import { SourceFile } from '../../shared/swagger/model/sourceFile';

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
  constructor() { }

  /**
   * Adds a new file editor
   */
  addFile() {
    let newFilePath = this.getDefaultPath();
    if (!this.hasPrimaryDescriptor() && this.fileType === 'descriptor') {
      newFilePath = '/Dockstore' + newFilePath;
    } else if (!this.hasPrimaryTestParam() && this.fileType === 'testParam') {
      newFilePath = 'test.' + this.descriptorType + newFilePath;
    }
    const newSourceFile = {
      content: '',
      path: newFilePath,
      type: this.getFileType()
    };

    if (this.sourcefiles === undefined) {
      this.sourcefiles = [];
    }
    this.sourcefiles.push(newSourceFile);
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
  getFileType() {
    if (this.fileType === 'descriptor') {
      if (this.descriptorType) {
        return 'DOCKSTORE_' + this.descriptorType.toUpperCase();
      } else {
        return 'DOCKSTORE_CWL';
      }
    } else if (this.fileType === 'testParam') {
      if (this.descriptorType) {
        return this.descriptorType.toUpperCase() + '_TEST_JSON';
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
        return '.' + this.descriptorType.toLowerCase();
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
    return path === '/Dockstore.cwl' || path === '/Dockstore.wdl';
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
      return (this.descriptorType === 'cwl' && type === 'DOCKSTORE_CWL') || (this.descriptorType === 'wdl' && type === 'DOCKSTORE_WDL');
    } else if (this.fileType === 'testParam') {
      return (this.descriptorType === 'cwl' && type === 'CWL_TEST_JSON') || (this.descriptorType === 'wdl' && type === 'WDL_TEST_JSON');
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
