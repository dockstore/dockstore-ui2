/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from '@angular/core/testing';
import { testSourceFiles } from '../test/mocked-objects';
import { VerifiedByService } from './verified-by.service';

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
