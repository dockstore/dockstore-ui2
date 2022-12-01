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
import { transaction } from '@datorama/akita';
import { FilesService } from '../../workflow/files/state/files.service';
import { GA4GHV20Service } from '../openapi';
import { GA4GHFilesStore } from './ga4gh-files.store';
import { DescriptorLanguageService } from '../entry/descriptor-language.service';
import { DescriptorTypeCompatService } from '../descriptor-type-compat.service';

@Injectable({
  providedIn: 'root',
})
export class GA4GHFilesService {
  constructor(
    private ga4ghFilesStore: GA4GHFilesStore,
    private ga4ghService: GA4GHV20Service,
    private filesService: FilesService,
    private descriptorLanguageService: DescriptorLanguageService,
    private descriptorTypeCompatService: DescriptorTypeCompatService
  ) {}

  /**
   * Updates all GA4GH files from all descriptor types unless specific ones provided
   * The transaction doesn't appear to be working.  The 3 sets of files are being set 1 after another.
   *
   * @param {string} id    GA4GH Tool ID
   * @param {string} version  GA4GH Version name
   * @param {Array<ToolDescriptor.TypeEnum>} [descriptorTypes]  Optional. Specific descriptor types to update
   * @memberof GA4GHFilesService
   */
  @transaction()
  updateFiles(id: string, version: string, descriptorTypes?: Array<string>) {
    if (!version) {
      return;
    }
    this.clearFiles();
    this.filesService.removeAll();
    if (!descriptorTypes) {
      descriptorTypes = this.descriptorLanguageService.getDescriptorLanguagesToolTypes();
    }
    this.injectAuthorizationToken(this.ga4ghService);
    descriptorTypes.forEach((descriptorType) => {
      const type = this.descriptorTypeCompatService.toolDescriptorTypeEnumToToolVersionDescriptorTypeEnum(
        this.descriptorTypeCompatService.stringToDescriptorType(descriptorType)
      );
      this.ga4ghService.toolsIdVersionsVersionIdTypeFilesGet(id, type, version).subscribe(
        (files) => {
          this.ga4ghFilesStore.setError(null);
          this.ga4ghFilesStore.upsert(descriptorType, { toolFiles: files });
        },
        (e) => {
          this.ga4ghFilesStore.setError(e);
          this.ga4ghFilesStore.remove();
        }
      );
    });
  }

  /**
   * Removes all GA4GH files stored
   *
   * @memberof GA4GHFilesService
   */
  clearFiles() {
    this.ga4ghFilesStore.setError(null);
    this.ga4ghFilesStore.remove();
    this.filesService.removeAll();
  }

  /**
   * Workaround.
   * Since the swagger.yaml does not indicate the endpoints are optionally authenticated,
   * the generated classes will not try and use authentication.  This manually injects it in for use.
   *
   * @param {GA4GHV20Service} ga4ghService
   * @memberof GA4GHFilesService
   */
  public injectAuthorizationToken(ga4ghService: GA4GHV20Service) {
    const auth = ga4ghService.configuration.apiKeys['Authorization'];
    if (auth) {
      ga4ghService.defaultHeaders = ga4ghService.defaultHeaders.set('Authorization', auth);
    } else {
      ga4ghService.defaultHeaders = ga4ghService.defaultHeaders.delete('Authorization');
    }
  }
}
