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
import { of as observableOf, Observable } from 'rxjs';

import { DescriptorLanguageBean } from './../swagger/model/descriptorLanguageBean';
import { DescriptorLanguageService } from './descriptor-language.service';

describe('Service: DescriptorLanguage', () => {
  it('should return the descriptor languages in an string array', () => {
    const metadataServiceSpy = jasmine.createSpyObj('MetadataService', ['getDescriptorLanguages']);
    const workflowQuerySpy = jasmine.createSpyObj('WorkflowQuery', ['getDescriptorLanguages']);
    const stubValue: Array<DescriptorLanguageBean> = [{ value: 'cwl' }, { value: 'wdl' }, { value: 'nextflow' }];
    metadataServiceSpy.getDescriptorLanguages.and.returnValue(observableOf(stubValue));
    const descriptorLanguageService = new DescriptorLanguageService(metadataServiceSpy, workflowQuerySpy);
    descriptorLanguageService.filteredDescriptorLanguages$.subscribe((languages: Array<string>) => {
      expect(languages).toEqual(['cwl', 'wdl', 'nextflow'], 'service returned stub value');
    });
  });
});
