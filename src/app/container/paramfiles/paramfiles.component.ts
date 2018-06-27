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
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { ContainerService } from '../../shared/container.service';
import { FileService } from '../../shared/file.service';
import { EntryFileSelector } from '../../shared/selectors/entry-file-selector';
import { ContainersService } from '../../shared/swagger';
import { Tag } from '../../shared/swagger/model/tag';
import { ParamfilesService } from './paramfiles.service';

@Component({
  selector: 'app-paramfiles-container',
  templateUrl: './paramfiles.component.html'
})

export class ParamfilesComponent extends EntryFileSelector {

  @Input() id: number;
  @Input() entrypath: string;
  @Input() set selectedVersion(value: Tag) {
    this.clearContent();
    this.onVersionChange(value);
  }
  public filePath: string;
  public entryType = 'tool';
  public downloadFilePath: string;

  constructor(private containerService: ContainerService, private containersService: ContainersService,
    private paramfilesService: ParamfilesService,
              public fileService: FileService) {
    super();
    this.published$ = this.containerService.toolIsPublished$;
  }
  getDescriptors(version): Array<any> {
    return this.paramfilesService.getDescriptors(this._selectedVersion);
  }

  getFiles(descriptor): Observable<any> {
    return this.paramfilesService.getFiles(this.id, 'containers', this._selectedVersion.name, this.currentDescriptor);
  }

  reactToFile(): void {
    this.content = this.currentFile.content;
    this.filePath = this.getFilePath(this.currentFile);
    this.filePath = this.getFilePath(this.currentFile);
    this.downloadFilePath = this.fileService.getDescriptorPath(this.entrypath, this._selectedVersion,
      this.currentFile, this.currentDescriptor, this.entryType);
  }

  // Get the path of the file
  getFilePath(file): string {
    return this.fileService.getFilePath(file);
  }

  downloadFile(file, id): void {
    this.fileService.downloadFile(file, id);
  }
}
