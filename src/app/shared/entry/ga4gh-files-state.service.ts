/*
 *     Copyright 2018 OICR
 *
 *     Licensed under the Apache License, Version 2.0 (the "License")
 *     you may not use this file except in compliance with the License
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
import { Injectable } from '@angular/core';
import { ToolFile, GA4GHService } from '../swagger';
import { Observable } from 'rxjs/Observable';

/**
 * This file services as the state for the GA4GH files endpoint
 * Contains both actions and store
 * @export
 * @class Ga4ghFilesStateService
 */
@Injectable()
export class Ga4ghFilesStateService {
  public toolFiles$: Observable<Array<ToolFile>> = Observable.of([]);
  public containerToolFiles$: Observable<Array<ToolFile>>;
  public descriptorToolFiles$: Observable<Array<ToolFile>>;
  public testToolFiles$: Observable<Array<ToolFile>>;
  constructor(private ga4ghService: GA4GHService) {
  }
  update(type: string, id: string, version: string) {
    // TODO: Grab from all descriptor types (CWL, WDL, NFL) to get all test parameter files
    this.toolFiles$ = this.ga4ghService.toolsIdVersionsVersionIdTypeFilesGet(
      type.toUpperCase(), encodeURIComponent(id), encodeURIComponent(version));
        this.containerToolFiles$ = this.toolFiles$.map((toolFiles: Array<ToolFile>) => {
          if (!toolFiles) {
            toolFiles = [];
          }
          return toolFiles.filter((toolFile: ToolFile) => {
            return toolFile.file_type === ToolFile.FileTypeEnum.CONTAINERFILE;
          });
        });
        this.descriptorToolFiles$ = this.toolFiles$.map((toolFiles: Array<ToolFile>) => {
          if (!toolFiles) {
            toolFiles = [];
          }
          return toolFiles.filter((toolFile: ToolFile) => {
            return (toolFile.file_type === ToolFile.FileTypeEnum.PRIMARYDESCRIPTOR ||
              toolFile.file_type === ToolFile.FileTypeEnum.SECONDARYDESCRIPTOR);
          });
        });
        this.testToolFiles$ = this.toolFiles$.map((toolFiles: Array<ToolFile>) => {
          if (!toolFiles) {
            toolFiles = [];
          }
          return toolFiles.filter((toolFile: ToolFile) => {
            return toolFile.file_type === ToolFile.FileTypeEnum.TESTFILE;
          });
        });
  }
}
