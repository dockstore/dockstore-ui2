/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VerifiedByService } from './verified-by.service';
import { testSourceFiles } from '../test/mocked-objects';

describe('Service: VerifiedBy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VerifiedByService]
    });
  });

  it('should get verified-by string', inject([VerifiedByService], (service: VerifiedByService) => {
    expect(service.getVerifiedByString(null)).toEqual([]);
    expect(service.getVerifiedByString([])).toEqual([]);
    expect(service.getVerifiedByString(testSourceFiles)).toEqual(['Dockstore CLI 1.0.0']);
  }));
});
