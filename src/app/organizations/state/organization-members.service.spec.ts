import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { OrganizationMembersService } from './organization-members.service';
import { OrganizationMembersStore } from './organization-members.store';

describe('OrganizationMembersService', () => {
  let organizationMembersService: OrganizationMembersService;
  let organizationMembersStore: OrganizationMembersStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganizationMembersService, OrganizationMembersStore],
      imports: [HttpClientTestingModule, MatSnackBarModule],
    });

    organizationMembersService = TestBed.inject(OrganizationMembersService);
    organizationMembersStore = TestBed.inject(OrganizationMembersStore);
  });

  it('should be created', () => {
    expect(organizationMembersService).toBeDefined();
  });
});
