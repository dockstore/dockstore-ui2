import { inject, TestBed } from '@angular/core/testing';
import { GA4GHV20Service } from '../shared/openapi';
import { GA4GHV20StubService } from '../test/service-stubs';
import { ServiceInfoService } from './service-info.service';

describe('ServiceInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceInfoService, { provide: GA4GHV20Service, useClass: GA4GHV20StubService }],
    });
  });

  it('should be created', inject([ServiceInfoService], (serviceInfoService: ServiceInfoService) => {
    expect(serviceInfoService).toBeTruthy();
  }));
});
