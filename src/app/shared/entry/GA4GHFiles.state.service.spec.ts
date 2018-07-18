import { inject, TestBed } from '@angular/core/testing';

import { GA4GHStubService } from '../../test/service-stubs';
import { GA4GHService } from '../swagger';
import { GA4GHFilesStateService } from './GA4GHFiles.state.service';

describe('Service: GA4GHFiles.state', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GA4GHFilesStateService, {provide: GA4GHService, useClass: GA4GHStubService}]
    });
  });

  it('should ...', inject([GA4GHFilesStateService], (service: GA4GHFilesStateService) => {
    expect(service).toBeTruthy();
  }));
});
