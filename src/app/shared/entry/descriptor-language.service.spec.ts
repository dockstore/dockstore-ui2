import { DescriptorLanguageBean } from './../swagger/model/descriptorLanguageBean';
import { Observable } from 'rxjs/Observable';
import { MetadataService } from './../swagger/api/metadata.service';
import { inject, TestBed } from '@angular/core/testing';

import { DescriptorLanguageService } from './descriptor-language.service';

describe('Service: DescriptorLanguage', () => {
  it('should return the descriptor languages in an string array', () => {
    const metadataServiceSpy =
    jasmine.createSpyObj('MetadataService', ['getDescriptorLanguages']);
    const stubValue: Array<DescriptorLanguageBean> = [{'value': 'cwl'}, {'value': 'wdl'}, {'value': 'nextflow'}];
    metadataServiceSpy.getDescriptorLanguages.and.returnValue(Observable.of(stubValue));
    const descriptorLanguageService = new DescriptorLanguageService(metadataServiceSpy);
    descriptorLanguageService.descriptorLanguages$.subscribe((languages: Array<string>) => {
      expect(languages).toEqual(['cwl', 'wdl', 'nextflow'], 'service returned stub value');
    });
  });
});
