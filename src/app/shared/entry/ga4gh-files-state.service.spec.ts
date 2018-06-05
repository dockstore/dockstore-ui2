/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Ga4ghFilesStateService } from './ga4gh-files-state.service';

describe('Service: Ga4ghFilesState', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Ga4ghFilesStateService]
    });
  });

  it('should ...', inject([Ga4ghFilesStateService], (service: Ga4ghFilesStateService) => {
    expect(service).toBeTruthy();
  }));
});
