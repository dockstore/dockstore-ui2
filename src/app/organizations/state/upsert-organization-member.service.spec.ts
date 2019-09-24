import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UpsertOrganizationMemberService } from './upsert-organization-member.service';
import { UpsertOrganizationMemberStore } from './upsert-organization-member.store';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';

describe('UpsertOrganizationMemberService', () => {
  let upsertOrganizationMemberService: UpsertOrganizationMemberService;
  let upsertOrganizationMemberStore: UpsertOrganizationMemberStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpsertOrganizationMemberService, UpsertOrganizationMemberStore, FormBuilder],
      imports: [HttpClientTestingModule, MatSnackBarModule, MatDialogModule]
    });

    upsertOrganizationMemberService = TestBed.get(UpsertOrganizationMemberService);
    upsertOrganizationMemberStore = TestBed.get(UpsertOrganizationMemberStore);
  });

  it('should be created', () => {
    expect(upsertOrganizationMemberService).toBeDefined();
  });
});
