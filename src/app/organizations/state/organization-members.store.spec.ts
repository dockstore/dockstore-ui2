import { OrganizationMembersStore } from './organization-members.store';

describe('OrganizationMembersStore', () => {
  let store: OrganizationMembersStore;

  beforeEach(() => {
    store = new OrganizationMembersStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});
