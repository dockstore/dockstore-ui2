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
import { Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ToolFile } from '../swagger';

/**
* Abstract class to be implemented by components that have select boxes for a given entry and version
*/
export abstract class EntryFileSelector {
  _selectedVersion: any;

  protected currentDescriptor;
  protected descriptors: Array<any>;
  public nullDescriptors: boolean;

  protected currentFile;
  protected files: Array<any>;
  protected published$: Observable<boolean>;

  content: string = null;
  contentHighlighted: boolean;

  abstract getDescriptors(version): Array<any>;
  abstract getFiles(descriptor): Observable<Array<ToolFile>>;
  abstract reactToFile(): void;
  abstract updateToolFiles(): void;
  abstract getFileContent(toolFile: ToolFile): void;

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
    this.updateToolFiles();
    this.getFiles(this.currentDescriptor)
      .subscribe(files => {
        this.files = files;
        if (this.files.length) {
          this.onFileChange(this.files[0]);
        } else {
          this.content = null;
        }}, error => this.content = null
      );
  }

  onFileChange(file: ToolFile) {
    this.getFileContent(file);
    this.reactToFile();
  }

  onVersionChange(value) {
    this._selectedVersion = value;
    this.reactToVersion();
  }

  clearContent() {
    this.content = null;
    this.contentHighlighted = false;
  }

}
