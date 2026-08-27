import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { OrganizationMembersService } from './organization-members.service';
import { OrganizationMembersStore } from './organization-members.store';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('OrganizationMembersService', () => {
  let organizationMembersService: OrganizationMembersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        OrganizationMembersService,
        OrganizationMembersStore,
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    organizationMembersService = TestBed.inject(OrganizationMembersService);
    TestBed.inject(OrganizationMembersStore);
  });

  it('should be created', () => {
    expect(organizationMembersService).toBeDefined();
  });
});
