/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { versionVerifiedPlatform } from '../test/mocked-objects';
import { VerifiedByService } from './verified-by.service';

describe('Service: VerifiedBy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VerifiedByService]
    });
  });

  it('should get verified-by string', inject([VerifiedByService], (service: VerifiedByService) => {
    expect(service.getVerifiedByString(null, null)).toEqual([]);
    expect(service.getVerifiedByString([], 1)).toEqual([]);
    expect(service.getVerifiedByString(versionVerifiedPlatform, 1)).toEqual(['Dockstore CLI 1.0.0']);
  }));
});
