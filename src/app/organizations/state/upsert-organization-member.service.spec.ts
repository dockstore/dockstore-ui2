import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UpsertOrganizationMemberService } from './upsert-organization-member.service';
import { UpsertOrganizationMemberStore } from './upsert-organization-member.store';

describe('UpsertOrganizationMemberService', () => {
  let upsertOrganizationMemberService: UpsertOrganizationMemberService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpsertOrganizationMemberService, UpsertOrganizationMemberStore, FormBuilder],
      imports: [HttpClientTestingModule, MatSnackBarModule, MatDialogModule],
    });

    upsertOrganizationMemberService = TestBed.inject(UpsertOrganizationMemberService);
    TestBed.inject(UpsertOrganizationMemberStore);
  });

  it('should be created', () => {
    expect(upsertOrganizationMemberService).toBeDefined();
  });
});
