/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GA4GHFilesStateService } from './GA4GHFiles.state.service';

describe('Service: GA4GHFiles.state', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GA4GHFilesStateService]
    });
  });

  it('should ...', inject([GA4GHFilesStateService], (service: GA4GHFilesStateService) => {
    expect(service).toBeTruthy();
  }));
});
