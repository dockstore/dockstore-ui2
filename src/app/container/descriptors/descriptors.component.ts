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
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';

import { ContainerService } from '../../shared/container.service';
import { GA4GHFilesStateService } from '../../shared/entry/GA4GHFiles.state.service';
import { FileService } from '../../shared/file.service';
import { EntryFileSelector } from '../../shared/selectors/entry-file-selector';
import { GA4GHService, ToolDescriptor, ToolFile } from '../../shared/swagger';
import { Tag } from '../../shared/swagger/model/tag';
import { ToolDescriptorService } from './tool-descriptor.service';

@Component({
  selector: 'app-descriptors-container',
  templateUrl: './descriptors.component.html',
  providers: [ToolDescriptorService]
})

export class DescriptorsComponent extends EntryFileSelector {

  @Input() id: number;
  @Input() entrypath: string;
  @Input() set selectedVersion(value: Tag) {
    this.clearContent();
    this.onVersionChange(value);
  }

  public filePath: string;
  constructor(private containerService: ContainerService,
    private descriptorsService: ToolDescriptorService, private gA4GHService: GA4GHService,
    public fileService: FileService, private gA4GHFilesStateService: GA4GHFilesStateService) {
    super(fileService);
    this.published$ = this.containerService.toolIsPublished$;
  }

  getDescriptors(version): Array<any> {
    return this.descriptorsService.getDescriptors(this._selectedVersion);
  }

  /**
   * Get all the language-specific primary and secondary descriptors
   *
   * @param {(('cwl' | 'wdl' | 'nfl'))} descriptor The descriptor language selected
   * @returns {Observable<Array<ToolFile>>} The array of language-specific descriptors
   * @memberof DescriptorsComponent
   */
  getFiles(descriptor: ('cwl' | 'wdl' | 'nfl')): Observable<Array<ToolFile>> {
    let descriptorToolFiles$: BehaviorSubject<Array<ToolFile>>;
    switch (descriptor) {
      case 'wdl': {
        descriptorToolFiles$ = this.gA4GHFilesStateService.wdlToolFiles$;
        break;
      }
      case 'cwl': {
        descriptorToolFiles$ = this.gA4GHFilesStateService.cwlToolFiles$;
        break;
      }
      case 'nfl': {
        descriptorToolFiles$ = this.gA4GHFilesStateService.nflToolFiles$;
        break;
      }
      default: {
        console.log('Unknown descriptor type: ' + descriptor);
        return Observable.of([]);
      }
    }
    return descriptorToolFiles$.map((toolFiles: Array<ToolFile>) => {
      if (toolFiles) {
        return toolFiles.filter(toolFile => toolFile.file_type === ToolFile.FileTypeEnum.PRIMARYDESCRIPTOR ||
          toolFile.file_type === ToolFile.FileTypeEnum.SECONDARYDESCRIPTOR);
      } else {
        return [];
      }
    });
  }

  reactToFile(): void {
    // TODO: Memoize this
    this.gA4GHService.toolsIdVersionsVersionIdTypeDescriptorRelativePathGet(this.currentDescriptor, this.entrypath,
      this._selectedVersion.name, this.currentFile.path).first().subscribe((file: ToolDescriptor) => {
        this.content = file.descriptor;
        this.downloadFilePath = this.getDescriptorPath(this.entrypath, 'tool');
        this.filePath = this.fileService.getFilePath(this.currentFile);
      });
  }
}
