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
  @Input() descriptorType: string;
  @Input() fileType: string;
  constructor() { }

  /**
   * Adds a new file editor
   */
  addFile() {
    let newFilePath = this.getDefaultPath();
    if (this.sourcefiles.length === 0 && this.fileType === 'descriptor') {
      newFilePath = '/Dockstore' + newFilePath;
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
   * @return {string}      Is path for primary descriptor
   */
  isPrimaryDescriptor(path: string) {
    return path === '/Dockstore.cwl' || path === '/Dockstore.wdl';
  }

  /**
   * Returns true if path is the dockerfile, false otherwise
   * @param  path Path to check
   * @return {string}      Is path for dockerfile
   */
  isDockerFile(path: string) {
    return path === '/Dockerfile';
  }
}
