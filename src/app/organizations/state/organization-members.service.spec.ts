import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrganizationMembersService } from './organization-members.service';
import { OrganizationMembersStore } from './organization-members.store';

describe('OrganizationMembersService', () => {
  let organizationMembersService: OrganizationMembersService;
  let organizationMembersStore: OrganizationMembersStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganizationMembersService, OrganizationMembersStore],
      imports: [ HttpClientTestingModule ]
    });

    organizationMembersService = TestBed.get(OrganizationMembersService);
    organizationMembersStore = TestBed.get(OrganizationMembersStore);
  });

  it('should be created', () => {
    expect(organizationMembersService).toBeDefined();
  });

});
