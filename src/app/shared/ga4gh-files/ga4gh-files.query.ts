import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable, combineLatest, of as observableOf } from 'rxjs';

import { ToolFile, ToolDescriptor } from '../swagger';
import { GA4GHFiles } from './ga4gh-files.model';
import { GA4GHFilesState, GA4GHFilesStore } from './ga4gh-files.store';
import { filter, map } from 'rxjs/operators';
import { WebserviceDescriptorType } from '../models/DescriptorType';

/*
 *    Copyright 2018 OICR
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

@Injectable({
  providedIn: 'root'
})
export class GA4GHFilesQuery extends QueryEntity<GA4GHFilesState, GA4GHFiles> {
  getToolFiles(descriptorType: WebserviceDescriptorType, fileTypes: Array<ToolFile.FileTypeEnum>): Observable<Array<ToolFile>> {
    const descriptorTypeEnum = this.convertToToolDescriptorTypeEnum(descriptorType);
    if (descriptorTypeEnum) {
      let toolFiles$: Observable<Array<ToolFile>>;
      toolFiles$ = this.selectEntity(descriptorTypeEnum).pipe(map(gA4GHFile => {
        if (gA4GHFile) {
          return gA4GHFile.toolFiles;
        } else {
          return [];
        }
      }));
      return toolFiles$.pipe(map((toolFiles: Array<ToolFile>) => {
        if (toolFiles) {
          return toolFiles.filter(toolFile => fileTypes.includes(toolFile.file_type));
        } else {
          return [];
        }
      }));
    } else {
      return observableOf([]);
    }
  }
  constructor(protected store: GA4GHFilesStore) {
    super(store);
  }

  private convertToToolDescriptorTypeEnum(descriptorType: WebserviceDescriptorType): ToolDescriptor.TypeEnum {
    switch (descriptorType) {
      case 'cwl': {
        return ToolDescriptor.TypeEnum.CWL;
      }
      case 'wdl': {
        return ToolDescriptor.TypeEnum.WDL;
      }
      case 'nfl': {
        return ToolDescriptor.TypeEnum.NFL;
      }
      default: {
        console.error('Unknown descriptor type: ' + descriptorType);
        return null;
      }
    }
  }
}
