import { UpsertOrganizationMemberQuery } from './upsert-organization-member.query';
import { UpsertOrganizationMemberStore } from './upsert-organization-member.store';

describe('UpsertOrganizationMemberQuery', () => {
  let query: UpsertOrganizationMemberQuery;

  beforeEach(() => {
    query = new UpsertOrganizationMemberQuery(new UpsertOrganizationMemberStore());
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });
});
