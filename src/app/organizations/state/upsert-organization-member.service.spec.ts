import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UpsertOrganizationMemberService } from './upsert-organization-member.service';
import { UpsertOrganizationMemberStore } from './upsert-organization-member.store';

describe('UpsertOrganizationMemberService', () => {
  let upsertOrganizationMemberService: UpsertOrganizationMemberService;
  let upsertOrganizationMemberStore: UpsertOrganizationMemberStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpsertOrganizationMemberService, UpsertOrganizationMemberStore],
      imports: [ HttpClientTestingModule ]
    });

    upsertOrganizationMemberService = TestBed.get(UpsertOrganizationMemberService);
    upsertOrganizationMemberStore = TestBed.get(UpsertOrganizationMemberStore);
  });

  it('should be created', () => {
    expect(upsertOrganizationMemberService).toBeDefined();
  });

});
