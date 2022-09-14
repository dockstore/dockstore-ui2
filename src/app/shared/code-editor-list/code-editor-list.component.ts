import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { WorkflowQuery } from '../state/workflow.query';
import { SourceFile } from '../swagger';
import { ToolDescriptor } from './../../shared/swagger/model/toolDescriptor';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';
import { CodeEditorListService } from './code-editor-list.service';
import { FileService } from 'app/shared/file.service';

export type FileCategory = 'descriptor' | 'dockerfile' | 'testParam';

@Component({
  selector: 'app-code-editor-list',
  templateUrl: './code-editor-list.component.html',
  styleUrls: ['./code-editor-list.component.scss'],
})
export class CodeEditorListComponent {
  @Input() sourcefiles: SourceFile[];
  @Input() editing: boolean;
  @Input() fileType: FileCategory;
  @Input() descriptorType: ToolDescriptor.TypeEnum;
  @Input() entryType: string;
  @Input() entrypath: string;
  @Input() selectedVersion: WorkflowVersion;
  protected published$: Observable<boolean>;
  public downloadFilePath: string;
  public DescriptorType = ToolDescriptor.TypeEnum;

  constructor(
    private fileService: FileService,
    private workflowQuery: WorkflowQuery,
    private codeEditorListService: CodeEditorListService
  ) {
    this.published$ = this.workflowQuery.workflowIsPublished$;
  }

  /**
   * Adds a new file editor
   */
  addFile() {
    let descriptorType = this.descriptorType;
    // determineFilesToAdd gets really confusing when it needs to handle a falsey descriptorType, setting it here (no end effect)
    if (this.fileType === 'dockerfile') {
      descriptorType = ToolDescriptor.TypeEnum.CWL;
    }
    const filesToAdd = this.codeEditorListService.determineFilesToAdd(descriptorType, this.fileType, this.sourcefiles);
    if (this.sourcefiles === undefined) {
      this.sourcefiles = [];
    }
    filesToAdd.forEach((file) => {
      this.sourcefiles.push(file);
    });
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
   * TODO: Fix the execution of this function.  This function is being executed a bajillion times.
   * Returns true if path is the primary descriptor, false otherwise
   *
   * @param {string} path Path to check
   * @returns {boolean} Is path for primary descriptor
   * @memberof CodeEditorListComponent
   */
  isPrimaryDescriptor(path: string): boolean {
    return this.fileType === 'descriptor' && this.codeEditorListService.isPrimaryDescriptor(path);
  }

  /**
   * TODO: Fix the execution of this function.  This function is being executed a bajillion times.
   * Returns true if path is the dockerfile, false otherwise
   * @param  path Path to check
   * @return {boolean}      Is path for dockerfile
   */
  isDockerFile(path: string): boolean {
    return this.fileType === 'dockerfile' && path === '/Dockerfile';
  }

  /**
   * TODO: Fix the execution of this function.  This function is being executed a bajillion times.
   * Determines whether to show the current sourcefile based on the descriptor type and tab
   * @param  type sourcefile type
   * @return {boolean}      whether or not to show file
   */
  showSourcefile(type: SourceFile.TypeEnum): boolean {
    const fileType = this.fileType;
    const descriptorType = this.descriptorType;
    return this.codeEditorListService.showSourcefile(type, fileType, descriptorType);
  }

  /**
   * Updates the absolute and relative paths for a sourcefile.
   * @param newPath {string} the new path to the sourcefile
   * @param index {number} index of a SourceFile object in the sourcefiles array
   */
  updateSourceFilePath(newPath: string, index: number) {
    this.sourcefiles[index].absolutePath = newPath;
    this.sourcefiles[index].path = newPath;
  }

  downloadFileContent(content: string, filePath: string) {
    const fileName = this.fileService.getFileName(filePath);
    this.fileService.downloadFileContent(content, fileName);
  }
}
