import { provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { RequestsService } from '../../../loginComponents/state/requests.service';
import { OrganizationsService, UsersService } from '../../../shared/openapi';
import { OrganizationsStubService, UsersStubService } from '../../../test/service-stubs';
import { OrganizationStarringService } from './organization-starring.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OrganizationStarringService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        OrganizationStarringService,
        RequestsService,
        { provide: UsersService, useClass: UsersStubService },
        { provide: OrganizationsService, useClass: OrganizationsStubService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it('should be created', inject([OrganizationStarringService], (service: OrganizationStarringService) => {
    expect(service).toBeTruthy();
  }));
  it('should call everything', inject([OrganizationStarringService], (service: OrganizationStarringService) => {
    service.setStar(1);
    service.setStar(1);
    service.setUnstar(1);
    service.setUnstar(1);
    service.getStarring(1);
    service.getStarring(1);
    service.getStarredOrganizations();
  }));
});
