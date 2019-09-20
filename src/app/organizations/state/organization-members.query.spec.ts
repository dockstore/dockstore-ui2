import { OrganizationMembersQuery } from './organization-members.query';
import { OrganizationMembersStore } from './organization-members.store';

describe('OrganizationMembersQuery', () => {
  let query: OrganizationMembersQuery;

  beforeEach(() => {
    query = new OrganizationMembersQuery(new OrganizationMembersStore());
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });
});
