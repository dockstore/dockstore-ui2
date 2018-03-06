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
