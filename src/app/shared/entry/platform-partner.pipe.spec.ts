import { PlatformPartnerPipe } from './platform-partner.pipe';
import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('Pipe: PlatformPartner', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [PlatformPartnerPipe, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
  });

  it('create an instance', () => {
    const pipe = new PlatformPartnerPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform('DNA_STACK')).toBe('DNAstack');
    expect(pipe.transform('AGC')).toBe('AGC');
    expect(pipe.transform('ANVIL')).toBe('AnVIL');
  });
});
