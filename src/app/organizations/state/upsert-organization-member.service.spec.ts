import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { UpsertOrganizationMemberService } from './upsert-organization-member.service';
import { UpsertOrganizationMemberStore } from './upsert-organization-member.store';

describe('UpsertOrganizationMemberService', () => {
  let upsertOrganizationMemberService: UpsertOrganizationMemberService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpsertOrganizationMemberService, UpsertOrganizationMemberStore, UntypedFormBuilder],
      imports: [HttpClientTestingModule, MatSnackBarModule, MatDialogModule],
    });

    upsertOrganizationMemberService = TestBed.inject(UpsertOrganizationMemberService);
    TestBed.inject(UpsertOrganizationMemberStore);
  });

  it('should be created', () => {
    expect(upsertOrganizationMemberService).toBeDefined();
  });
});
