/*
 *    Copyright 2018 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License")
 *    you may not use this file except in compliance with the License
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MetadataService } from './../swagger/api/metadata.service';
import { DescriptorLanguageBean } from './../swagger/model/descriptorLanguageBean';

@Injectable()
export class DescriptorLanguageService {

    descriptorLanguages$: Observable<Array<string>>;
    descriptorLanguagesBean$: Observable<DescriptorLanguageBean[]>;
    constructor(private metadataService: MetadataService) {
        this.descriptorLanguagesBean$ = this.metadataService.getDescriptorLanguages();
        this.descriptorLanguages$ = this.descriptorLanguagesBean$.map(descriptorLanguageMap => {
            if (descriptorLanguageMap) {
                return descriptorLanguageMap.map((descriptorLanguage) => descriptorLanguage.value.toString());
            }
        });
    }
}
