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
import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';

import { WebserviceDescriptorType } from '../models/DescriptorType';
import { ToolDescriptor, ToolFile } from '../swagger';
import { GA4GHFiles } from './ga4gh-files.model';
import { GA4GHFilesState, GA4GHFilesStore } from './ga4gh-files.store';

@Injectable({
  providedIn: 'root'
})
export class GA4GHFilesQuery extends QueryEntity<GA4GHFilesState, GA4GHFiles> {
  getToolFiles(descriptorType: WebserviceDescriptorType, fileTypes: Array<ToolFile.FileTypeEnum>): Observable<Array<ToolFile>> {
    const descriptorTypeEnum = this.convertToToolDescriptorTypeEnum(descriptorType);
    if (descriptorTypeEnum) {
      let toolFiles$: Observable<Array<ToolFile>>;
      toolFiles$ = this.selectEntity(descriptorTypeEnum).pipe(
        map((gA4GHFile: GA4GHFiles) => gA4GHFile ? gA4GHFile.toolFiles : [])
      );
      return toolFiles$.pipe(
        map((toolFiles: Array<ToolFile>) => toolFiles ? toolFiles.filter(toolFile => fileTypes.includes(toolFile.file_type)) : [])
      );
    } else {
      return observableOf([]);
    }
  }
  constructor(protected store: GA4GHFilesStore) {
    super(store);
  }

  /**
   * Converts a WebserviceDescriptorType to a ToolDescriptor.TypeEnum
   * Deprecate this function once all descriptor types are unified
   * @private
   * @param {WebserviceDescriptorType} descriptorType
   * @returns {ToolDescriptor.TypeEnum}
   * @memberof GA4GHFilesQuery
   */
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
