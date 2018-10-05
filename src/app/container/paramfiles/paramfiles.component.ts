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
import { ContainersService, GA4GHService, ToolFile } from '../../shared/swagger';
import { Tag } from '../../shared/swagger/model/tag';
import { ParamfilesService } from './paramfiles.service';

@Component({
  selector: 'app-paramfiles-container',
  templateUrl: './paramfiles.component.html',
  styleUrls: ['./paramfiles.component.scss']
})

export class ParamfilesComponent extends EntryFileSelector {

  @Input() id: number;
  @Input() entrypath: string;
  @Input() publicPage: boolean;
  @Input() set selectedVersion(value: Tag) {
    this.clearContent();
    this.onVersionChange(value);
    this.checkIfValid(false, value);
  }
  public filePath: string;
  protected entryType: ('tool' | 'workflow') = 'tool';
  public downloadFilePath: string;
  constructor(private containerService: ContainerService, private containersService: ContainersService,
    protected gA4GHService: GA4GHService, private paramfilesService: ParamfilesService,
    protected gA4GHFilesStateService: GA4GHFilesStateService, public fileService: FileService) {
    super(fileService, gA4GHFilesStateService, gA4GHService);
    this.published$ = this.containerService.toolIsPublished$;
  }

  getAllDescriptors(version): Array<any> {
    return this.paramfilesService.getDescriptors(this._selectedVersion);
  }

  getValidDescriptors(version): Array<any> {
    return this.paramfilesService.getValidDescriptors(this._selectedVersion);
  }

  /**
   * Get all the language-specific test parameter files
   *
   * @param {WebserviceDescriptorType} descriptor The descriptor language selected
   * @returns {Observable<Array<ToolFile>>} The array of language-specific test parameter files
   * @memberof ParamfilesComponent
   */
  getFiles(descriptor: WebserviceDescriptorType): Observable<Array<ToolFile>> {
    let testToolFiles$: BehaviorSubject<Array<ToolFile>>;
    switch (descriptor) {
      case 'wdl': {
        testToolFiles$ = this.gA4GHFilesStateService.wdlToolFiles$;
        break;
      }
      case 'cwl': {
        testToolFiles$ = this.gA4GHFilesStateService.cwlToolFiles$;
        break;
      }
      case 'nfl': {
        testToolFiles$ = this.gA4GHFilesStateService.nflToolFiles$;
        break;
      }
      default: {
        console.error('Unknown descriptor type: ' + descriptor);
        return observableOf([]);
      }
    }
    return testToolFiles$.pipe(map((toolFiles: Array<ToolFile>) => {
      if (toolFiles) {
        return toolFiles.filter(toolFile => toolFile.file_type === ToolFile.FileTypeEnum.TESTFILE);
      } else {
        return [];
      }
    }));
  }
}
