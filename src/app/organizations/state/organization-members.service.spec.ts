import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { OrganizationMembersService } from './organization-members.service';
import { OrganizationMembersStore } from './organization-members.store';

describe('OrganizationMembersService', () => {
  let organizationMembersService: OrganizationMembersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganizationMembersService, OrganizationMembersStore],
      imports: [HttpClientTestingModule, MatSnackBarModule],
    });

    organizationMembersService = TestBed.inject(OrganizationMembersService);
    TestBed.inject(OrganizationMembersStore);
  });

  it('should be created', () => {
    expect(organizationMembersService).toBeDefined();
  });
});
