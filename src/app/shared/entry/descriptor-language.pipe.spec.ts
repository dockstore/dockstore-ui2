import { DescriptorLanguagePipe } from './descriptor-language.pipe';
import { DescriptorLanguageService } from 'app/shared/entry/descriptor-language.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Pipe: DescriptorLanguagePipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DescriptorLanguagePipe, { provide: DescriptorLanguageService, useClass: DescriptorLanguageService }],
    });
  });

  it('create an instance', () => {
    const service: DescriptorLanguageService = TestBed.inject(DescriptorLanguageService);
    const pipe = new DescriptorLanguagePipe(service);
    expect(pipe).toBeTruthy();
    expect(pipe.transform('gxformat2')).toBe('Galaxy');
  });
});
