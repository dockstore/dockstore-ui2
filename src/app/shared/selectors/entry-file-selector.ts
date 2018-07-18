/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { Observable } from 'rxjs';

import { FileService } from '../file.service';
import { SafeUrl } from '@angular/platform-browser';

/**
* Abstract class to be implemented by components that have select boxes for a given entry and version
*/
export abstract class EntryFileSelector {
  _selectedVersion: any;

  protected currentDescriptor;
  protected descriptors: Array<any>;
  public nullDescriptors: boolean;
  public filePath: string;
  public currentFile;
  protected files: Array<any>;
  protected published$: Observable<boolean>;
  public downloadFilePath: string;
  public customDownloadHREF: SafeUrl;
  public customDownloadPath: string;
  content: string = null;

  abstract getDescriptors(version): Array<any>;
  abstract getFiles(descriptor): Observable<any>;
  /**
   * Get the file using the descriptor/{relative-path} endpoint
   *
   * @abstract
   * @memberof EntryFileSelector
   */
  abstract reactToFile(): void;

  constructor(protected fileService: FileService) {

  }

  protected getDescriptorPath(path: string, entryType: ('tool' | 'workflow')): string {
    return this.fileService.getDescriptorPath(path, this._selectedVersion, this.currentFile, this.currentDescriptor, entryType);
  }

  reactToVersion(): void {
    this.descriptors = this.getDescriptors(this._selectedVersion);
    if (this.descriptors) {
      this.nullDescriptors = false;
      if (this.descriptors.length) {
        this.onDescriptorChange(this.descriptors[0]);
      }
    } else {
      this.nullDescriptors = true;
    }
  }

  onDescriptorChange(descriptor) {
    this.currentDescriptor = descriptor;
    this.reactToDescriptor();
  }

  reactToDescriptor() {
    this.getFiles(this.currentDescriptor)
      .subscribe(files => {
        this.files = files;
        if (this.files.length) {
          this.onFileChange(this.files[0]);
        } else {
          this.currentFile = null;
          this.content = null;
        }}
      );
  }

  onFileChange(file) {
    if (this.currentFile !== file) {
      this.currentFile = file;
      this.reactToFile();
    }
  }

  onVersionChange(value) {
    this._selectedVersion = value;
    this.reactToVersion();
  }

  clearContent() {
    this.content = null;
  }

  customDownloadFile(): void {
    this.customDownloadHREF = this.fileService.getFileData(this.content);
    this.customDownloadPath = this.fileService.getFileName(this.filePath);
  }
}
