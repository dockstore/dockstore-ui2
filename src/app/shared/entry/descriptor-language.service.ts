import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MetadataService } from './../swagger/api/metadata.service';
import { DescriptorLanguageBean } from './../swagger/model/descriptorLanguageBean';

@Injectable()
export class DescriptorLanguageService {

    descriptorLanguages$: Observable<Array<string>>;

    constructor(private metadataService: MetadataService) {
        this.descriptorLanguages$ = this.metadataService.getDescriptorLanguages().map(descriptorLanguageMap => {
            if (descriptorLanguageMap) {
                return descriptorLanguageMap.map((descriptorLanguage) => descriptorLanguage.value.toString());
            }
        });
    }
}
