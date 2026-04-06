import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UpsertOrganizationMemberService } from './upsert-organization-member.service';
import { UpsertOrganizationMemberStore } from './upsert-organization-member.store';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('UpsertOrganizationMemberService', () => {
  let upsertOrganizationMemberService: UpsertOrganizationMemberService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule, MatDialogModule],
      providers: [
        UpsertOrganizationMemberService,
        UpsertOrganizationMemberStore,
        UntypedFormBuilder,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    upsertOrganizationMemberService = TestBed.inject(UpsertOrganizationMemberService);
    TestBed.inject(UpsertOrganizationMemberStore);
  });

  it('should be created', () => {
    expect(upsertOrganizationMemberService).toBeDefined();
  });
});
