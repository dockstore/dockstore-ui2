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
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Observable } from 'rxjs/Observable';

import { GA4GHService, ToolFile } from '../swagger';
import { DescriptorType } from '../enum/descriptorType.enum';

/**
 * This file serves as the state for the GA4GH files endpoint response
 * Contains both actions and store
 * @export
 * @class Ga4ghFilesStateService
 */
@Injectable()
export class GA4GHFilesStateService {
  public toolFiles$: Observable<Array<ToolFile>>;

  // TODO: Don't use BehaviorSubject, there should be a cleaner way with some Observable cleverness
  public cwlToolFiles$ = new BehaviorSubject<Array<ToolFile>>(null);
  public wdlToolFiles$ = new BehaviorSubject<Array<ToolFile>>(null);
  public nflToolFiles$ = new BehaviorSubject<Array<ToolFile>>(null);
  public containerToolFiles$: Observable<Array<ToolFile>>;
  public descriptorToolFiles$: Observable<Array<ToolFile>>;
  public testToolFiles$: Observable<Array<ToolFile>>;
  constructor(private ga4ghService: GA4GHService) {
    this.toolFiles$ = combineLatest(this.cwlToolFiles$, this.wdlToolFiles$, this.nflToolFiles$,
      (cwlToolFiles, wdlToolFiles, nflToolFiles) => {
        return this.mergeArray(cwlToolFiles, wdlToolFiles, nflToolFiles);
      });
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
  update(id: string, version: string) {
    this.ga4ghService.defaultHeaders = this.ga4ghService.defaultHeaders.set('Authorization',
    this.ga4ghService.configuration.apiKeys['Authorization']);
    this.ga4ghService.toolsIdVersionsVersionIdTypeFilesGet(
      DescriptorType.CWL, id, version).first().subscribe(files => {
        this.cwlToolFiles$.next(files);
      });
    this.ga4ghService.toolsIdVersionsVersionIdTypeFilesGet(
      DescriptorType.WDL, id, version).first().subscribe(files => {
        this.wdlToolFiles$.next(files);
      });
    this.ga4ghService.toolsIdVersionsVersionIdTypeFilesGet(
      DescriptorType.NFL, id, version).first().subscribe(files => {
        this.nflToolFiles$.next(files);
      });
    // TODO: Grab from all descriptor types (CWL, WDL, NFL) to get all test parameter files

  }

  /**
   * This merges the 3 ToolFile arrays together into one array with no duplicates
   *
   * @private
   * @param {Array<ToolFile>} array1
   * @param {Array<ToolFile>} array2
   * @param {Array<toolFile>} array3
   * @returns {Array<ToolFile>}
   * @memberof GA4GHFilesStateService
   */
  private mergeArray(array1: Array<ToolFile>, array2: Array<ToolFile>, array3: Array<ToolFile>): Array<ToolFile> {
    let combinedArray = [];
    Array.prototype.push.apply(combinedArray, array1);
    Array.prototype.push.apply(combinedArray, array2);
    Array.prototype.push.apply(combinedArray, array3);
    combinedArray = combinedArray.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj['path']).indexOf(obj['path']) === pos;
    });
    return combinedArray;
  }
}
