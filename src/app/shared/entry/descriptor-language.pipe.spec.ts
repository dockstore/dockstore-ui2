import { DescriptorLanguagePipe } from './descriptor-language.pipe';
import { DescriptorLanguageService } from 'app/shared/entry/descriptor-language.service';
import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('Pipe: DescriptorLanguagePipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        DescriptorLanguagePipe,
        { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it('create an instance', () => {
    const service: DescriptorLanguageService = TestBed.inject(DescriptorLanguageService);
    const pipe = new DescriptorLanguagePipe(service);
    expect(pipe).toBeTruthy();
    expect(pipe.transform('gxformat2')).toBe('Galaxy');
  });
});
