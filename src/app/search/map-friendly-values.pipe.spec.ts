import { PlatformPartnerPipe } from '../shared/entry/platform-partner.pipe';
import { MapFriendlyValuesPipe } from './map-friendly-values.pipe';
import { DescriptorLanguageService } from 'app/shared/entry/descriptor-language.service';
import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SourceFile } from '../shared/openapi/model/sourceFile';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('Pipe: MapFriendlyValuese', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        MapFriendlyValuesPipe,
        { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
        PlatformPartnerPipe,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it('create an instance and test friendly verified conversion', () => {
    const service: DescriptorLanguageService = TestBed.inject(DescriptorLanguageService);
    const platformPartnerPipe = TestBed.inject(PlatformPartnerPipe);
    const pipe = new MapFriendlyValuesPipe(service, platformPartnerPipe);
    expect(pipe).toBeTruthy();
    expect(pipe.transform('file_formats.keyword', 'potato')).toBe('potato');
    expect(pipe.transform('potato', null)).toBe(null);
    expect(pipe.transform('potato', 0)).toBe('0');
    expect(pipe.transform('has_checker', 0)).toBe('unchecked workflow');
    expect(pipe.transform('source_control_provider.keyword', 'BITBUCKET')).toBe('Bitbucket');

    expect(pipe.transform('descriptorType', 'NFL')).toBe('Nextflow');
    expect(pipe.transform('descriptorType', 'nfl')).toBe('Nextflow');
    expect(pipe.transform('descriptorType', 'CWL')).toBe('CWL');
    expect(pipe.transform('descriptorType', 'cwl')).toBe('CWL');

    expect(pipe.transform('descriptor_type', 'CWL')).toBe('CWL');
    expect(pipe.transform('descriptor_type', 'cwl')).toBe('CWL');
    expect(pipe.transform('descriptor_type', 'NFL')).toBe('Nextflow');
    expect(pipe.transform('descriptor_type', 'nfl')).toBe('Nextflow');
    expect(pipe.transform('descriptor_type', 'goat')).toBe('goat');

    expect(pipe.transform('descriptor_tooltip', 'NFL')).toBe('Nextflow');
    expect(pipe.transform('descriptor_tooltip', 'nfl')).toBe('Nextflow');
    expect(pipe.transform('descriptor_tooltip', 'CWL')).toBe('Common Workflow Language');
    expect(pipe.transform('descriptor_tooltip', 'cwl')).toBe('Common Workflow Language');
    expect(pipe.transform('descriptor_tooltip', 'goat')).toBe('goat');

    expect(pipe.transform('SourceFile.TypeEnum', SourceFile.TypeEnum.NEXTFLOWCONFIG)).toBe('Descriptor Files');
    expect(pipe.transform('SourceFile.TypeEnum', SourceFile.TypeEnum.NEXTFLOW)).toBe('Descriptor Files');
    expect(pipe.transform('SourceFile.TypeEnum', SourceFile.TypeEnum.GXFORMAT2TESTFILE)).toBe('Test Parameter Files');
    expect(pipe.transform('SourceFile.TypeEnum', 'goat')).toBe('goat');

    // Confusingly, the response from ES is "DNA_STACK", the TS enum is "DNASTACK", the friendly value is "DNAstack".
    expect(pipe.transform('execution_partners.keyword', 'DNA_STACK')).toBe('DNAstack');
    expect(pipe.transform('execution_partners.keyword', 'AGC')).toBe('AGC');
  });
});
