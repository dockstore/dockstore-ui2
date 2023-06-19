import { PlatformPartnerPipe } from './platform-partner.pipe';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Pipe: PlatformPartner', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlatformPartnerPipe],
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
