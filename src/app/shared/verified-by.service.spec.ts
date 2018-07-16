/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VerifiedByService } from './verified-by.service';

describe('Service: VerifiedBy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VerifiedByService]
    });
  });

  it('should ...', inject([VerifiedByService], (service: VerifiedByService) => {
    expect(service).toBeTruthy();
  }));
});
