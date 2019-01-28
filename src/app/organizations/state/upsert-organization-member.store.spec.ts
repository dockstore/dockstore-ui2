import { UpsertOrganizationMemberStore } from './upsert-organization-member.store';

describe('UpsertOrganizationMemberStore', () => {
  let store: UpsertOrganizationMemberStore;

  beforeEach(() => {
    store = new UpsertOrganizationMemberStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});
