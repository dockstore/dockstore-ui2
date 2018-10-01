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
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContainerService } from '../../shared/container.service';
import { GA4GHFilesStateService } from '../../shared/entry/GA4GHFiles.state.service';
import { FileService } from '../../shared/file.service';
import { WebserviceDescriptorType } from '../../shared/models/DescriptorType';
import { EntryFileSelector } from '../../shared/selectors/entry-file-selector';
import { GA4GHService, ToolFile } from '../../shared/swagger';
import { Tag } from '../../shared/swagger/model/tag';
import { ToolDescriptorService } from './tool-descriptor.service';

@Component({
  selector: 'app-descriptors-container',
  templateUrl: './descriptors.component.html',
  providers: [ToolDescriptorService],
  styleUrls: ['./descriptors.component.scss']
})

export class DescriptorsComponent extends EntryFileSelector {

  @Input() id: number;
  @Input() entrypath: string;
  @Input() publicPage: boolean;
  @Input() set selectedVersion(value: Tag) {
    this.clearContent();
    this.onVersionChange(value);
    this.checkIfValid(true);
  }

  protected entryType: ('tool' | 'workflow') = 'tool';

  constructor(private containerService: ContainerService,
    private descriptorsService: ToolDescriptorService, protected gA4GHService: GA4GHService,
    public fileService: FileService, protected gA4GHFilesStateService: GA4GHFilesStateService) {
    super(fileService, gA4GHFilesStateService, gA4GHService);
    this.published$ = this.containerService.toolIsPublished$;
  }

  getAllDescriptors(version): Array<any> {
    return this.descriptorsService.getAllDescriptors(this._selectedVersion);
  }

  getValidDescriptors(version): Array<any> {
    return this.descriptorsService.getValidDescriptors(this._selectedVersion);
  }

  /**
   * Get all the language-specific primary and secondary descriptors
   *
   * @param {WebserviceDescriptorType} descriptor The descriptor language selected
   * @returns {Observable<Array<ToolFile>>} The array of language-specific descriptors
   * @memberof DescriptorsComponent
   */
  getFiles(descriptor: WebserviceDescriptorType): Observable<Array<ToolFile>> {
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
        console.error('Unknown descriptor type: ' + descriptor);
        return observableOf([]);
      }
    }
    return descriptorToolFiles$.pipe(map((toolFiles: Array<ToolFile>) => {
      if (toolFiles) {
        return toolFiles.filter(toolFile => toolFile.file_type === ToolFile.FileTypeEnum.PRIMARYDESCRIPTOR ||
          toolFile.file_type === ToolFile.FileTypeEnum.SECONDARYDESCRIPTOR);
      } else {
        return [];
      }
    }));
  }
}
