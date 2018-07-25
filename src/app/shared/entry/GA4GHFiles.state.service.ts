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
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { DescriptorType } from '../enum/descriptorType.enum';
import { GA4GHService, ToolFile } from '../swagger';

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
  public cwlToolFiles$ = new BehaviorSubject<Array<ToolFile>>([]);
  public wdlToolFiles$ = new BehaviorSubject<Array<ToolFile>>([]);
  public nflToolFiles$ = new BehaviorSubject<Array<ToolFile>>([]);
  public containerToolFiles$: Observable<Array<ToolFile>>;
  public descriptorToolFiles$: Observable<Array<ToolFile>>;
  public testToolFiles$: Observable<Array<ToolFile>>;
  constructor(private ga4ghService: GA4GHService) {
    // Combines all the toolFiles and filters out null if for some reason that occurs
    this.toolFiles$ = combineLatest(this.cwlToolFiles$, this.wdlToolFiles$, this.nflToolFiles$,
      (cwlToolFiles: Array<ToolFile>, wdlToolFiles: Array<ToolFile>, nflToolFiles: Array<ToolFile>) =>
        this.mergeToolFileArrays(cwlToolFiles, wdlToolFiles, nflToolFiles)).pipe(filter((notNull: ToolFile[]) => notNull != null));

    // The 3 below are mildly similar to each other (filters applied to 'this.toolFiles$')
    // TODO: Somehow refactor?  Handle falsy when refactoring
    this.containerToolFiles$ = this.toolFiles$.pipe(map((toolFiles: Array<ToolFile>) =>
      toolFiles.filter((toolFile: ToolFile) => toolFile.file_type === ToolFile.FileTypeEnum.CONTAINERFILE)));
    this.descriptorToolFiles$ = this.toolFiles$.pipe(map((toolFiles: Array<ToolFile>) =>
      toolFiles.filter((toolFile: ToolFile) => toolFile.file_type === ToolFile.FileTypeEnum.PRIMARYDESCRIPTOR ||
        toolFile.file_type === ToolFile.FileTypeEnum.SECONDARYDESCRIPTOR)));
    this.testToolFiles$ = this.toolFiles$.pipe(map((toolFiles: Array<ToolFile>) =>
      toolFiles.filter((toolFile: ToolFile) => toolFile.file_type === ToolFile.FileTypeEnum.TESTFILE)));
  }

  /**
   * Workaround.
   * Since the swagger.yaml does not indicate the endpoints are optionally authenticated,
   * the generated classes will not try and use authentication.  This manually injects it in for use.
   *
   * @param {GA4GHService} ga4ghService
   * @memberof GA4GHFilesStateService
   */
  public injectAuthorizationToken(ga4ghService: GA4GHService) {
    ga4ghService.defaultHeaders = ga4ghService.defaultHeaders.set('Authorization',
      ga4ghService.configuration.apiKeys['Authorization']);
  }

  update(id: string, version: string) {
    this.injectAuthorizationToken(this.ga4ghService);
    this.ga4ghService.toolsIdVersionsVersionIdTypeFilesGet(
      DescriptorType.CWL, id, version).subscribe(files => {
        this.cwlToolFiles$.next(files);
      });
    this.ga4ghService.toolsIdVersionsVersionIdTypeFilesGet(
      DescriptorType.WDL, id, version).subscribe(files => {
        this.wdlToolFiles$.next(files);
      });
    this.ga4ghService.toolsIdVersionsVersionIdTypeFilesGet(
      DescriptorType.NFL, id, version).subscribe(files => {
        this.nflToolFiles$.next(files);
      });
  }

  /**
   * This merges the ToolFile arrays together into one array with no duplicates
   * @private
   * @param {...Array<Array<ToolFile>>} toolFileArrays  Array of array of tool files
   * @returns {Array<ToolFile>}                         Merged array of tool files
   * @memberof GA4GHFilesStateService
   */
  private mergeToolFileArrays(...toolFileArrays: Array<Array<ToolFile>>): Array<ToolFile> {
    let combinedArray: ToolFile[] = [];
    toolFileArrays.forEach(array => {
      Array.prototype.push.apply(combinedArray, array);
    });
    combinedArray = combinedArray.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj['path']).indexOf(obj['path']) === pos;
    });
    return combinedArray;
  }
}
