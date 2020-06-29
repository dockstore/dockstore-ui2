import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { RequestsService } from '../../../loginComponents/state/requests.service';
import { OrganizationsService, UsersService } from '../../../shared/swagger';
import { OrganizationsStubService, UsersStubService } from '../../../test/service-stubs';
import { OrganizationStarringService } from './organization-starring.service';

describe('OrganizationStarringService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OrganizationStarringService,
        RequestsService,
        { provide: UsersService, useClass: UsersStubService },
        { provide: OrganizationsService, useClass: OrganizationsStubService }
      ]
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
