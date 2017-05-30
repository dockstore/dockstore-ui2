import { TestBed, inject } from '@angular/core/testing';

import { MytoolsService } from './mytools.service';

describe('MytoolsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MytoolsService]
    });
  });

  it('should ...', inject([MytoolsService], (service: MytoolsService) => {
    expect(service).toBeTruthy();
  }));
});
